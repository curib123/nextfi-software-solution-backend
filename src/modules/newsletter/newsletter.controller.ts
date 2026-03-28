import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminAccess } from '../../common/decorators/admin-access.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { NewsletterService } from './newsletter.service';

@Controller()
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('newsletter')
  @ResponseMessage('Operation successful')
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @Get('admin/newsletter')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.newsletterService.findAll();
  }
}
