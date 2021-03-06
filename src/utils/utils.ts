import { APIGatewayProxyResult } from 'aws-lambda';
import { CONDITIONAL_CHECK_FAILED_EXCEPTION } from '../constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildResponse(statusCode: number, data?: any): APIGatewayProxyResult {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        statusCode,
        ...(data && { body: JSON.stringify(data) }),
    };
}

function processHeaders(headers: { [key: string]: string }) {
    return Object.entries(headers).reduce((result, [key, value]) => {
        Object.assign(result, { [key.toLowerCase()]: value });
        return result;
    }, {});
}

function isConditionalException(error) {
    return error.code === CONDITIONAL_CHECK_FAILED_EXCEPTION;
}

export { buildResponse, processHeaders, isConditionalException };
