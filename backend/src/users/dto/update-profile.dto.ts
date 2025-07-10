import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString()
  fullName?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  ign?: string; // Ingame name

  @IsOptional() @IsString()
  gameAccount?: string;
}
