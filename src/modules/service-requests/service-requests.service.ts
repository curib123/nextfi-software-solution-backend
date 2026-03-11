import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toJsonValue } from '../../common/utils/json.util';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceRequestDto } from './dto/create-service-request.dto';
import { UpdateServiceRequestDto } from './dto/update-service-request.dto';

@Injectable()
export class ServiceRequestsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createServiceRequestDto: CreateServiceRequestDto) {
    const data: Prisma.ServiceRequestCreateInput = {
      fullName: createServiceRequestDto.fullName,
      email: createServiceRequestDto.email,
      company: createServiceRequestDto.company,
      phoneNumber: createServiceRequestDto.phoneNumber,
      systemName: createServiceRequestDto.systemName,
      projectType: createServiceRequestDto.projectType,
      description: createServiceRequestDto.description,
      budgetMin: createServiceRequestDto.budgetMin,
      budgetMax: createServiceRequestDto.budgetMax,
      timeline: createServiceRequestDto.timeline,
      platforms: toJsonValue(createServiceRequestDto.platforms),
      features: toJsonValue(createServiceRequestDto.features),
      referenceLinks: toJsonValue(createServiceRequestDto.referenceLinks),
    };

    return this.prismaService.serviceRequest.create({
      data,
    });
  }

  async findAll() {
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.serviceRequest.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.serviceRequest.count(),
    ]);

    return { items, total };
  }

  async findOne(id: string) {
    const request = await this.prismaService.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Service request not found');
    }

    return request;
  }

  async update(id: string, updateServiceRequestDto: UpdateServiceRequestDto) {
    await this.findOne(id);

    const data: Prisma.ServiceRequestUpdateInput = {
      fullName: updateServiceRequestDto.fullName,
      email: updateServiceRequestDto.email,
      company: updateServiceRequestDto.company,
      phoneNumber: updateServiceRequestDto.phoneNumber,
      systemName: updateServiceRequestDto.systemName,
      projectType: updateServiceRequestDto.projectType,
      description: updateServiceRequestDto.description,
      budgetMin: updateServiceRequestDto.budgetMin,
      budgetMax: updateServiceRequestDto.budgetMax,
      timeline: updateServiceRequestDto.timeline,
      platforms: toJsonValue(updateServiceRequestDto.platforms),
      features: toJsonValue(updateServiceRequestDto.features),
      referenceLinks: toJsonValue(updateServiceRequestDto.referenceLinks),
      status: updateServiceRequestDto.status,
      notes: updateServiceRequestDto.notes,
    };

    return this.prismaService.serviceRequest.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.serviceRequest.delete({ where: { id } });
    return { deleted: true };
  }
}
