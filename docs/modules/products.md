# Products Module

## Purpose

Manages products and dynamic product landing page content for the website.

## Fields

- Product core fields: `name`, `slug`, descriptions, status, optional download links, GitHub URL
- Flexible content: `features`
- Media fields: `coverImageUrl`, `coverImagePublicId`
- Related gallery model: `ProductImage`

## Endpoints

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

## DTOs

- `CreateProductDto`
- `UpdateProductDto`
- `CreateProductImageDto`

## Services

- `ProductsService`: CRUD, slug management, cache invalidation, cover image handling, and gallery image handling.

## Extensibility

- Add pagination, filtering, search, publishing workflows, and analytics fields.
