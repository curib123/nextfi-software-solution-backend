import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { CACHE_KEYS } from '../../common/constants';
import { toJsonValue } from '../../common/utils/json.util';
import { slugify } from '../../common/utils/slug.util';
import { CacheService } from '../../cache/cache.service';
import { MediaService } from '../../media/media.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly mediaService: MediaService,
  ) {}

  private async ensureUniqueSlug(slug: string, id?: string) {
    const existing = await this.prismaService.product.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== id) {
      throw new ConflictException('Product slug already exists');
    }
  }

  private async invalidateCache(productId?: string, slug?: string) {
    const keys: string[] = [CACHE_KEYS.products];
    if (productId) {
      keys.push(CACHE_KEYS.productById(productId));
    }
    if (slug) {
      keys.push(CACHE_KEYS.productBySlug(slug));
    }
    await this.cacheService.del(...keys);
  }

  private ensureFile(file?: Express.Multer.File): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
  }

  async create(createProductDto: CreateProductDto) {
    const slug = createProductDto.slug
      ? slugify(createProductDto.slug)
      : slugify(createProductDto.name);

    await this.ensureUniqueSlug(slug);

    const product = await this.prismaService.product.create({
      data: {
        name: createProductDto.name,
        slug,
        shortDescription: createProductDto.shortDescription,
        longDescription: createProductDto.longDescription,
        features: toJsonValue(createProductDto.features),
        status: createProductDto.status ?? ProductStatus.DRAFT,
        downloadAndroidUrl: createProductDto.downloadAndroidUrl,
        downloadIosUrl: createProductDto.downloadIosUrl,
        downloadWebUrl: createProductDto.downloadWebUrl,
        githubUrl: createProductDto.githubUrl,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    await this.invalidateCache(product.id, product.slug);
    return product;
  }

  async findAll() {
    const cached = await this.cacheService.get<{ items: unknown[]; total: number }>(
      CACHE_KEYS.products,
    );

    if (cached) {
      return cached;
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.product.findMany({
        orderBy: [{ createdAt: 'desc' }],
        include: { images: { orderBy: { sortOrder: 'asc' } } },
      }),
      this.prismaService.product.count(),
    ]);

    const response = { items, total };

    await this.cacheService.set(
      CACHE_KEYS.products,
      response,
      this.cacheService.getTtl('products'),
    );

    return response;
  }

  async findOne(id: string): Promise<any> {
    const cacheKey = CACHE_KEYS.productById(id);
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.prismaService.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.cacheService.set(
      cacheKey,
      product,
      this.cacheService.getTtl('products'),
    );

    return product;
  }

  async findBySlug(slug: string): Promise<any> {
    const normalizedSlug = slugify(slug);
    const cacheKey = CACHE_KEYS.productBySlug(normalizedSlug);
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.prismaService.product.findUnique({
      where: { slug: normalizedSlug },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.cacheService.set(
      cacheKey,
      product,
      this.cacheService.getTtl('products'),
    );

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const payload = updateProductDto as Partial<CreateProductDto>;
    const existing = await this.findOne(id);
    const nextSlug = payload.slug
      ? slugify(payload.slug)
      : payload.name
        ? slugify(payload.name)
        : existing.slug;

    await this.ensureUniqueSlug(nextSlug, id);

    const data: Prisma.ProductUpdateInput = {
      name: payload.name,
      slug: nextSlug,
      shortDescription: payload.shortDescription,
      longDescription: payload.longDescription,
      features: toJsonValue(payload.features),
      status: payload.status,
      downloadAndroidUrl: payload.downloadAndroidUrl,
      downloadIosUrl: payload.downloadIosUrl,
      downloadWebUrl: payload.downloadWebUrl,
      githubUrl: payload.githubUrl,
    };

    const updated = await this.prismaService.product.update({
      where: { id },
      data,
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    await this.invalidateCache(id, existing.slug);
    await this.invalidateCache(id, updated.slug);
    return updated;
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    if (product.coverImagePublicId) {
      await this.mediaService.delete(product.coverImagePublicId);
    }

    for (const image of product.images) {
      await this.mediaService.delete(image.imagePublicId);
    }

    await this.prismaService.product.delete({ where: { id } });
    await this.invalidateCache(id, product.slug);

    return { deleted: true };
  }

  async saveCoverImage(
    id: string,
    file: Express.Multer.File | undefined,
    folder: string,
  ) {
    this.ensureFile(file);
    const product = await this.findOne(id);
    const uploaded = await this.mediaService.replace(
      file.buffer,
      file.mimetype,
      folder,
      product.coverImagePublicId,
    );

    const updated = await this.prismaService.product.update({
      where: { id },
      data: {
        coverImageUrl: uploaded.secureUrl,
        coverImagePublicId: uploaded.publicId,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    await this.invalidateCache(id, updated.slug);
    return {
      product: updated,
      upload: uploaded,
    };
  }

  async deleteCoverImage(id: string) {
    const product = await this.findOne(id);

    if (product.coverImagePublicId) {
      await this.mediaService.delete(product.coverImagePublicId);
    }

    const updated = await this.prismaService.product.update({
      where: { id },
      data: {
        coverImageUrl: null,
        coverImagePublicId: null,
      },
      include: { images: { orderBy: { sortOrder: 'asc' } } },
    });

    await this.invalidateCache(id, updated.slug);
    return updated;
  }

  async addImage(
    id: string,
    file: Express.Multer.File | undefined,
    createProductImageDto: CreateProductImageDto,
    folder: string,
  ) {
    this.ensureFile(file);
    const product = await this.findOne(id);
    const uploaded = await this.mediaService.upload(
      file.buffer,
      file.mimetype,
      folder,
    );

    const image = await this.prismaService.productImage.create({
      data: {
        productId: id,
        imageUrl: uploaded.secureUrl,
        imagePublicId: uploaded.publicId,
        altText: createProductImageDto.altText,
        sortOrder: createProductImageDto.sortOrder ?? 0,
      },
    });

    await this.invalidateCache(id, product.slug);

    return {
      image,
      upload: uploaded,
    };
  }

  async deleteImage(id: string, imageId: string) {
    const product = await this.findOne(id);
    const image = await this.prismaService.productImage.findFirst({
      where: { id: imageId, productId: id },
    });

    if (!image) {
      throw new NotFoundException('Product image not found');
    }

    await this.mediaService.delete(image.imagePublicId);
    await this.prismaService.productImage.delete({ where: { id: imageId } });
    await this.invalidateCache(id, product.slug);

    return { deleted: true };
  }
}
