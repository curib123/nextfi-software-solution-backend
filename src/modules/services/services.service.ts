import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ServiceStatus } from '@prisma/client';
import { CACHE_KEYS } from '../../common/constants';
import { toJsonValue } from '../../common/utils/json.util';
import { slugify } from '../../common/utils/slug.util';
import { CacheService } from '../../cache/cache.service';
import { MediaService } from '../../media/media.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
    private readonly mediaService: MediaService,
  ) {}

  private async ensureUniqueSlug(slug: string, id?: string) {
    const existing = await this.prismaService.service.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== id) {
      throw new ConflictException('Service slug already exists');
    }
  }

  private async invalidateCache(serviceId?: string, slug?: string) {
    const keys: string[] = [CACHE_KEYS.services];
    if (serviceId) {
      keys.push(CACHE_KEYS.serviceById(serviceId));
    }
    if (slug) {
      keys.push(CACHE_KEYS.serviceBySlug(slug));
    }
    await this.cacheService.del(...keys);
  }

  private ensureFile(file?: Express.Multer.File): asserts file is Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
  }

  async create(createServiceDto: CreateServiceDto) {
    const slug = createServiceDto.slug
      ? slugify(createServiceDto.slug)
      : slugify(createServiceDto.title);

    await this.ensureUniqueSlug(slug);

    const service = await this.prismaService.service.create({
      data: {
        title: createServiceDto.title,
        slug,
        shortDescription: createServiceDto.shortDescription,
        content: createServiceDto.content,
        status: createServiceDto.status ?? ServiceStatus.DRAFT,
        heroTitle: createServiceDto.heroTitle,
        heroSubtitle: createServiceDto.heroSubtitle,
        heroDescription: createServiceDto.heroDescription,
        overviewTitle: createServiceDto.overviewTitle,
        overviewContent: createServiceDto.overviewContent,
        benefits: toJsonValue(createServiceDto.benefits),
        featuresList: toJsonValue(createServiceDto.featuresList),
        processSteps: toJsonValue(createServiceDto.processSteps),
        faqs: toJsonValue(createServiceDto.faqs),
        ctaTitle: createServiceDto.ctaTitle,
        ctaDescription: createServiceDto.ctaDescription,
        ctaButtonLabel: createServiceDto.ctaButtonLabel,
        seoTitle: createServiceDto.seoTitle,
        seoDescription: createServiceDto.seoDescription,
        seoKeywords: toJsonValue(createServiceDto.seoKeywords),
        isFeatured: createServiceDto.isFeatured,
        sortOrder: createServiceDto.sortOrder,
      },
    });

    await this.invalidateCache(service.id, service.slug);
    return service;
  }

  async findAll() {
    const cached = await this.cacheService.get<{ items: unknown[]; total: number }>(
      CACHE_KEYS.services,
    );

    if (cached) {
      return cached;
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.service.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prismaService.service.count(),
    ]);

    const response = { items, total };

    await this.cacheService.set(
      CACHE_KEYS.services,
      response,
      this.cacheService.getTtl('services'),
    );

    return response;
  }

  async findOne(id: string): Promise<any> {
    const cacheKey = CACHE_KEYS.serviceById(id);
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const service = await this.prismaService.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.cacheService.set(
      cacheKey,
      service,
      this.cacheService.getTtl('services'),
    );

    return service;
  }

  async findBySlug(slug: string): Promise<any> {
    const normalizedSlug = slugify(slug);
    const cacheKey = CACHE_KEYS.serviceBySlug(normalizedSlug);
    const cached = await this.cacheService.get<any>(cacheKey);
    if (cached) {
      return cached;
    }

    const service = await this.prismaService.service.findUnique({
      where: { slug: normalizedSlug },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.cacheService.set(
      cacheKey,
      service,
      this.cacheService.getTtl('services'),
    );

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const payload = updateServiceDto as Partial<CreateServiceDto>;
    const existing = await this.findOne(id);
    const nextSlug = payload.slug
      ? slugify(payload.slug)
      : payload.title
        ? slugify(payload.title)
        : existing.slug;

    await this.ensureUniqueSlug(nextSlug, id);

    const data: Prisma.ServiceUpdateInput = {
      title: payload.title,
      slug: nextSlug,
      shortDescription: payload.shortDescription,
      content: payload.content,
      status: payload.status,
      heroTitle: payload.heroTitle,
      heroSubtitle: payload.heroSubtitle,
      heroDescription: payload.heroDescription,
      overviewTitle: payload.overviewTitle,
      overviewContent: payload.overviewContent,
      benefits: toJsonValue(payload.benefits),
      featuresList: toJsonValue(payload.featuresList),
      processSteps: toJsonValue(payload.processSteps),
      faqs: toJsonValue(payload.faqs),
      ctaTitle: payload.ctaTitle,
      ctaDescription: payload.ctaDescription,
      ctaButtonLabel: payload.ctaButtonLabel,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      seoKeywords: toJsonValue(payload.seoKeywords),
      isFeatured: payload.isFeatured,
      sortOrder: payload.sortOrder,
    };

    const updated = await this.prismaService.service.update({
      where: { id },
      data,
    });

    await this.invalidateCache(id, existing.slug);
    await this.invalidateCache(id, updated.slug);
    return updated;
  }

  async remove(id: string) {
    const service = await this.findOne(id);
    const mediaIds = [
      service.imagePublicId,
      service.heroImagePublicId,
      service.ogImagePublicId,
    ].filter(Boolean) as string[];

    for (const publicId of mediaIds) {
      await this.mediaService.delete(publicId);
    }

    await this.prismaService.service.delete({ where: { id } });
    await this.invalidateCache(id, service.slug);

    return { deleted: true };
  }

  async updateImageField(
    id: string,
    file: Express.Multer.File | undefined,
    folder: string,
    kind: 'image' | 'heroImage' | 'ogImage',
  ) {
    this.ensureFile(file);
    const service = await this.findOne(id);

    const mapping = {
      image: {
        publicId: service.imagePublicId,
        urlField: 'imageUrl',
        publicIdField: 'imagePublicId',
      },
      heroImage: {
        publicId: service.heroImagePublicId,
        urlField: 'heroImageUrl',
        publicIdField: 'heroImagePublicId',
      },
      ogImage: {
        publicId: service.ogImagePublicId,
        urlField: 'ogImageUrl',
        publicIdField: 'ogImagePublicId',
      },
    } as const;

    const target = mapping[kind];
    const uploaded = await this.mediaService.replace(
      file.buffer,
      file.mimetype,
      folder,
      target.publicId,
    );

    const updated = await this.prismaService.service.update({
      where: { id },
      data: {
        [target.urlField]: uploaded.secureUrl,
        [target.publicIdField]: uploaded.publicId,
      },
    });

    await this.invalidateCache(id, updated.slug);
    return {
      service: updated,
      upload: uploaded,
    };
  }

  async deleteImageField(id: string, kind: 'image' | 'heroImage' | 'ogImage') {
    const service = await this.findOne(id);

    const mapping = {
      image: {
        publicId: service.imagePublicId,
        urlField: 'imageUrl',
        publicIdField: 'imagePublicId',
      },
      heroImage: {
        publicId: service.heroImagePublicId,
        urlField: 'heroImageUrl',
        publicIdField: 'heroImagePublicId',
      },
      ogImage: {
        publicId: service.ogImagePublicId,
        urlField: 'ogImageUrl',
        publicIdField: 'ogImagePublicId',
      },
    } as const;

    const target = mapping[kind];
    if (target.publicId) {
      await this.mediaService.delete(target.publicId);
    }

    const updated = await this.prismaService.service.update({
      where: { id },
      data: {
        [target.urlField]: null,
        [target.publicIdField]: null,
      },
    });

    await this.invalidateCache(id, updated.slug);
    return updated;
  }
}
