import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { UserRole } from '../../common/types/user.types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Lưu hash

  @Column({ type: 'enum', enum: ['leader', 'player', 'admin'], default: 'player' })
  role: UserRole;

  @Column({ nullable: true })
  refreshToken: string;

  // Liên kết 1-1 với Player
  @OneToOne(() => Player, player => player.user)
  player: Player;
}
