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
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = RedisService_1 = class RedisService {
    configService;
    client = null;
    memoryCache = new Map();
    logger = new common_1.Logger(RedisService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        try {
            this.client = new ioredis_1.Redis(this.configService.get('REDIS_URL') || 'redis://localhost:6379', {
                maxRetriesPerRequest: 1,
                retryStrategy: () => null,
            });
            this.client.on('error', (err) => {
                this.logger.warn('Redis connection failed, falling back to in-memory cache.');
                this.client?.disconnect();
                this.client = null;
            });
            this.client.on('connect', () => {
                this.logger.log('Connected to Redis');
            });
        }
        catch (e) {
            this.logger.warn('Could not initialize Redis, using in-memory fallback.');
        }
    }
    onModuleDestroy() {
        this.client?.disconnect();
    }
    async get(key) {
        if (this.client) {
            try {
                return await this.client.get(key);
            }
            catch (e) {
            }
        }
        const item = this.memoryCache.get(key);
        if (!item)
            return null;
        if (item.expiresAt && Date.now() > item.expiresAt) {
            this.memoryCache.delete(key);
            return null;
        }
        return item.value;
    }
    async set(key, value, ttlSeconds) {
        if (this.client) {
            try {
                if (ttlSeconds) {
                    await this.client.set(key, value, 'EX', ttlSeconds);
                }
                else {
                    await this.client.set(key, value);
                }
                return;
            }
            catch (e) {
            }
        }
        const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
        this.memoryCache.set(key, { value, expiresAt });
    }
    async del(key) {
        if (this.client) {
            try {
                await this.client.del(key);
                return;
            }
            catch (e) {
            }
        }
        this.memoryCache.delete(key);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map