# Site Settings Module

## Purpose

Provides centrally managed website settings and footer/social configuration.

## Fields

- `companyName`
- `supportEmail`
- `businessEmail`
- `footerText`
- `socialLinks`

## Endpoints

- `GET /site-settings`
- `PATCH /site-settings`

## DTOs

- `UpdateSiteSettingsDto`

## Services

- `SiteSettingsService`: reads or initializes the singleton record and manages cache invalidation.

## Extensibility

- Add branding assets, theme settings, locale-specific settings, and SEO defaults.
