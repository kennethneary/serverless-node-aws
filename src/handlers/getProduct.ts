import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse, isConditionalException } from '../utils/utils';
import ProductService from '../services/productService';

// Create clients outside of the handler so container resources reuse is possible
const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling getProduct...', event);
    const { id } = event.pathParameters;
    try {
        const product = await productService.getProduct(id);
        log.info('Calling getProduct... product: ', product);
        if (product === null) {
            throw product;
        }
        return buildResponse(200, product);
    } catch (error) {
        log.error(`Error getProduct...[${error.message}]`, error);
        const errorCode = isConditionalException(error) ? 404 : 500;
        return buildResponse(errorCode);
    }
};
