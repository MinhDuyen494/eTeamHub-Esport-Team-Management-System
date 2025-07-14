import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Player } from './player.entity';

@Entity('roles_in_game')
export class RoleInGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Player, player => player.roleInGame)
  players: Player[];
}   