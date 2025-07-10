import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { UserRole, CreateUserWithPlayerData } from '../common/types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    private notificationsService: NotificationsService,
    private activityLogService: ActivityLogService,
  ) {}

  async findByEmail(email: string, options?: { withPlayer?: boolean }) {
    return this.usersRepo.findOne({
      where: { email },
      relations: options?.withPlayer ? ['player'] : [],
    });
  }

  async findById(id: number, options?: { withPlayer?: boolean }) {
    console.log('findById called with id:', id, 'options:', options);
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: options?.withPlayer ? ['player'] : [],
    });
    console.log('findById result:', user);
    return user;
  }

  async createWithPlayer(data: CreateUserWithPlayerData) {
    const user = this.usersRepo.create({ 
      email: data.email, 
      password: data.password, 
      role: data.role 
    });
    await this.usersRepo.save(user);

    const player = this.playersRepo.create({ ...data.player, user });
    await this.playersRepo.save(player);

    user.player = player;
    await this.activityLogService.createLog(
      user,
      'register',
      'user',
      user.id,
      { email: user.email, role: user.role }
    );
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.findById(id);
    if (!user) {
      throw new ForbiddenException('User không tồn tại');
    }

    // Bảo vệ role của leader
    if (user.role === 'leader' && updateUserDto.role !== undefined) {
      throw new ForbiddenException('Không thể thay đổi role của leader');
    }

    // Chỉ leader mới được gán role leader
    if (updateUserDto.role === 'leader' && currentUser.role !== 'leader') {
      throw new ForbiddenException('Chỉ leader mới có thể gán role leader');
    }

    // Cập nhật user
    const before = { ...user };
    Object.assign(user, updateUserDto);
    const updated = await this.usersRepo.save(user);
    await this.activityLogService.createLog(
      currentUser,
      'update_user',
      'user',
      user.id,
      { before, after: updated }
    );
    return updated;
  }

  async adminUpdateUser(id: number, adminUpdateUserDto: any, currentUser: User) {
    // Kiểm tra quyền admin/leader
    if (currentUser.role !== 'leader') {
      throw new ForbiddenException('Chỉ leader mới có thể cập nhật thông tin user');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new ForbiddenException('User không tồn tại');
    }

    // Không cho phép thay đổi role của chính mình
    if (id === currentUser.id && adminUpdateUserDto.role !== undefined) {
      throw new ForbiddenException('Không thể thay đổi role của chính mình');
    }

    // Không cho phép thay đổi role của leader khác
    if (user.role === 'leader' && adminUpdateUserDto.role !== undefined) {
      throw new ForbiddenException('Không thể thay đổi role của leader khác');
    }

    const before = { ...user };
    
    // Cập nhật email nếu có
    if (adminUpdateUserDto.email) {
      user.email = adminUpdateUserDto.email;
    }
    
    // Cập nhật role nếu có
    if (adminUpdateUserDto.role) {
      user.role = adminUpdateUserDto.role;
    }

    const updated = await this.usersRepo.save(user);
    
    await this.activityLogService.createLog(
      currentUser,
      'admin_update_user',
      'user',
      user.id,
      { before, after: updated }
    );
    
    return {
      message: 'Cập nhật user thành công',
      user: {
        id: updated.id,
        email: updated.email,
        role: updated.role
      }
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['player'],
      select: ['id', 'email', 'role'] // không trả password
    });
    if (!user) throw new NotFoundException('User không tồn tại');
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      player: user.player
    };
  }
  

  async changePassword(userId: number, newPassword: string, currentUser: User) {
    const user = await this.findById(userId);
    if (!user) throw new ForbiddenException('User không tồn tại');
    user.password = newPassword;
    await this.usersRepo.save(user);
    await this.activityLogService.createLog(
      currentUser,
      'change_password',
      'user',
      user.id,
      { userId }
    );
    return { message: 'Đổi mật khẩu thành công' };
  }

  // Đổi mật khẩu có xác thực mật khẩu cũ và hash mật khẩu mới
  async changePasswordSecure(userId: number, oldPassword: string, newPassword: string, currentUser: User) {
    const user = await this.findById(userId);
    if (!user) throw new ForbiddenException('User không tồn tại');
    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new ForbiddenException('Mật khẩu cũ không đúng');
    if (oldPassword === newPassword) throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ');
    // Hash mật khẩu mới
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await this.usersRepo.save(user);
    await this.activityLogService.createLog(
      currentUser,
      'change_password',
      'user',
      user.id,
      { userId }
    );
    return { message: 'Đổi mật khẩu thành công' };
  }

  // Cập nhật profile (user và player)
  async updateUserProfile(id: number, updateProfileDto: any, currentUser: User) {
    const user = await this.findById(id, { withPlayer: true });
    if (!user) throw new ForbiddenException('User không tồn tại');
    const before = { ...user };

    // Chỉ update trường cho phép
    if (updateProfileDto.email) user.email = updateProfileDto.email;
    if (user.player) {
      if (updateProfileDto.fullName) user.player.fullName = updateProfileDto.fullName;
      if (updateProfileDto.ign) user.player.ign = updateProfileDto.ign;
      if (updateProfileDto.gameAccount) user.player.gameAccount = updateProfileDto.gameAccount;
    }
    const updatedUser = await this.usersRepo.save(user);
    if (user.player) await this.playersRepo.save(user.player);

    await this.activityLogService.createLog(
      currentUser,
      'update_profile',
      'user',
      user.id,
      { before, after: updatedUser }
    );
    return { message: 'Cập nhật profile thành công' };
  }

  async fixMissingPlayers() {
    const users = await this.usersRepo.find({ relations: ['player'] });
    const usersWithoutPlayer = users.filter(u => !u.player);
    for (const user of usersWithoutPlayer) {
      const player = this.playersRepo.create({
        fullName: user.email, // hoặc để trống hoặc sinh giá trị mặc định
        ign: 'IGN_' + user.id,
        role: 'unknown',
        gameAccount: 'ACC_' + user.id,
        user: user,
      });
      await this.playersRepo.save(player);
      user.player = player;
      await this.usersRepo.save(user);
    }
    return { fixed: usersWithoutPlayer.length };
  }

  // Admin reset mật khẩu user khác
  async adminResetUserPassword(userId: number, newPassword: string, adminUser: User) {
    if (adminUser.role !== 'admin') {
      throw new ForbiddenException('Chỉ admin mới được phép reset mật khẩu');
    }
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User không tồn tại');
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await this.usersRepo.save(user);
    await this.activityLogService.createLog(
      adminUser,
      'admin_reset_password',
      'user',
      userId,
      { adminId: adminUser.id, resetUserId: userId }
    );
    return { newPassword, resetAt: new Date() };
  }
}
