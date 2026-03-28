import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async buildAuthResponse(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found');
    }

    const permissions = user.role.permissions.map(({ permission }) => permission.key);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role.name,
      permissions,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        role: user.role.name,
        permissions,
      },
    };
  }

  async register(payload: RegisterDto) {
    const email = payload.email.trim().toLowerCase();
    const existing = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const staffRole = await this.prismaService.role.findUnique({
      where: { name: UserRole.STAFF },
    });

    if (!staffRole) {
      throw new UnauthorizedException('Default role is not configured');
    }

    const passwordHash = await hash(payload.password, 12);
    const user = await this.prismaService.user.create({
      data: {
        email,
        fullName: payload.fullName.trim(),
        passwordHash,
        avatarUrl: payload.avatarUrl?.trim() || null,
        roleId: staffRole.id,
      },
    });

    return this.buildAuthResponse(user.id);
  }

  async login(payload: LoginDto) {
    const email = payload.email.trim().toLowerCase();
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await compare(payload.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(user.id);
  }

  logout() {
    return {
      loggedOut: true,
    };
  }
}
