import { IsString, IsOptional, IsArray, IsInt, IsNumber } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  leaderId?: number;

  // ID các player muốn thêm vào team
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  memberIds?: number[];
}
