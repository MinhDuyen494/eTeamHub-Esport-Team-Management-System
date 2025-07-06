import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OneToOne, JoinColumn } from 'typeorm';
@Entity('players') // tên bảng trong database là 'players'
export class Player {

  // ID tự động tăng cho mỗi tuyển thủ
  @PrimaryGeneratedColumn()
  id: number;

  // Họ tên đầy đủ của tuyển thủ
  @Column()
  fullName: string;

  // Tên trong game (In-game Name)
  @Column({ unique: true })
  ign: string;

  // Vai trò chính trong game (Role)
  @Column()
  role: string;

  // Tài khoản game (VD: Riot ID)
  @Column({ unique: true })
  gameAccount: string;

  // Thời gian tạo hồ sơ tuyển thủ (tự động)
  @CreateDateColumn()
  createdAt: Date;

  // Thời gian cập nhật gần nhất hồ sơ tuyển thủ (tự động)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, user => user.player) // Liên kết tới User
  @JoinColumn() // Tạo ra cột 'userId' trong bảng 'players'
  user: User;
}
