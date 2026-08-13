export declare enum QRStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED",
    BLOCKED = "BLOCKED"
}
export declare class UpdateQrDto {
    name?: string;
    destinationUrl?: string;
    status?: QRStatus;
}
