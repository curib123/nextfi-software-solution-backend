import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import appConfig from './config/app.config';
import cacheConfig from './config/cache.config';
import cloudinaryConfig from './config/cloudinary.config';
import authConfig from './config/auth.config';
import rateLimitConfig from './config/rate-limit.config';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './cache/cache.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactModule } from './modules/contact/contact.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { ProductsModule } from './modules/products/products.module';
import { ServicesModule } from './modules/services/services.module';
import { SiteSettingsModule } from './modules/site-settings/site-settings.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, cacheConfig, cloudinaryConfig, authConfig, rateLimitConfig],
      validate: validateEnv,
    }),
    ThrottlerModule.forRootAsync({
      inject: [rateLimitConfig.KEY],
      useFactory: (rateLimit: { ttl: number; limit: number }) => ({
        throttlers: [
          {
            ttl: rateLimit.ttl,
            limit: rateLimit.limit,
          },
        ],
      }),
    }),
    PrismaModule,
    CacheModule,
    MediaModule,
    AuthModule,
    ContactModule,
    NewsletterModule,
    ProductsModule,
    ServicesModule,
    SiteSettingsModule,
    ServiceRequestsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
