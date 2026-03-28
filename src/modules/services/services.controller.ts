import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAccess } from '../../common/decorators/admin-access.decorator';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

@Controller()
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('admin/services')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get('services')
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.servicesService.findAllPublic();
  }

  @Get('services/slug/:slug')
  @ResponseMessage('Fetched successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlugPublic(slug);
  }

  @Get('services/:id')
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOnePublic(id);
  }

  @Get('admin/services')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findAllAdmin() {
    return this.servicesService.findAllAdmin();
  }

  @Get('admin/services/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findOneAdmin(@Param('id') id: string) {
    return this.servicesService.findOneAdmin(id);
  }

  @Patch('admin/services/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete('admin/services/:id')
  @AdminAccess(UserRole.ADMIN)
  @ResponseMessage('Operation successful')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }

  @Post('admin/services/:id/image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
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

  @Delete('admin/services/:id/image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  deleteImage(@Param('id') id: string) {
    return this.servicesService.deleteImageField(id, 'image');
  }

  @Post('admin/services/:id/hero-image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
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

  @Delete('admin/services/:id/hero-image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  deleteHeroImage(@Param('id') id: string) {
    return this.servicesService.deleteImageField(id, 'heroImage');
  }

  @Post('admin/services/:id/og-image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
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

  @Delete('admin/services/:id/og-image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  deleteOgImage(@Param('id') id: string) {
    return this.servicesService.deleteImageField(id, 'ogImage');
  }
}
