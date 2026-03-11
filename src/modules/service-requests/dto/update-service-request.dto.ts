import { PartialType } from '@nestjs/mapped-types';
import { ServiceRequestStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateServiceRequestDto } from './create-service-request.dto';

export class UpdateServiceRequestDto extends PartialType(CreateServiceRequestDto) {
  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
