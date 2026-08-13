import { QrService } from './qr.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
export declare class QrController {
    private readonly qrService;
    constructor(qrService: QrService);
    create(user: any, createQrDto: CreateQrDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            type: string;
            expiresAt: Date | null;
            destinationUrl: string;
            status: string;
            userId: string;
            shortCode: string;
        };
    }>;
    findAll(user: any): Promise<{
        success: boolean;
        data: ({
            _count: {
                scans: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            type: string;
            expiresAt: Date | null;
            destinationUrl: string;
            status: string;
            userId: string;
            shortCode: string;
        })[];
    }>;
    findOne(user: any, id: string): Promise<{
        success: boolean;
        data: {
            design: {
                id: string;
                foregroundColor: string;
                backgroundColor: string;
                logoUrl: string | null;
                errorCorrection: string;
                margin: number;
                size: number;
                frameStyle: string | null;
                frameText: string | null;
                qrCodeId: string;
            } | null;
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            type: string;
            expiresAt: Date | null;
            destinationUrl: string;
            status: string;
            userId: string;
            shortCode: string;
        };
    }>;
    update(user: any, id: string, updateQrDto: UpdateQrDto): Promise<{
        success: boolean;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            type: string;
            expiresAt: Date | null;
            destinationUrl: string;
            status: string;
            userId: string;
            shortCode: string;
        };
    }>;
    remove(user: any, id: string): Promise<{
        success: boolean;
        data: {
            deleted: boolean;
        };
    }>;
    generateImage(user: any, id: string, format?: 'png' | 'svg'): Promise<{
        success: boolean;
        data: {
            image: string;
            format: "png" | "svg";
        };
    }>;
}
