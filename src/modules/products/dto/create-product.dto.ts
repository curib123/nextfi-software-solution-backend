import { ProductStatus } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(160)
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @MaxLength(280)
  shortDescription: string;

  @IsString()
  longDescription: string;

  @IsOptional()
  @IsArray()
  features?: unknown[];

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @IsOptional()
  @IsUrl()
  downloadAndroidUrl?: string;

  @IsOptional()
  @IsUrl()
  downloadIosUrl?: string;

  @IsOptional()
  @IsUrl()
  downloadWebUrl?: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;
}
