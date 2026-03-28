import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AdminAccess } from '../../common/decorators/admin-access.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  @ResponseMessage('Operation successful')
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get('admin/contact')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findAll() {
    return this.contactService.findAll();
  }

  @Get('admin/contact/:id')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }
}
