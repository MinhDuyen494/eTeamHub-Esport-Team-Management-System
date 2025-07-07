import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findById(payload.sub, { withPlayer: true });
    console.log('JwtStrategy validate user:', user);
    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      player: user.player ? { id: user.player.id } : null,
    };
  }
} 