import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';
import { ServiceRequestsService } from './service-requests.service';

@Controller('service-requests')
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  @Post()
  @ResponseMessage('Operation successful')
  create(@Body() createServiceRequestDto: CreateServiceRequestDto) {
    return this.serviceRequestsService.create(createServiceRequestDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.serviceRequestsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.serviceRequestsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  update(
    @Param('id') id: string,
    @Body() updateServiceRequestDto: UpdateServiceRequestDto,
  ) {
    return this.serviceRequestsService.update(id, updateServiceRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  remove(@Param('id') id: string) {
    return this.serviceRequestsService.remove(id);
  }
}
