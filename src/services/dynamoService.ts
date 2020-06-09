import * as log from 'lambda-log';
import { AWSError } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export default class DynamoService {
    private db: DocumentClient;

    constructor() {
        this.db = new DocumentClient();
    }

    async getItem(
        params: DocumentClient.GetItemInput
    ): Promise<PromiseResult<DocumentClient.GetItemOutput, AWSError>> {
        try {
            return await this.db.get(params).promise();
        } catch (error) {
            log.error('getItem failed due to', { error });
            throw error;
        }
    }

    async addItem(
        params: DocumentClient.PutItemInput
    ): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> {
        try {
            return await this.db.put(params).promise();
        } catch (error) {
            log.error('addItem failed due to', { error });
            throw error;
        }
    }

    async updateItem(
        params: DocumentClient.UpdateItemInput
    ): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>> {
        try {
            return await this.db.update(params).promise();
        } catch (error) {
            log.error('updateItem failed due to', { error });
            throw error;
        }
    }

    async deleteItem(
        params: DocumentClient.DeleteItemInput
    ): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>> {
        try {
            return await this.db.delete(params).promise();
        } catch (error) {
            log.error('deleteItem failed due to', { error });
            throw error;
        }
    }

    async query(
        params: DocumentClient.QueryInput
    ): Promise<PromiseResult<DocumentClient.QueryOutput, AWSError>> {
        try {
            return await this.db.query(params).promise();
        } catch (error) {
            log.error('query failed due to', { error });
            throw error;
        }
    }

    async scan(
        params: DocumentClient.ScanInput
    ): Promise<PromiseResult<DocumentClient.ScanOutput, AWSError>> {
        try {
            return await this.db.scan(params).promise();
        } catch (error) {
            log.error('scan failed due to', { error });
            throw error;
        }
    }
}
