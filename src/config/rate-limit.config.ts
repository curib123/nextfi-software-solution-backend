import { registerAs } from '@nestjs/config';

export default registerAs('rateLimit', () => ({
  ttl: parseInt(process.env.RATE_LIMIT_TTL ?? '60', 10),
  limit: parseInt(process.env.RATE_LIMIT_LIMIT ?? '100', 10),
}));
