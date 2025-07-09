import { IsIn, IsOptional, IsString } from 'class-validator';

export class ConfirmAttendanceDto {
  @IsIn(['accepted', 'declined'])
  status: 'accepted' | 'declined';

  @IsOptional()
  @IsString()
  note?: string;
}
