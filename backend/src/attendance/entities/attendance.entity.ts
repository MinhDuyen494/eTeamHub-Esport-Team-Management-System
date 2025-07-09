import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Player } from '../../players/entities/player.entity';

export type AttendanceStatus = 'pending' | 'accepted' | 'declined' | 'present' | 'absent';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Event, event => event.attendances, { eager: true })
  event: Event;

  @ManyToOne(() => Player, player => player.attendances, { eager: true })
  player: Player;

  @Column({ type: 'varchar', default: 'pending' })
  status: AttendanceStatus;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
  