import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ResponseMessage('Operation successful')
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }
}
