import * as log from 'lambda-log';
import { S3, AWSError } from 'aws-sdk';
import {
    GetObjectRequest,
    PutObjectRequest,
    DeleteObjectRequest,
    GetObjectOutput,
    PutObjectOutput,
    DeleteObjectOutput,
} from 'aws-sdk/clients/s3';
import { PromiseResult } from 'aws-sdk/lib/request';

export default class S3Service {
    private s3: S3;

    constructor() {
        this.s3 = new S3();
    }

    async getObject(
        params: GetObjectRequest
    ): Promise<PromiseResult<GetObjectOutput, AWSError>> {
        // const params: GetObjectRequest = {
        //     Bucket: bucketName,
        //     Key: key,
        // };

        try {
            return await this.s3.getObject(params).promise();
        } catch (error) {
            log.error('getObject failed due to', { error });
            throw error;
        }
    }

    async uploadObject(
        params: PutObjectRequest
    ): Promise<PromiseResult<PutObjectOutput, AWSError>> {
        // const params: PutObjectRequest = {
        //     Bucket: bucketName,
        //     Key: key,
        //     Body: body,
        //     ContentType: contentType,
        //     ...additionalOptions,
        // };

        try {
            return await this.s3.putObject(params).promise();
        } catch (error) {
            log.error('uploadObject failed due to', { error });
            throw error;
        }
    }

    async deleteObject(
        params: DeleteObjectRequest
    ): Promise<PromiseResult<DeleteObjectOutput, AWSError>> {
        // const params: DeleteObjectRequest = {
        //     Bucket: bucketName,
        //     Key: key,
        // };

        try {
            return await this.s3.deleteObject(params).promise();
        } catch (error) {
            log.error('deleteObject failed due to', { error });
            throw error;
        }
    }
}
