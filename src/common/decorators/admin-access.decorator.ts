import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';

export function AdminAccess(...roles: UserRole[]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
}
