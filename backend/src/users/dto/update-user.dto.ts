import { IsOptional, IsEmail, IsString, IsIn } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsIn(['leader', 'player','admin'])
  role?: 'leader' | 'player' | 'admin';
} 