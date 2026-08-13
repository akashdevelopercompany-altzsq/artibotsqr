export declare enum QRType {
    WEBSITE = "WEBSITE",
    PRODUCT = "PRODUCT",
    PAYMENT = "PAYMENT",
    CUSTOM = "CUSTOM",
    CAMPAIGN = "CAMPAIGN",
    UPI = "UPI"
}
export declare class CreateQrDto {
    name: string;
    destinationUrl: string;
    type?: QRType;
    organizationId?: string;
}
