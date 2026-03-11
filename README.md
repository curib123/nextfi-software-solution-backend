# NextFi Website Backend

Backend-only NestJS API for the NextFi Software company website and future admin dashboard.

## Stack

- NestJS
- PostgreSQL
- Prisma
- Redis
- Cloudinary
- Google OAuth 2.0
- class-validator / class-transformer

## Features

- Centralized Prisma, Redis, Cloudinary, and auth services
- Google OAuth 2.0 login with user upsert
- Dynamic products and services content models
- Public site data endpoints with Redis caching
- Admin-oriented mutation endpoints protected by JWT auth guard
- Standard API response envelope across modules

## Project Structure

```text
src/
  common/
  config/
  prisma/
  cache/
  media/
  modules/
    auth/
    contact/
    newsletter/
    products/
    services/
    site-settings/
    service-requests/
  app.module.ts
  main.ts
prisma/
docs/
```

## Environment Variables

See [.env.example](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/.env.example).

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

## Google OAuth Setup

1. Create a Google OAuth 2.0 client in Google Cloud Console.
2. Add your backend callback URL from `GOOGLE_CALLBACK_URL`.
3. Add your frontend origin to `FRONTEND_URL`.
4. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` in `.env`.

## Redis Setup

1. Run a Redis instance locally or in your target environment.
2. Fill `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, and `REDIS_DB`.
3. Toggle `CACHE_ENABLED` as needed.

## Cloudinary Setup

1. Create a Cloudinary account.
2. Copy the cloud name, API key, and API secret into `.env`.
3. Set folders for products, services, and general media.

## Prisma Workflow

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run prisma:seed
```

## API Summary

### Auth

- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/profile`
- `POST /auth/logout`

### Contact

- `POST /contact`
- `GET /contact`
- `GET /contact/:id`

### Newsletter

- `POST /newsletter`
- `GET /newsletter`

### Products

- `POST /products`
- `GET /products`
- `GET /products/:id`
- `GET /products/slug/:slug`
- `PATCH /products/:id`
- `DELETE /products/:id`
- `POST /products/:id/cover-image`
- `DELETE /products/:id/cover-image`
- `POST /products/:id/images`
- `DELETE /products/:id/images/:imageId`

### Services

- `POST /services`
- `GET /services`
- `GET /services/:id`
- `GET /services/slug/:slug`
- `PATCH /services/:id`
- `DELETE /services/:id`
- `POST /services/:id/image`
- `DELETE /services/:id/image`
- `POST /services/:id/hero-image`
- `DELETE /services/:id/hero-image`
- `POST /services/:id/og-image`
- `DELETE /services/:id/og-image`

### Site Settings

- `GET /site-settings`
- `PATCH /site-settings`

### Service Requests

- `POST /service-requests`
- `GET /service-requests`
- `GET /service-requests/:id`
- `PATCH /service-requests/:id`
- `DELETE /service-requests/:id`

## Module Docs

- [Auth](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/auth.md)
- [Contact](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/contact.md)
- [Newsletter](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/newsletter.md)
- [Products](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/products.md)
- [Services](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/services.md)
- [Site Settings](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/site-settings.md)
- [Service Requests](/c:/Users/Aikoiyota/Desktop/nextFi/nextfi-software/nextfi-wallet-backend/docs/modules/service-requests.md)
