import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse } from '../utils/utils';
import ProductService from '../services/productService';

const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling getAllProducts...', event);
    const allProducts = await productService.getAllProducts();
    return buildResponse(200, allProducts);
};
