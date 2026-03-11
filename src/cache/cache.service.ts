import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly enabled: boolean;
  private readonly ttlDefault: number;
  private readonly ttlProducts: number;
  private readonly ttlServices: number;
  private readonly ttlSiteSettings: number;
  private readonly client?: Redis;

  constructor(private readonly configService: ConfigService) {
    this.enabled = this.configService.getOrThrow<boolean>('cache.enabled');
    this.ttlDefault = this.configService.getOrThrow<number>('cache.ttlDefault');
    this.ttlProducts = this.configService.getOrThrow<number>('cache.ttlProducts');
    this.ttlServices = this.configService.getOrThrow<number>('cache.ttlServices');
    this.ttlSiteSettings = this.configService.getOrThrow<number>(
      'cache.ttlSiteSettings',
    );

    if (!this.enabled) {
      return;
    }

    this.client = new Redis({
      host: this.configService.getOrThrow<string>('cache.host'),
      port: this.configService.getOrThrow<number>('cache.port'),
      password: this.configService.get<string>('cache.password') || undefined,
      db: this.configService.getOrThrow<number>('cache.db'),
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });

    this.client.on('error', (error) => {
      this.logger.warn(`Redis error, falling back to uncached reads: ${error.message}`);
    });

    void this.client.connect().catch((error) => {
      this.logger.warn(`Redis connection failed: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  getTtl(scope: 'default' | 'products' | 'services' | 'siteSettings') {
    switch (scope) {
      case 'products':
        return this.ttlProducts;
      case 'services':
        return this.ttlServices;
      case 'siteSettings':
        return this.ttlSiteSettings;
      default:
        return this.ttlDefault;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client || !this.enabled) {
      return null;
    }

    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      this.logger.warn(`Redis get failed for ${key}: ${(error as Error).message}`);
      return null;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    if (!this.client || !this.enabled) {
      return;
    }

    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl ?? this.ttlDefault);
    } catch (error) {
      this.logger.warn(`Redis set failed for ${key}: ${(error as Error).message}`);
    }
  }

  async del(...keys: string[]): Promise<void> {
    if (!this.client || !this.enabled || keys.length === 0) {
      return;
    }

    try {
      await this.client.del(...keys);
    } catch (error) {
      this.logger.warn(`Redis delete failed: ${(error as Error).message}`);
    }
  }
}
