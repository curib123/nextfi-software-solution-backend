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
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Post('admin/products')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('products')
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.productsService.findAllPublic();
  }

  @Get('products/slug/:slug')
  @ResponseMessage('Fetched successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlugPublic(slug);
  }

  @Get('products/:id')
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.productsService.findOnePublic(id);
  }

  @Get('admin/products')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findAllAdmin() {
    return this.productsService.findAllAdmin();
  }

  @Get('admin/products/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findOneAdmin(@Param('id') id: string) {
    return this.productsService.findOneAdmin(id);
  }

  @Patch('admin/products/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete('admin/products/:id')
  @AdminAccess(UserRole.ADMIN)
  @ResponseMessage('Operation successful')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post('admin/products/:id/cover-image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ResponseMessage('Operation successful')
  uploadCoverImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.productsService.saveCoverImage(
      id,
      file,
      this.configService.getOrThrow<string>('cloudinary.folders.products'),
    );
  }

  @Delete('admin/products/:id/cover-image')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  deleteCoverImage(@Param('id') id: string) {
    return this.productsService.deleteCoverImage(id);
  }

  @Post('admin/products/:id/images')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ResponseMessage('Operation successful')
  addImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() createProductImageDto: CreateProductImageDto,
  ) {
    return this.productsService.addImage(
      id,
      file,
      createProductImageDto,
      this.configService.getOrThrow<string>('cloudinary.folders.products'),
    );
  }

  @Delete('admin/products/:id/images/:imageId')
  @AdminAccess(UserRole.ADMIN)
  @ResponseMessage('Operation successful')
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.deleteImage(id, imageId);
  }
}
