import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis | null = null;
  private memoryCache = new Map<string, { value: string, expiresAt?: number }>();
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    try {
      this.client = new Redis(this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379', {
        maxRetriesPerRequest: 1,
        retryStrategy: () => null, // Don't retry endlessly
      });

      this.client.on('error', (err) => {
        this.logger.warn('Redis connection failed, falling back to in-memory cache.');
        this.client?.disconnect();
        this.client = null;
      });
      
      this.client.on('connect', () => {
        this.logger.log('Connected to Redis');
      });
    } catch (e) {
      this.logger.warn('Could not initialize Redis, using in-memory fallback.');
    }
  }

  onModuleDestroy() {
    this.client?.disconnect();
  }

  async get(key: string): Promise<string | null> {
    if (this.client) {
      try {
        return await this.client.get(key);
      } catch (e) {
        // Fallback silently
      }
    }
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryCache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (this.client) {
      try {
        if (ttlSeconds) {
          await this.client.set(key, value, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch (e) {
        // Fallback silently
      }
    }
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.memoryCache.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    if (this.client) {
      try {
        await this.client.del(key);
        return;
      } catch (e) {
        // Fallback
      }
    }
    this.memoryCache.delete(key);
  }
}
