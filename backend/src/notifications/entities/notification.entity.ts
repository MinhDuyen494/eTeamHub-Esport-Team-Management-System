import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('notifications')
  export class Notification {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { eager: true })
    user: User; // Người nhận thông báo
  
    @Column()
    content: string; // Nội dung thông báo
  
    @Column({ default: false })
    isRead: boolean; // Đã đọc hay chưa
  
    @Column({ type: 'varchar', default: 'other' })
    type: 'invite' | 'event' | 'attendance' | 'team' | 'rsvp' | 'other';
  
    @CreateDateColumn()
    createdAt: Date;
  }
  