import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column()
  type: string; // "Luyện tập", "Thi đấu", ...

  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Team, team => team.events, { eager: true })
  team: Team;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
