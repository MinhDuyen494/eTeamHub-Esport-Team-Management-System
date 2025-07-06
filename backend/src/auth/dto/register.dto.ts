import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string; // Tạo player luôn khi đăng ký

  @IsString()
  ign: string;

  @IsString()
  role: string; // Đây là role của player (vai trò ingame: Top, Jungle, Mid, ADC, Support)

  @IsString()
  gameAccount: string;
}
