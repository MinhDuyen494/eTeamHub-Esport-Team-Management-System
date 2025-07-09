import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Player } from '../../players/entities/player.entity';
import { TeamInvite } from '../../team-invites/entities/team-invite.entity';
import { Event } from '../../events/entities/event.entity';
  
  @Entity('teams')
  export class Team {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  
    @Column({ nullable: true })
    description: string;
  
    // Leader: user có role = 'leader'
    @ManyToOne(() => User)
    leader: User;
      
    @OneToMany(() => Player, player => player.team)
    members: Player[];

    @OneToMany(() => TeamInvite, invite => invite.team)
    invites: TeamInvite[];

    @OneToMany(() => Event, event => event.team)
    events: Event[];

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  