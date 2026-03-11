import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  frontendUrl: process.env.FRONTEND_URL ?? '',
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  nodeEnv: process.env.NODE_ENV ?? 'development',
}));
