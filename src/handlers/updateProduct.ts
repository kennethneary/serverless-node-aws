import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse } from '../utils/utils';
import ProductService from '../services/productService';

const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling updateProduct...', event);
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);
    await productService.updateProduct(id, body);
    return buildResponse(200, null);
};
