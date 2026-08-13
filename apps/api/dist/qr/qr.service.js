"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const redis_service_1 = require("../redis/redis.service");
const shortcode_util_1 = require("../util/shortcode.util");
const QRCodeLib = __importStar(require("qrcode"));
let QrService = class QrService {
    prisma;
    redis;
    constructor(prisma, redis) {
        this.prisma = prisma;
        this.redis = redis;
    }
    async create(userId, dto) {
        let orgId = dto.organizationId;
        if (!orgId) {
            const membership = await this.prisma.organizationMember.findFirst({
                where: { userId },
            });
            if (!membership) {
                throw new common_1.BadRequestException('User does not belong to any organization');
            }
            orgId = membership.organizationId;
        }
        let shortCode = (0, shortcode_util_1.generateShortCode)(6);
        let isUnique = false;
        let attempts = 0;
        while (!isUnique && attempts < 5) {
            const existing = await this.prisma.qRCode.findUnique({ where: { shortCode } });
            if (!existing) {
                isUnique = true;
            }
            else {
                shortCode = (0, shortcode_util_1.generateShortCode)(6);
                attempts++;
            }
        }
        if (!isUnique)
            throw new Error('Failed to generate unique shortcode');
        const qrCode = await this.prisma.qRCode.create({
            data: {
                userId,
                organizationId: orgId,
                name: dto.name,
                destinationUrl: dto.destinationUrl,
                shortCode,
                type: dto.type || 'WEBSITE',
                design: {
                    create: {}
                }
            },
        });
        return qrCode;
    }
    async findAllForUser(userId) {
        return this.prisma.qRCode.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { scans: true } } },
        });
    }
    async findOne(id, userId) {
        const qrCode = await this.prisma.qRCode.findUnique({
            where: { id },
            include: { design: true },
        });
        if (!qrCode)
            throw new common_1.NotFoundException('QR Code not found');
        if (qrCode.userId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return qrCode;
    }
    async update(id, userId, dto) {
        const qrCode = await this.findOne(id, userId);
        const updated = await this.prisma.qRCode.update({
            where: { id },
            data: dto,
        });
        await this.redis.del(`qr:${qrCode.shortCode}`);
        return updated;
    }
    async remove(id, userId) {
        const qrCode = await this.findOne(id, userId);
        await this.prisma.qRCode.delete({ where: { id } });
        await this.redis.del(`qr:${qrCode.shortCode}`);
        return { deleted: true };
    }
    async generateImage(id, userId, format = 'png') {
        const qrCode = await this.findOne(id, userId);
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
};
exports.QrService = QrService;
exports.QrService = QrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService])
], QrService);
//# sourceMappingURL=qr.service.js.map