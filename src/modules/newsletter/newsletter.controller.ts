import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post()
  @ResponseMessage('Operation successful')
  create(@Body() createNewsletterDto: CreateNewsletterDto) {
    return this.newsletterService.create(createNewsletterDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.newsletterService.findAll();
  }
}
