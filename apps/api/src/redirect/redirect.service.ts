import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RedirectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async resolveShortCode(shortCode: string): Promise<string> {
    const cacheKey = `qr:${shortCode}`;
    
    // 1. Try resolving from Redis
    const cachedUrl = await this.redis.get(cacheKey);
    if (cachedUrl) {
      this.recordScanAsync(shortCode); // non-blocking
      return cachedUrl;
    }

    // 2. Fallback to DB
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { shortCode },
    });

    if (!qrCode || qrCode.status !== 'ACTIVE') {
      throw new NotFoundException('QR Code not found or inactive');
    }

    if (qrCode.expiresAt && qrCode.expiresAt < new Date()) {
      throw new NotFoundException('QR Code has expired');
    }

    // 3. Populate Cache
    await this.redis.set(cacheKey, qrCode.destinationUrl, 3600); // 1 hour TTL

    this.recordScanAsync(shortCode); // non-blocking

    return qrCode.destinationUrl;
  }

  private recordScanAsync(shortCode: string) {
    // We send this to the background immediately to avoid blocking redirect
    // In production, this might publish to a Redis queue for a worker to pick up
    setImmediate(async () => {
      try {
        const qrCode = await this.prisma.qRCode.findUnique({
          where: { shortCode },
          select: { id: true }
        });
        
        if (qrCode) {
          await this.prisma.qRScan.create({
            data: {
              qrCodeId: qrCode.id,
              // Other tracking fields like ipHash, userAgent can be extracted from request context if needed
            }
          });
        }
      } catch (e) {
        console.error('Error recording scan:', e);
      }
    });
  }
}
