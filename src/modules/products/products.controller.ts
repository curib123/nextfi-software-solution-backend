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
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.productsService.findAll();
  }

  @Get('slug/:slug')
  @ResponseMessage('Fetched successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id')
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  @Post(':id/cover-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ResponseMessage('Operation successful')
  uploadCoverImage(@Param('id') id: string, @UploadedFile() file?: Express.Multer.File) {
    return this.productsService.saveCoverImage(
      id,
      file,
      this.configService.getOrThrow<string>('cloudinary.folders.products'),
    );
  }

  @Delete(':id/cover-image')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  deleteCoverImage(@Param('id') id: string) {
    return this.productsService.deleteCoverImage(id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
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

  @Delete(':id/images/:imageId')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.deleteImage(id, imageId);
  }
}
