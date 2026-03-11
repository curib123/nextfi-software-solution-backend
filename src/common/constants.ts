export const RESPONSE_MESSAGE_KEY = 'response_message';

export const CACHE_KEYS = {
  products: 'products',
  productById: (id: string) => `products:id:${id}`,
  productBySlug: (slug: string) => `products:slug:${slug}`,
  services: 'services',
  serviceById: (id: string) => `services:id:${id}`,
  serviceBySlug: (slug: string) => `services:slug:${slug}`,
  siteSettings: 'site-settings',
} as const;

export const CLOUDINARY_ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'] as const;
