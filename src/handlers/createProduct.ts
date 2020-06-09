import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse, isConditionalException } from '../utils/utils';
import ProductService from '../services/productService';

// Create clients outside of the handler so container resources reuse is possible
const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling createProduct...', { event });
    const body = JSON.parse(event.body);
    try {
        const id = await productService.addProduct(body);
        return buildResponse(200, { id });
    } catch (error) {
        log.error(`Error createProduct...[${error.message}]`, { error });
        const errorCode = isConditionalException(error) ? 409 : 500;
        return buildResponse(errorCode);
    }
};
