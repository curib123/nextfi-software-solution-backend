import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateServiceRequestDto {
  @IsString()
  @MaxLength(120)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  systemName: string;

  @IsString()
  projectType: string;

  @IsString()
  description: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budgetMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  budgetMax?: number;

  @IsOptional()
  @IsString()
  timeline?: string;

  @IsOptional()
  @IsArray()
  platforms?: unknown[];

  @IsOptional()
  @IsArray()
  features?: unknown[];

  @IsOptional()
  @IsArray()
  referenceLinks?: unknown[];
}
