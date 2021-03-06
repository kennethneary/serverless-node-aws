import * as _ from 'lodash';
import * as log from 'lambda-log';
import { v4 as uuidv4 } from 'uuid';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
    GetObjectRequest,
    PutObjectRequest,
    DeleteObjectRequest,
} from 'aws-sdk/clients/s3';
import S3Service from './s3Service';
import DynamoService from './dynamoService';
import { Product } from '../types/Product';
import { Content } from '../types/Content';

export default class ProductService {
    private dynamoService: DynamoService;

    private s3Service: S3Service;

    private static readonly PRODUCT_TABLE: string =
        process.env.PRODUCTS_TABLE_NAME;

    private static readonly PRODUCT_TABLE_PRIMARY_KEY: string =
        process.env.PRODUCTS_TABLE_PRIMARY_ID;

    private static readonly PRODUCT_INDEX_NAME: string =
        process.env.PRODUCTS_TABLE_SECONDARY_INDEX;

    private static readonly S3_BUCKET_NAME: string =
        process.env.PRODUCTS_BUCKET_NAME;

    constructor() {
        this.dynamoService = new DynamoService();
        this.s3Service = new S3Service();
    }

    async getProduct(id: string): Promise<Product> {
        try {
            const dbRequest: DocumentClient.GetItemInput = {
                TableName: ProductService.PRODUCT_TABLE,
                Key: {
                    id,
                },
            };
            const productPromise = this.dynamoService.getItem(dbRequest);
            const productMetadata = await productPromise;
            let product = null;

            if (!_.isNull(productMetadata)) {
                product = { ...(<Product>productMetadata.Item) };

                const s3Request: GetObjectRequest = {
                    Bucket: ProductService.S3_BUCKET_NAME,
                    Key: id,
                };
                const s3Promise = this.s3Service.getObject(s3Request);

                try {
                    const s3data = await s3Promise;
                    product = {
                        ...product,
                        content: {
                            base64Content: s3data.Body.toString('utf-8'),
                            contentType: s3data.ContentType,
                        },
                    };
                } catch (error) {
                    if (error.statusCode !== 404) throw error;
                }
            }

            return product;
        } catch (error) {
            log.error('getProduct failed due to', { error });
            throw error;
        }
    }

    async addProduct(product: Product): Promise<string> {
        try {
            const id = uuidv4();
            const dbRequest: DocumentClient.PutItemInput = {
                TableName: ProductService.PRODUCT_TABLE,
                Item: {
                    ..._.omit(product, 'content'),
                    id,
                },
                ConditionExpression: 'attribute_not_exists(#primaryKey)',
                ExpressionAttributeNames: {
                    '#primaryKey': ProductService.PRODUCT_TABLE_PRIMARY_KEY,
                },
            };
            const addItem = this.dynamoService.addItem(dbRequest);

            let uploadObject;
            if (ProductService.isValidS3Body(product.content)) {
                const s3Request: PutObjectRequest = {
                    Bucket: ProductService.S3_BUCKET_NAME,
                    Key: id,
                    Body: product.content.base64Content,
                    ContentType: product.content.contentType,
                };
                uploadObject = this.s3Service.uploadObject(s3Request);
            }

            // sent both S3 & DynamoDb requests concurrently before trying to resolve
            await addItem;
            await uploadObject;

            return id;
        } catch (error) {
            log.error('addProduct failed due to', { error });
            throw error;
        }
    }

    async updateProduct(id: string, product: Product): Promise<void> {
        try {
            // could use 'put' over and 'update' here and just pass the product object
            const dbRequest: DocumentClient.UpdateItemInput = {
                TableName: ProductService.PRODUCT_TABLE,
                Key: {
                    id,
                },
                UpdateExpression: `
                    set #name = :name,
                    #price = :price,
                    #description = :description,
                    #createdDateTime = :createdDateTime,
                    #lastUpdatedDateTime = :lastUpdatedDateTime
                `,
                ConditionExpression: 'attribute_exists(#primaryKey)',
                ExpressionAttributeNames: {
                    '#primaryKey': ProductService.PRODUCT_TABLE_PRIMARY_KEY,
                    '#name': 'name',
                    '#price': 'price',
                    '#description': 'description',
                    '#createdDateTime': 'createdDateTime',
                    '#lastUpdatedDateTime': 'lastUpdatedDateTime',
                },
                ExpressionAttributeValues: {
                    ':name': product.name,
                    ':price': product.price,
                    ':description': product.description,
                    ':createdDateTime': product.createdDateTime,
                    ':lastUpdatedDateTime': product.lastUpdatedDateTime,
                },
                ReturnValues: 'NONE',
            };

            const updateItem = this.dynamoService.updateItem(dbRequest);

            const isValidS3Object = ProductService.isValidS3Body(
                product.content
            );
            const s3Request: PutObjectRequest | DeleteObjectRequest = {
                Bucket: ProductService.S3_BUCKET_NAME,
                Key: id,
                ...(isValidS3Object && {
                    Body: product.content?.base64Content,
                    ContentType: product.content?.contentType,
                }),
            };

            let updateObject;
            if (isValidS3Object) {
                updateObject = this.s3Service.uploadObject(s3Request);
            } else {
                updateObject = this.s3Service.deleteObject(s3Request);
            }

            // sent both S3 & DynamoDb requests concurrently before trying to resolve
            await updateItem;
            await updateObject;
            return Promise.resolve();
        } catch (error) {
            log.error('updateProduct failed due to', { error });
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<void> {
        try {
            const dbRequest: DocumentClient.DeleteItemInput = {
                TableName: ProductService.PRODUCT_TABLE,
                Key: {
                    id,
                },
                ConditionExpression: 'attribute_exists(#primaryKey)',
                ExpressionAttributeNames: {
                    '#primaryKey': ProductService.PRODUCT_TABLE_PRIMARY_KEY,
                },
            };

            const deleteItem = this.dynamoService.deleteItem(dbRequest);

            const s3Request: DeleteObjectRequest = {
                Bucket: ProductService.S3_BUCKET_NAME,
                Key: id,
            };
            const deleteObject = this.s3Service.deleteObject(s3Request);

            // sent both S3 & DynamoDb requests concurrently before trying to resolve
            await deleteItem;
            await deleteObject;
            return Promise.resolve();
        } catch (error) {
            log.error('deleteProduct failed due to', { error });
            throw error;
        }
    }

    // do not return s3 content. get client to call specific item for performance
    async queryProductsByName(name: string): Promise<Product[]> {
        try {
            const dbRequest: DocumentClient.QueryInput = {
                TableName: ProductService.PRODUCT_TABLE,
                IndexName: ProductService.PRODUCT_INDEX_NAME,
                KeyConditionExpression: '#name = :name',
                ExpressionAttributeNames: {
                    '#name': 'name',
                },
                ExpressionAttributeValues: {
                    ':name': name,
                },
            };

            const { Items } = await this.dynamoService.query(dbRequest);
            return <Product[]>Items;
        } catch (error) {
            log.error('queryProductsByName failed due to', { error });
            throw error;
        }
    }

    // do not return s3 content. get client to call specific item for performance
    async getAllProducts(): Promise<Product[]> {
        try {
            const dbRequest: DocumentClient.QueryInput = {
                TableName: ProductService.PRODUCT_TABLE,
            };
            const { Items } = await this.dynamoService.scan(dbRequest);
            return <Product[]>Items;
        } catch (error) {
            log.error('getAllProducts failed due to', { error });
            throw error;
        }
    }

    private static isValidS3Body(content: Content): boolean {
        return _.has(content, 'base64Content') && _.has(content, 'contentType');
    }
}
