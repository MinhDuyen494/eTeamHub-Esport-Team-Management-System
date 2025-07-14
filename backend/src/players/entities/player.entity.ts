import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../users/entities/roles.entity';
import { OneToOne, JoinColumn } from 'typeorm';
import { Team } from 'src/teams/entities/team.entity';
import { TeamInvite } from '../../team-invites/entities/team-invite.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { RoleInGame } from './role-in-game.entity';
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
  @ManyToOne(() => RoleInGame, roleInGame => roleInGame.name)
  roleInGame: RoleInGame;

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

  @ManyToOne(() => Team, team => team.members, { nullable: true })
  team: Team;

  @OneToMany(() => TeamInvite, invite => invite.player)
  invites: TeamInvite[];

  @OneToMany(() => Attendance, attendance => attendance.player)
  attendances: Attendance[];
}

