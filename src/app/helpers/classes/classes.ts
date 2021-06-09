
//ENUMS
export enum AccountType {
    BUYER = 'Buyer',
    SELLER = 'Seller',
    MARKET_MAKER = 'Market Maker'
}

export interface Product {
    id?: string;
    product: string;
    type: string;
    qty: string;
    unit: string;
    notes: string;
    attachments: Array<Document>;
    shipping: Shipping;
    participants: Array<Participant>;
}

export interface Shipping {
    location: String;
    region: String;
    province: String;
    schedules?: Array<Schedule>;
}

export interface Schedule {
    date?: String;
    time?: String;
    id?: String;
    quantity?: number;
    unit?: String;
}

export interface Participant {
    id: string;
    email: string,
    companyName: string,
    groupName: string,
    mobileNo: any,
}

export interface Document {
    type: string,
    publicID: string,
    date: Date,
    url: string,
    secureUrl: string,
    uniqueId: string,
}

export interface Order {
    _id?: string;
    name?: string;
    dateCreated?: string;
    user?: User;
    lastUpdate?: string;
    startDate: string;
    startTime: string;
    duration: string;
    commodity: string;
    shippingMethod: string;
    payment: PaymentMethod;
    products: Array<Product>
    isSameLocation?: boolean;
}

export interface User {
    id?: String;
}

export interface PaymentMethod {
    method: string,
    option: string,
    channel: string,
    days?: string
}


export enum PaymentMethods {
    CBD = 'Cash before delivery',
    COD = 'Cash on delivery',
    TERMS = 'Terms'
}

