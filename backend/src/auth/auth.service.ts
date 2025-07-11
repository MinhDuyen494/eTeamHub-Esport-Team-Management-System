import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../common/types/user.types';
import * as bcrypt from 'bcryptjs';
import authMessages from './messages/en';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExist = await this.usersService.findByEmail(dto.email);
    if (userExist) throw new ConflictException('Email đã tồn tại!');
    const hash = await bcrypt.hash(dto.password, 10);

    // Đảm bảo chỉ tạo user với role "player" - không cho phép đăng ký leader
    const systemRole: 'player' | 'leader' = 'player';

    return this.usersService.createWithPlayer({
      email: dto.email,
      password: hash,
      role: systemRole, // role của user luôn là "player"
      player: {
        fullName: dto.fullName,
        ign: dto.ign,
        role: dto.role, // role ingame (Top, Jungle, Mid, ADC, Support)
        gameAccount: dto.gameAccount,
      }
    });
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email, { withPlayer: true });
    if (!user) throw new UnauthorizedException(authMessages.INVALID_CREDENTIALS);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(authMessages.INVALID_CREDENTIALS);
    }
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, role: user.role, player: user.player },
      message: authMessages.LOGIN_SUCCESS
    };
  }
}
