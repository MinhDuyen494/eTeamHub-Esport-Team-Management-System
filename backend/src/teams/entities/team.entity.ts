import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    ManyToMany,
    JoinTable,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  import { Player } from '../../players/entities/player.entity';
  
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
  
    // Thành viên: Nhiều player thuộc nhiều team (nếu muốn, hoặc 1 team nhiều player)
    @ManyToMany(() => Player)
    @JoinTable()
    members: Player[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  