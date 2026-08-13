import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';
import { generateShortCode } from '../util/shortcode.util';
import * as QRCodeLib from 'qrcode';

@Injectable()
export class QrService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(userId: string, dto: CreateQrDto) {
    let orgId = dto.organizationId;
    
    if (!orgId) {
      // Find default organization for user
      const membership = await this.prisma.organizationMember.findFirst({
        where: { userId },
      });
      if (!membership) {
        throw new BadRequestException('User does not belong to any organization');
      }
      orgId = membership.organizationId;
    }

    // Generate unique shortCode
    let shortCode = generateShortCode(6);
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await this.prisma.qRCode.findUnique({ where: { shortCode } });
      if (!existing) {
        isUnique = true;
      } else {
        shortCode = generateShortCode(6);
        attempts++;
      }
    }
    if (!isUnique) throw new Error('Failed to generate unique shortcode');

    const qrCode = await this.prisma.qRCode.create({
      data: {
        userId,
        organizationId: orgId,
        name: dto.name,
        destinationUrl: dto.destinationUrl,
        shortCode,
        type: dto.type || 'WEBSITE',
        design: {
          create: {} // default design
        }
      },
    });

    return qrCode;
  }

  async findAllForUser(userId: string) {
    return this.prisma.qRCode.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { scans: true } } },
    });
  }

  async findOne(id: string, userId: string) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { id },
      include: { design: true },
    });
    if (!qrCode) throw new NotFoundException('QR Code not found');
    if (qrCode.userId !== userId) throw new ForbiddenException('Access denied');
    
    return qrCode;
  }

  async update(id: string, userId: string, dto: UpdateQrDto) {
    const qrCode = await this.findOne(id, userId); // verify ownership
    
    const updated = await this.prisma.qRCode.update({
      where: { id },
      data: dto,
    });

    // Invalidate Redis Cache
    await this.redis.del(`qr:${qrCode.shortCode}`);
    
    return updated;
  }

  async remove(id: string, userId: string) {
    const qrCode = await this.findOne(id, userId);
    await this.prisma.qRCode.delete({ where: { id } });
    await this.redis.del(`qr:${qrCode.shortCode}`);
    return { deleted: true };
  }

  async generateImage(id: string, userId: string, format: 'png' | 'svg' = 'png') {
    const qrCode = await this.findOne(id, userId);
    
    // Construct redirect URL
    const baseUrl = process.env.QR_REDIRECT_DOMAIN || 'http://localhost:3001';
    const redirectUrl = `${baseUrl}/q/${qrCode.shortCode}`;

    if (format === 'svg') {
      return QRCodeLib.toString(redirectUrl, {
        type: 'svg',
        color: {
          dark: qrCode.design?.foregroundColor || '#000000',
          light: qrCode.design?.backgroundColor || '#ffffff',
        },
        margin: qrCode.design?.margin || 4,
      });
    }

    return QRCodeLib.toDataURL(redirectUrl, {
      type: 'image/png',
      color: {
        dark: qrCode.design?.foregroundColor || '#000000',
        light: qrCode.design?.backgroundColor || '#ffffff',
      },
      margin: qrCode.design?.margin || 4,
      width: qrCode.design?.size || 300,
    });
  }
}
