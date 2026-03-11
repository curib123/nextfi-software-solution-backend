import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => ({
  enabled: process.env.CACHE_ENABLED === 'true',
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
  password: process.env.REDIS_PASSWORD ?? '',
  db: parseInt(process.env.REDIS_DB ?? '0', 10),
  ttlDefault: parseInt(process.env.REDIS_TTL_DEFAULT ?? '300', 10),
  ttlProducts: parseInt(process.env.REDIS_TTL_PRODUCTS ?? '600', 10),
  ttlServices: parseInt(process.env.REDIS_TTL_SERVICES ?? '600', 10),
  ttlSiteSettings: parseInt(process.env.REDIS_TTL_SITE_SETTINGS ?? '1800', 10),
}));
