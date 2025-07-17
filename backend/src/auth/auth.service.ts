import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import authMessagesEn from './messages/en';
import authMessagesVi from './messages/vi';
import { Role } from 'src/users/entities/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
  ) {}

  private getMessages(lang: string = 'en') {
    return lang === 'vi' ? authMessagesVi : authMessagesEn;
  }

  

  async registerUser(dto: RegisterDto, lang: string = 'en') {
    const messages = this.getMessages(lang);
    const userExist = await this.usersService.findByEmail(dto.email);
    if (userExist) throw new ConflictException(messages.USER_ALREADY_EXISTS);

    const user = await this.usersService.createUser({
      email: dto.email,
      password: dto.password,
      role_id: dto.role_id
    });

    return {
      ...user,
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
      refresh_token: this.jwtService.sign(payload, { expiresIn: '3h' }),
      user: { id: user.id, email: user.email, role: user.role, player: user.player },
      message: messages.LOGIN_SUCCESS
    };
  }
}
