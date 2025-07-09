import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class TeamReportDto {
  @IsNotEmpty()
  teamId: number;

  @IsOptional()
  @IsDateString()
  startDate?: string; // ISO date string

  @IsOptional()
  @IsDateString()
  endDate?: string; // ISO date string
} 