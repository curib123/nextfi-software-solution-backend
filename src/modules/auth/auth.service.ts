import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GoogleProfileDto } from './dto/google-profile.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async upsertGoogleUser(profile: GoogleProfileDto) {
    return this.prismaService.user.upsert({
      where: { email: profile.email },
      create: {
        googleId: profile.googleId,
        email: profile.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
      },
      update: {
        googleId: profile.googleId,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
      },
    });
  }

  async handleGoogleLogin(profile: GoogleProfileDto) {
    const user = await this.upsertGoogleUser(profile);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user,
    };
  }

  logout() {
    return {
      loggedOut: true,
    };
  }
}
