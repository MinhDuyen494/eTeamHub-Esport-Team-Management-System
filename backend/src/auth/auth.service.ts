import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import authMessagesEn from './messages/en';
import authMessagesVi from './messages/vi';
import { Role } from 'src/users/entities/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private getMessages(lang: string = 'en') {
    return lang === 'vi' ? authMessagesVi : authMessagesEn;
  }

  async register(dto: RegisterDto, lang: string = 'en') {
    const messages = this.getMessages(lang);
    const userExist = await this.usersService.findByEmail(dto.email);
    if (userExist) throw new ConflictException(messages.USER_ALREADY_EXISTS);
    const hash = await bcrypt.hash(dto.password, 10);

    // Đảm bảo chỉ tạo user với role "player" - không cho phép đăng ký leader
    const systemRole: Role | 'player' = 'player';

    const result = await this.usersService.createWithPlayer({
      email: dto.email,
      password: hash,
      role: systemRole, // role của user luôn là "player"
      player: {
        fullName: dto.fullName,
        ign: dto.ign,
        roleInGame: dto.roleInGame, // role ingame (Top, Jungle, Mid, ADC, Support)
        gameAccount: dto.gameAccount,
      }
    });

    return {
      ...result,
      message: messages.REGISTER_SUCCESS
    };
  }

  async login(dto: LoginDto, lang: string = 'en') {
    const messages = this.getMessages(lang);
    const user = await this.usersService.findByEmail(dto.email, { withPlayer: true });
    if (!user) throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException(messages.INVALID_CREDENTIALS);
    }
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, email: user.email, role: user.role, player: user.player },
      message: messages.LOGIN_SUCCESS
    };
  }
}
