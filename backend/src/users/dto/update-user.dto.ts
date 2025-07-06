import { IsOptional, IsEmail, IsString, IsIn } from 'class-validator';
import { UserRole } from '../../common/types/user.types';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsIn(['leader', 'player'])
  role?: UserRole;
} 