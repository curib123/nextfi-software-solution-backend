import { ServiceStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @MaxLength(160)
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @MaxLength(280)
  shortDescription: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @IsOptional()
  @IsString()
  heroTitle?: string;

  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @IsOptional()
  @IsString()
  heroDescription?: string;

  @IsOptional()
  @IsString()
  overviewTitle?: string;

  @IsOptional()
  @IsString()
  overviewContent?: string;

  @IsOptional()
  @IsArray()
  benefits?: unknown[];

  @IsOptional()
  @IsArray()
  featuresList?: unknown[];

  @IsOptional()
  @IsArray()
  processSteps?: unknown[];

  @IsOptional()
  @IsArray()
  faqs?: unknown[];

  @IsOptional()
  @IsString()
  ctaTitle?: string;

  @IsOptional()
  @IsString()
  ctaDescription?: string;

  @IsOptional()
  @IsString()
  ctaButtonLabel?: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsArray()
  seoKeywords?: unknown[];

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}
