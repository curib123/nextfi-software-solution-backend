import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@example.com',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD ?? 'change-this-password',
  defaultAdminName: process.env.DEFAULT_ADMIN_NAME ?? 'Administrator',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
}));
