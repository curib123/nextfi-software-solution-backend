import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNewsletterDto: CreateNewsletterDto) {
    const existing = await this.prismaService.newsletterSubscriber.findUnique({
      where: { email: createNewsletterDto.email },
    });

    if (existing) {
      throw new ConflictException('Email is already subscribed');
    }

    return this.prismaService.newsletterSubscriber.create({
      data: createNewsletterDto,
    });
  }

  async findAll() {
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.newsletterSubscriber.count(),
    ]);

    return { items, total };
  }
}
