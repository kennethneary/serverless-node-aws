import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse } from '../utils/utils';
import ProductService from '../services/productService';

const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling createProduct...', event);
    const body = JSON.parse(event.body);
    const id = await productService.addProduct(body);
    return buildResponse(200, id);
};
