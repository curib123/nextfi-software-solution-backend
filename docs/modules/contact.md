# Contact Module

## Purpose

Captures company website contact submissions and exposes admin retrieval endpoints.

## Fields

- `id`
- `fullName`
- `email`
- `company`
- `subject`
- `message`
- `createdAt`
- `updatedAt`

## Endpoints

- `POST /contact`
- `GET /contact`
- `GET /contact/:id`

## DTOs

- `CreateContactDto`

## Services

- `ContactService`: creates contact entries and fetches contact records.

## Extensibility

- Add spam controls, rate limiting, email notifications, and lead tagging.
