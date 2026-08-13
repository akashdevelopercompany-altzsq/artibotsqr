import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getSummary(user: any, qrCodeId: string): Promise<{
        success: boolean;
        data: {
            totalScans: number;
            uniqueScans: number;
        };
    }>;
    getTimeseries(user: any, qrCodeId: string, days?: string): Promise<{
        success: boolean;
        data: {
            date: Date;
            count: number;
        }[];
    }>;
    getDevices(user: any, qrCodeId: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
