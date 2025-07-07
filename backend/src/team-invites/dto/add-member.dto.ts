import { IsInt } from 'class-validator';

export class InvitePlayerDto {
  @IsInt()
  playerId: number;
}
