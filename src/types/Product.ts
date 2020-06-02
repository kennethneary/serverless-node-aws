import { Content } from './Content';

export interface Product {
    id: string;
    name: string;
    price: string;
    content?: Content;
    description: string;
    createdDateTime: string;
    lastUpdatedDateTime: string;
}
