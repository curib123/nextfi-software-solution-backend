import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CACHE_KEYS } from '../../common/constants';
import { toJsonValue } from '../../common/utils/json.util';
import { CacheService } from '../../cache/cache.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

@Injectable()
export class SiteSettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async findCurrent(): Promise<any> {
    const cached = await this.cacheService.get<any>(CACHE_KEYS.siteSettings);
    if (cached) {
      return cached;
    }

    const siteSettings =
      (await this.prismaService.siteSetting.findFirst()) ??
      (await this.prismaService.siteSetting.create({
        data: {
          companyName: 'NextFi Software',
          supportEmail: 'support@nextfi-wallet.local',
          businessEmail: 'business@nextfi-wallet.local',
          footerText: 'NextFi Software builds fintech products and custom software.',
          socialLinks: [],
        },
      }));

    await this.cacheService.set(
      CACHE_KEYS.siteSettings,
      siteSettings,
      this.cacheService.getTtl('siteSettings'),
    );

    return siteSettings;
  }

  async update(updateSiteSettingsDto: UpdateSiteSettingsDto) {
    const current = await this.findCurrent();

    const data: Prisma.SiteSettingUpdateInput = {
      companyName: updateSiteSettingsDto.companyName,
      supportEmail: updateSiteSettingsDto.supportEmail,
      businessEmail: updateSiteSettingsDto.businessEmail,
      footerText: updateSiteSettingsDto.footerText,
      socialLinks: toJsonValue(updateSiteSettingsDto.socialLinks),
    };

    const updated = await this.prismaService.siteSetting.update({
      where: { id: current.id },
      data,
    });

    await this.cacheService.del(CACHE_KEYS.siteSettings);
    return updated;
  }
}
