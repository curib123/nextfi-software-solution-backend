import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminAccess } from '../../common/decorators/admin-access.decorator';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { RequestWithUser } from '../../common/types/request-with-user.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('Registration successful')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ResponseMessage('Login successful')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Fetched successfully')
  getProfile(@CurrentUser() user: RequestWithUser['user']) {
    return user;
  }

  @Post('logout')
  @AdminAccess(UserRole.ADMIN, UserRole.STAFF)
  @ResponseMessage('Logout successful')
  logout() {
    return this.authService.logout();
  }
}
