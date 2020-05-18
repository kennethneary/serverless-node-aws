import { APIGatewayProxyHandler } from 'aws-lambda';
import { buildResponse } from './utils/utils';
import * as log from 'lambda-log';


export const handler: APIGatewayProxyHandler = async (event) => {
  log.info('test');
  return buildResponse(200, null);
}

