import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Team } from '../../teams/entities/team.entity';
  import { Player } from '../../players/entities/player.entity';
  
  export type InviteStatus = 'pending' | 'accepted' | 'rejected';
  
  @Entity('team_invites')
  export class TeamInvite {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Team, team => team.invites, { eager: true })
    team: Team;
  
    @ManyToOne(() => Player, player => player.invites, { eager: true })
    player: Player;
  
    @Column({ type: 'varchar', default: 'pending' })
    status: InviteStatus;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  