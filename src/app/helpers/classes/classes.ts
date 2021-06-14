export enum OrderStatus {
    FOR_APPROVAL = "For Approval",
    WAITING = "Waiting",
    DENIED = "Denied",
    OVERDUE = "Overdue",
    OPEN = "Open",
    CANCELLED = "Cancelled",

    CLOSED_SOLD = 'Closed Sold',
    CLOSED_EXPIRED_OFFER = 'Closed Expired Offer',
    CLOSED_EXPIRED_AUCTION = 'Closed Expired Auction',
    CLOSED_PAID = 'Closed Paid',

    EXPIRED = "Expired",//
    SOLD = "Sold",//
    CLOSED = "Closed",

    AUCTION_ENDED = 'Auction Ended',

    NEW_PURCAHSE_ORDER = 'New Purchase Order',
    FOR_BUYER_PAYMENT = 'For Buyer Payment',
    BUYER_PAYMENT_VERIFICATION = 'Buyer Payment Verification',
    SELLER_PAYMENT = 'Seller Payment',
    SELLER_PAYMENT_VERIFICATION = 'Seller Payment Verification',
    FOR_DELIVERY = 'For Delivery',
    IN_TRANSIT = 'In Transit',
    PRODUCT_DELIVERED = 'Product Delivered',
    CLOSED_DEAL = 'Closed Deal',

    FOR_REVIEW = 'For Review',
    SELLER_CONFIRMATION = 'Seller Confirmation',
    BUYER_CONFIRMATION = 'Buyer Confirmation',

    DELIVERY_CONFIRMATION = 'Delivery Confirmation',

    BALANCE_PAYMENT = 'Balance Payment',
    BALANCE_PAYMENT_VERIFICATION = 'Balance Payment Verification',
}

export enum OfferStatus {
    OPEN = "Open",
}

export enum AccountType {
    BUYER = 'Buyer',
    SELLER = 'Seller',
    MARKET_MAKER = 'Market Maker'
}

export enum TaxRateType {
    VAT_REGISTERED = 'VAT Registered',
    ZERO_RATED = 'Zero Rated',
    TAX_EXEMPT = 'Tax Exempted'
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

export enum StepStatus {
    COMPLETE = "complete",
    ONGOING = "ongoing",
    INCOMPLETE = "incomplete",
}
export enum COLOR {
    'BLUE' = '#0FADF6',
    'AMBER' = '#f5a623',
    'GREEN' = '#66bb6a',
    'RED' = '#ef5350',
    'ORANGE' = '#FF7043',
    'PINK' = '#C51162',
    'PURPLE' = '#AB47BC',
    'BLUEGRAY' = '#78909c',
}