import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminAccess } from '../../common/decorators/admin-access.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestsService } from './service-requests.service';

@Controller()
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post('service-requests')
  @ResponseMessage('Operation successful')
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get('admin/service-requests')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.serviceRequestsService.findAll();
  }

  @Get('admin/service-requests/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch('admin/service-requests/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  update(
    @Param('id') id: string,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto,
  ) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  @Delete('admin/service-requests/:id')
  @AdminAccess(UserRole.ADMIN)
  @ResponseMessage('Operation successful')
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(id);
  }
}
