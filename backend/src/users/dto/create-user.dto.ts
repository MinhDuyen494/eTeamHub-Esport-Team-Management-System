import { IsEmail, IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @Type(() => Number)
  @IsNumber()
  role_id: number;
} 