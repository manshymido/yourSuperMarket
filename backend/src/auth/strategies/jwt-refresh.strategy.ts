import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../common/prisma.service';

interface JwtRefreshPayload {
  sub: string;
  jti: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET as string,
    });
  }

  async validate(payload: JwtRefreshPayload) {
    const token = await this.prisma.refreshToken.findUnique({
      where: { token: payload.jti },
      include: { user: true },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!token.user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    return token.user;
  }
}
