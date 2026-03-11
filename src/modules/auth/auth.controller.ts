import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';
import { RequestWithUser } from '../../common/types/request-with-user.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    return null;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ResponseMessage('Login successful')
  async googleAuthCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const result = await this.authService.handleGoogleLogin(req.user as never);
    return res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Fetched successfully')
  getProfile(@CurrentUser() user: RequestWithUser['user']) {
    return user;
  }

  @Post('logout')
  @ResponseMessage('Logout successful')
  logout() {
    return this.authService.logout();
  }
}
