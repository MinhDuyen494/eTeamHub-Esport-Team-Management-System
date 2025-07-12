import { Controller, Post, Body, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() dto: RegisterDto, @Headers('accept-language') lang: string = 'en') {
    return this.authService.register(dto, lang);
  }

  @Post('login')
  login(@Body() dto: LoginDto, @Headers('accept-language') lang: string = 'en') {
    return this.authService.login(dto, lang);
  }

  @Post('fix-missing-players')
  async fixPlayers() {
    return this.usersService.fixMissingPlayers();
  }
}
