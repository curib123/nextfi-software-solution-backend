type EnvRecord = Record<string, string | undefined>;

const requiredVariables = [
  'PORT',
  'DATABASE_URL',
  'FRONTEND_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_DB',
  'REDIS_TTL_DEFAULT',
  'REDIS_TTL_PRODUCTS',
  'REDIS_TTL_SERVICES',
  'REDIS_TTL_SITE_SETTINGS',
  'RATE_LIMIT_TTL',
  'RATE_LIMIT_LIMIT',
  'CACHE_ENABLED',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_FOLDER_PRODUCTS',
  'CLOUDINARY_FOLDER_SERVICES',
  'CLOUDINARY_FOLDER_GENERAL',
  'DEFAULT_ADMIN_EMAIL',
  'DEFAULT_ADMIN_PASSWORD',
  'DEFAULT_ADMIN_NAME',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'NODE_ENV',
  'API_PREFIX',
];

export function validateEnv(config: EnvRecord) {
  const missing = requiredVariables.filter(
    (key) => config[key] === undefined || config[key] === '',
  );

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return config;
}
