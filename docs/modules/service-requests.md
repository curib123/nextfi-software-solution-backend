# Service Requests Module

## Purpose

Collects inbound custom software and fintech system requests from prospective clients.

## Fields

- Contact fields: `fullName`, `email`, `company`, `phoneNumber`
- Request fields: `systemName`, `projectType`, `description`, `timeline`
- Flexible JSON fields: `platforms`, `features`, `referenceLinks`
- Budget and status tracking fields: `budgetMin`, `budgetMax`, `status`, `notes`

## Endpoints

- `POST /service-requests`
- `GET /service-requests`
- `GET /service-requests/:id`
- `PATCH /service-requests/:id`
- `DELETE /service-requests/:id`

## DTOs

- `CreateServiceRequestDto`
- `UpdateServiceRequestDto`

## Services

- `ServiceRequestsService`: create, read, update, and delete request records.

## Extensibility

- Add assignment, workflow automations, CRM sync, and lead-scoring fields.
