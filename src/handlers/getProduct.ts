import * as log from 'lambda-log';
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { buildResponse } from '../utils/utils';
import ProductService from '../services/productService';

// Create clients outside of the handler so container resources reuse is possible
const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling getProduct...', { event });
    const { id } = event.pathParameters;
    try {
        const product = await productService.getProduct(id);
        log.info('Calling getProduct... product: ', { product });
        if (product === null) {
            return buildResponse(404);
        }
        return buildResponse(200, product);
    } catch (error) {
        log.error(`Error getProduct...[${error.message}]`, { error });
        return buildResponse(500);
    }
};
