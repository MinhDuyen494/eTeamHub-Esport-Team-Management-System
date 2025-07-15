import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;
  
  @Column()
  location: string;

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

  @OneToMany(() => Attendance, attendance => attendance.event)
  attendances: Attendance[];

  @CreateDateColumn()
  createdAt: Date;


}
