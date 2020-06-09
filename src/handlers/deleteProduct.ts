import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import * as log from 'lambda-log';
import { buildResponse, isConditionalException } from '../utils/utils';
import ProductService from '../services/productService';

// Create clients outside of the handler so container resources reuse is possible
const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling deleteProduct...', { event });
    const { id } = event.pathParameters;
    try {
        await productService.deleteProduct(id);
        return buildResponse(200);
    } catch (error) {
        log.error(`Error deleteProduct...[${error.message}]`, { error });
        const errorCode = isConditionalException(error) ? 404 : 500;
        return buildResponse(errorCode);
    }
};
