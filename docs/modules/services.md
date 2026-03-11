# Services Module

## Purpose

Manages services and fully dynamic service landing pages for the company website.

## Fields

- Content fields: `title`, `slug`, `shortDescription`, `content`
- Hero section fields: titles, descriptions, hero image
- Landing page JSON fields: `benefits`, `featuresList`, `processSteps`, `faqs`, `seoKeywords`
- CTA and SEO fields
- Ordering and featuring fields

## Endpoints

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

## DTOs

- `CreateServiceDto`
- `UpdateServiceDto`

## Services

- `ServicesService`: CRUD, slug management, Redis caching, and Cloudinary-backed image lifecycle.

## Extensibility

- Add sectional landing-page blocks, A/B test metadata, and SEO automation.
