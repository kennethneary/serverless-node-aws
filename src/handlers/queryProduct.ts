import * as log from 'lambda-log';
import * as _ from 'lodash';
import { APIGatewayProxyHandler, APIGatewayProxyEvent } from 'aws-lambda';
import { buildResponse } from '../utils/utils';
import ProductService from '../services/productService';

// Create clients outside of the handler so container resources reuse is possible
const productService = new ProductService();

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
) => {
    log.info('Calling queryProduct...', { event });
    const { name } = event.queryStringParameters;
    if (_.isEmpty(name)) {
        return buildResponse(400);
    }
    const products = await productService.queryProductsByName(name);
    return buildResponse(200, products);
};
