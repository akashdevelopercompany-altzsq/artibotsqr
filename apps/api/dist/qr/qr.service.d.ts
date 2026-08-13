import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
export declare class QrService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    create(userId: string, dto: CreateQrDto): Promise<{
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
    }>;
    findAllForUser(userId: string): Promise<({
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
    })[]>;
    findOne(id: string, userId: string): Promise<{
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
    }>;
    update(id: string, userId: string, dto: UpdateQrDto): Promise<{
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
    }>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    generateImage(id: string, userId: string, format?: 'png' | 'svg'): Promise<string>;
}
