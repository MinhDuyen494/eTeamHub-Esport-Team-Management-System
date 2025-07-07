import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  // ID các player muốn thêm vào team
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  memberIds?: number[];
}
