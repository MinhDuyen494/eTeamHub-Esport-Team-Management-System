import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Player } from '../../players/entities/player.entity';
import { UserRole } from '../../common/types/user.types';
import { Role } from './roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Lưu hash

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ nullable: true })
  refreshToken: string;

  // Liên kết 1-1 với Player
  @OneToOne(() => Player, player => player.user)
  player: Player;
}

