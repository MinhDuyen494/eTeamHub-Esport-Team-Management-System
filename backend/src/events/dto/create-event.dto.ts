import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateEventDto {
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

  @IsNotEmpty()
  teamId: number;
}
