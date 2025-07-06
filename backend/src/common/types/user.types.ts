import { Player } from '../../players/entities/player.entity';

export type UserRole = 'leader' | 'player';

export interface CreateUserWithPlayerData {
  email: string;
  password: string;
  role: UserRole;
  player: Partial<Player>;
} 