import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  @ResponseMessage('Fetched successfully')
  findCurrent() {
    return this.siteSettingsService.findCurrent();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Operation successful')
  update(@Body() updateSiteSettingsDto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(updateSiteSettingsDto);
  }
}
