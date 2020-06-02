import { Body, ContentType } from 'aws-sdk/clients/s3';

export interface Content {
    base64Content: Body;
    contentType: ContentType;
}
