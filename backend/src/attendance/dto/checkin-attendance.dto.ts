import { IsOptional, IsString } from 'class-validator';

export class CheckinAttendanceDto {
  @IsOptional()
  @IsString()
  note?: string;
}
