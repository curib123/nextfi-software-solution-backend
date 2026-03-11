# Auth Module

## Purpose

Handles Google OAuth 2.0 login, user upsert, JWT issuance, and authenticated profile access.

## Fields

- `User.id`
- `User.googleId`
- `User.email`
- `User.fullName`
- `User.avatarUrl`
- `User.role`
- `User.createdAt`
- `User.updatedAt`

## Endpoints

- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/profile`
- `POST /auth/logout`

## DTOs

- `GoogleProfileDto`

## Services

- `AuthService`: upserts Google users and signs JWT access tokens.
- `GoogleStrategy`: bridges Passport Google OAuth to NestJS.
- `JwtStrategy`: validates bearer tokens for protected routes.

## Extensibility

- Add role guards for admin-only routes.
- Add refresh-token rotation if session persistence becomes necessary.
