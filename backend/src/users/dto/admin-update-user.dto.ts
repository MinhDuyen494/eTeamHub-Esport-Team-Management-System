import { IsOptional, IsString, IsEmail, IsIn } from 'class-validator';

export class AdminUpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['leader', 'player'])
  role?: 'leader' | 'player';
} 