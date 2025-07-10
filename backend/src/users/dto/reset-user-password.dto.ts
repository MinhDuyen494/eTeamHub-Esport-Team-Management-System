import { IsString, IsNotEmpty } from 'class-validator';

export class ResetUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
