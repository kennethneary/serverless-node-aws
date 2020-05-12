import {DynamoDB} from 'aws-sdk';

const db = new DynamoDB.DocumentClient();

async function getItem(params) {
    return await db.get(params).promise();
}

async function addItem(params) {
    return await db.put(params).promise();
}

async function updateItem(params) {
    return await db.update(params).promise();
}

export {
    getItem,
    addItem,
    updateItem
};