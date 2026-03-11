import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
  apiKey: process.env.CLOUDINARY_API_KEY ?? '',
  apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  folders: {
    products: process.env.CLOUDINARY_FOLDER_PRODUCTS ?? 'nextfi/products',
    services: process.env.CLOUDINARY_FOLDER_SERVICES ?? 'nextfi/services',
    general: process.env.CLOUDINARY_FOLDER_GENERAL ?? 'nextfi/general',
  },
}));
