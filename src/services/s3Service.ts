import {S3} from 'aws-sdk';
import * as log from 'lambda-log';

class S3Service {

    private s3: S3;

    constructor() {
        this.s3 = new S3();
    }
    
    async getObject(bucketName, params: S3.Types.GetObjectRequest) {
        try {
            return await this.s3.getObject(params).promise();
        } catch(error) {
            log.error('getObject failed due to', error);
        }
    }
    
    async uploadObject(bucketName, params: S3.Types.PutObjectRequest) {
        try {
            return await this.s3.putObject(params).promise();
        } catch(error) {
            log.error('uploadObject failed due to', error);
        }
    }

    async deleteObject(bucketName, params: S3.Types.DeleteObjectRequest) {
        try {
            return await this.s3.deleteObject(params).promise();
        } catch(error) {
            log.error('deleteObject failed due to', error);
        }
    }

}

export {
    S3Service
};