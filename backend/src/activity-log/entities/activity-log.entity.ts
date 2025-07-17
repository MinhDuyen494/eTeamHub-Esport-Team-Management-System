import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('activity_logs')
  export class ActivityLog {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    user: User; // Người thao tác
  
    @Column()
    action: string; // VD: 'create_team', 'delete_event', 'checkin_attendance',...
  
    @Column({ nullable: true })
    targetType: string; // VD: 'team', 'player', 'event', ...
  
    @Column({ nullable: true })
    targetId: number; // ID của đối tượng bị tác động
  
    @Column({ type: 'json', nullable: true })
    detail: any; // Thông tin chi tiết (có thể là object JSON)
  
    @CreateDateColumn()
    createdAt: Date;
  }