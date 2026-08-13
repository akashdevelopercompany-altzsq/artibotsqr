"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary(qrCodeId, userId) {
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
    async getTimeseries(qrCodeId, userId, days = 30) {
        await this.verifyOwnership(qrCodeId, userId);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
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
        }, {});
        const data = Object.entries(grouped).map(([date, count]) => ({
            date: new Date(date),
            count
        })).sort((a, b) => a.date.getTime() - b.date.getTime());
        return data;
    }
    async getDevices(qrCodeId, userId) {
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
    async verifyOwnership(qrCodeId, userId) {
        const qrCode = await this.prisma.qRCode.findUnique({ where: { id: qrCodeId } });
        if (!qrCode)
            throw new common_1.NotFoundException('QR Code not found');
        if (qrCode.userId !== userId)
            throw new common_1.ForbiddenException('Access denied');
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map