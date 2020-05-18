import {DynamoDB} from 'aws-sdk';
import * as log from 'lambda-log';

class DynamoService {

    private db: DynamoDB.DocumentClient;

    constructor() {
        this.db = new DynamoDB.DocumentClient();
    }

    async getItem(params: DynamoDB.DocumentClient.GetItemInput) {
        try {
            return await this.db.get(params).promise();
        } catch(error) {
            log.error('getItem failed due to', error);
        }
    }

    async addItem(params: DynamoDB.DocumentClient.PutItemInput) {
        try {
            return await this.db.put(params).promise();
        } catch(error) {
            log.error('addItem failed due to', error);
        }
    }

    async updateItem(params: DynamoDB.DocumentClient.UpdateItemInput) {
        try {
            return await this.db.update(params).promise();
        } catch(error) {
            log.error('updateItem failed due to', error);
        }
    }

    async deleteItem(params: DynamoDB.DocumentClient.DeleteItemInput) {
        try {
            return await this.db.delete(params).promise();
        } catch(error) {
            log.error('deleteItem failed due to', error);
        }
    }

    async query(params: DynamoDB.DocumentClient.QueryInput) {
        try {
            return await this.db.query(params).promise();
        } catch(error) {
            log.error('query failed due to', error);
        }
    }
}

export {
    DynamoService
};