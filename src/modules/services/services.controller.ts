import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('slug/:slug')
  @ResponseMessage('Fetched successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @Get(':id')
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ResponseMessage('Operation successful')
  uploadImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.servicesService.updateImageField(
      id,
      file,
      this.configService.getOrThrow<string>('cloudinary.folders.services'),
      'image',
    );
  }

  @Delete(':id/image')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  deleteImage(@Param('id') id: string) {
    return this.servicesService.deleteImageField(id, 'image');
  }

  @Post(':id/hero-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ResponseMessage('Operation successful')
  uploadHeroImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.servicesService.updateImageField(
      id,
      file,
      this.configService.getOrThrow<string>('cloudinary.folders.services'),
      'heroImage',
    );
  }

  @Delete(':id/hero-image')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  deleteHeroImage(@Param('id') id: string) {
    return this.servicesService.deleteImageField(id, 'heroImage');
  }

  @Post(':id/og-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ResponseMessage('Operation successful')
  uploadOgImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.servicesService.updateImageField(
      id,
      file,
      this.configService.getOrThrow<string>('cloudinary.folders.services'),
      'ogImage',
    );
  }

  @Delete(':id/og-image')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  deleteOgImage(@Param('id') id: string) {
    return this.servicesService.deleteImageField(id, 'ogImage');
  }
}
