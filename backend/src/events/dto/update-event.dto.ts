import { IsOptional, IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endTime: Date;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  teamId?: number;
}