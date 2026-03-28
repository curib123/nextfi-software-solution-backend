import { Body, Controller, Get, Patch } from '@nestjs/common';
import { AdminAccess } from '../../common/decorators/admin-access.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';
import { SiteSettingsService } from './site-settings.service';

@Controller()
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get('site-settings')
  @ResponseMessage('Fetched successfully')
  findCurrent() {
    return this.siteSettingsService.findCurrent();
  }

  @Get('admin/site-settings')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findCurrentAdmin() {
    return this.siteSettingsService.findCurrent();
  }

  @Patch('admin/site-settings')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Operation successful')
  update(@Body() updateSiteSettingsDto: UpdateSiteSettingsDto) {
    return this.siteSettingsService.update(updateSiteSettingsDto);
  }
}
