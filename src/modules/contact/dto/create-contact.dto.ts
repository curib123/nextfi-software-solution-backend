import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @MaxLength(120)
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string;

  @IsString()
  @MaxLength(160)
  subject: string;

  @IsString()
  @MaxLength(5000)
  message: string;
}
