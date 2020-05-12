import {S3} from 'aws-sdk';

const s3 = new S3();

async function getSignedUrl(bucketName, params) {
    // return await s3.getSignedUrlPromise('getObject', params);
}

async function getObject(bucketName, params) {
    return await s3.getObject(params).promise();
}

async function uploadObject(bucketName, params) {
    return await s3.putObject(params).promise();
}