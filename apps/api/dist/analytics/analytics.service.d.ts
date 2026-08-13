import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSummary(qrCodeId: string, userId: string): Promise<{
        totalScans: number;
        uniqueScans: number;
    }>;
    getTimeseries(qrCodeId: string, userId: string, days?: number): Promise<{
        date: Date;
        count: number;
    }[]>;
    getDevices(qrCodeId: string, userId: string): Promise<{
        devices: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.QRScanGroupByOutputType, "deviceType"[]> & {
            _count: {
                id: number;
            };
        })[];
        os: (import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.QRScanGroupByOutputType, "os"[]> & {
            _count: {
                id: number;
            };
        })[];
    }>;
    private verifyOwnership;
}
