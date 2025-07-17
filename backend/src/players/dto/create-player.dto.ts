import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  ign: string;

  @IsNotEmpty()
  @IsString()
  roleInGame: string;

  @IsNotEmpty()
  @IsString()
  gameAccount: string;
} 