import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleProfileDto } from '../dto/google-profile.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('auth.googleClientId'),
      clientSecret: configService.getOrThrow<string>('auth.googleClientSecret'),
      callbackURL: configService.getOrThrow<string>('auth.googleCallbackUrl'),
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const payload: GoogleProfileDto = {
      googleId: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      fullName: profile.displayName,
      avatarUrl: profile.photos?.[0]?.value,
    };

    done(null, payload);
  }
}
