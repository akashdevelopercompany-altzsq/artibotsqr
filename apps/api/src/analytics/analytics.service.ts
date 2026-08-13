import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(qrCodeId: string, userId: string) {
    await this.verifyOwnership(qrCodeId, userId);

    const totalScans = await this.prisma.qRScan.count({
      where: { qrCodeId }
    });

    const uniqueScansCount = await this.prisma.qRScan.groupBy({
      by: ['ipHash'],
      where: { qrCodeId, ipHash: { not: null } },
    });

    return {
      totalScans,
      uniqueScans: uniqueScansCount.length,
    };
  }

  async getTimeseries(qrCodeId: string, userId: string, days: number = 30) {
    await this.verifyOwnership(qrCodeId, userId);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch and group in memory for universal SQLite/PostgreSQL compatibility
    const scans = await this.prisma.qRScan.findMany({
      where: {
        qrCodeId,
        scannedAt: { gte: startDate }
      },
      select: { scannedAt: true }
    });

    const grouped = scans.reduce((acc, scan) => {
      const date = scan.scannedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(grouped).map(([date, count]) => ({
      date: new Date(date),
      count
    })).sort((a, b) => a.date.getTime() - b.date.getTime());

    return data;
  }

  async getDevices(qrCodeId: string, userId: string) {
    await this.verifyOwnership(qrCodeId, userId);

    const devices = await this.prisma.qRScan.groupBy({
      by: ['deviceType'],
      where: { qrCodeId, deviceType: { not: null } },
      _count: { id: true },
    });

    const os = await this.prisma.qRScan.groupBy({
      by: ['os'],
      where: { qrCodeId, os: { not: null } },
      _count: { id: true },
    });

    return { devices, os };
  }

  private async verifyOwnership(qrCodeId: string, userId: string) {
    const qrCode = await this.prisma.qRCode.findUnique({ where: { id: qrCodeId } });
    if (!qrCode) throw new NotFoundException('QR Code not found');
    if (qrCode.userId !== userId) throw new ForbiddenException('Access denied');
  }
}
