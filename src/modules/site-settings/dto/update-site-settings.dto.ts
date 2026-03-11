import { IsArray, IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  companyName?: string;

  @IsOptional()
  @IsEmail()
  supportEmail?: string;

  @IsOptional()
  @IsEmail()
  businessEmail?: string;

  @IsOptional()
  @IsString()
  footerText?: string;

  @IsOptional()
  @IsArray()
  socialLinks?: unknown[];
}
