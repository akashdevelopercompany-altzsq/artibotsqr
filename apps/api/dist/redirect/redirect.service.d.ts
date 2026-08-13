import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class RedirectService {
    private readonly prisma;
    private readonly redis;
    constructor(prisma: PrismaService, redis: RedisService);
    resolveShortCode(shortCode: string): Promise<string>;
    private recordScanAsync;
}
