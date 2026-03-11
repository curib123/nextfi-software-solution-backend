# Newsletter Module

## Purpose

Stores newsletter subscriptions and prevents duplicate emails.

## Fields

- `id`
- `email`
- `createdAt`
- `updatedAt`

## Endpoints

- `POST /newsletter`
- `GET /newsletter`

## DTOs

- `CreateNewsletterDto`

## Services

- `NewsletterService`: validates uniqueness and reads subscriber lists.

## Extensibility

- Add external newsletter provider sync and unsubscribe workflows.
