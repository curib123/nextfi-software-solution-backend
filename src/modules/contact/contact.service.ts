import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createContactDto: CreateContactDto) {
    return this.prismaService.contact.create({
      data: createContactDto,
    });
  }

  async findAll() {
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.contact.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.contact.count(),
    ]);

    return { items, total };
  }

  async findOne(id: string) {
    const contact = await this.prismaService.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Contact record not found');
    }

    return contact;
  }
}
