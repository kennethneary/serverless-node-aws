import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse } from '../utils/utils';
import ProductService from '../services/productService';

const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling deleteProduct...', event);
    const { id } = event.pathParameters;
    await productService.deleteProduct(id);
    return buildResponse(200, null);
};
