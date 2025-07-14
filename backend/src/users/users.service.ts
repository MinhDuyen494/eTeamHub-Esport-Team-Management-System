import { Injectable, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { RoleInGame } from '../players/entities/role-in-game.entity';
import { UserRole, CreateUserWithPlayerData } from '../common/types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import * as bcrypt from 'bcryptjs';
import userMessages from './messages/en';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    @InjectRepository(RoleInGame) private roleInGameRepo: Repository<RoleInGame>,
    private notificationsService: NotificationsService,
    private activityLogService: ActivityLogService,
  ) {}

  async findByEmail(email: string, options?: { withPlayer?: boolean }) {
    return this.usersRepo.findOne({
      where: { email },
      relations: [
        ...(options?.withPlayer ? ['player', 'player.roleInGame'] : []),
        'role',
      ],
    });
  }

  async findById(id: number, options?: { withPlayer?: boolean }) {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: [
        ...(options?.withPlayer ? ['player', 'player.roleInGame'] : []),
        'role',
      ],
    });
    return user;
  }

  async createWithPlayer(data: CreateUserWithPlayerData) {
    // Lấy role hệ thống từ bảng roles
    const roleEntity = await this.rolesRepo.findOne({ where: { name: data.role } });
    if (!roleEntity) throw new BadRequestException('Role not found');

    // Lấy roleInGame nếu có
    let roleInGameEntity: RoleInGame | null = null;
    if (data.player && data.player.roleInGame) {
      roleInGameEntity = await this.roleInGameRepo.findOne({ where: { players: { id: data.player.id } } });
      if (!roleInGameEntity) throw new BadRequestException('RoleInGame not found');
    }

    const user = this.usersRepo.create({ 
      email: data.email, 
      password: data.password, 
      role: roleEntity
    });
    await this.usersRepo.save(user);

    if (roleInGameEntity) {
      if (data.player) {
        const player = this.playersRepo.create({ 
          ...data.player, 
          user,
          roleInGame: roleInGameEntity
        });
        await this.playersRepo.save(player);
        user.player = player;
      }
    }
    

    await this.activityLogService.createLog(
      user,
      'register',
      'user',
      user.id,
      { email: user.email, role: user.role.name }
    );
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.findById(id);
    if (!user) {
      throw new ForbiddenException(userMessages.USER_NOT_FOUND);
    }

    // Bảo vệ role của leader
    if (user.role.name === 'leader' && updateUserDto.role !== undefined) {
      throw new ForbiddenException(userMessages.FORBIDDEN);
    }

    // Chỉ leader và admin mới được gán role leader và admin
    if ((updateUserDto.role === 'leader' || updateUserDto.role === 'admin') &&
      (currentUser.role.name !== 'leader' && currentUser.role.name !== 'admin')) {
      throw new ForbiddenException(userMessages.FORBIDDEN);
    }

    // Nếu cập nhật role, lấy entity role mới
    if (updateUserDto.role) {
      const newRole = await this.rolesRepo.findOne({ where: { name: updateUserDto.role } });
      if (!newRole) throw new BadRequestException('Role not found');
      user.role = newRole;
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
    if (currentUser.role.name !== 'leader' && currentUser.role.name !== 'admin') {
      throw new ForbiddenException(userMessages.FORBIDDEN);
    }

    const user = await this.findById(id);
    if (!user) {
      throw new ForbiddenException(userMessages.USER_NOT_FOUND);
    }

    // Không cho phép thay đổi role của chính mình
    if (id === currentUser.id && adminUpdateUserDto.role !== undefined) {
      throw new ForbiddenException(userMessages.FORBIDDEN);
    }

    // Không cho phép thay đổi role của leader khác
    if (user.role.name === 'leader' && adminUpdateUserDto.role !== undefined) {
      throw new ForbiddenException(userMessages.FORBIDDEN);
    }

    const before = { ...user };
    
    // Cập nhật email nếu có
    if (adminUpdateUserDto.email) {
      user.email = adminUpdateUserDto.email;
    }
    
    // Cập nhật role nếu có
    if (adminUpdateUserDto.role) {
      const newRole = await this.rolesRepo.findOne({ where: { name: adminUpdateUserDto.role } });
      if (!newRole) throw new BadRequestException('Role not found');
      user.role = newRole;
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
        role: updated.role.name
      }
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['player', 'role', 'player.roleInGame'],
      select: ['id', 'email'], // không trả password
    });
    if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);
    return {
      id: user.id,
      email: user.email,
      role: user.role.name,
      player: user.player
    };
  }

  // Dashboard API - Lấy thống kê users
  async getUserStats() {
    const [totalUsers, playerCount, leaderCount] = await Promise.all([
      this.usersRepo.count(),
      this.usersRepo.count({ where: { role: { name: 'player' } } }),
      this.usersRepo.count({ where: { role: { name: 'leader' } } }),
    ]);
    
    return {
      totalUsers,
      playerCount,
      leaderCount,
      adminCount: totalUsers - playerCount - leaderCount,
    };
  }

  // Temporary method to create admin user (for development only)
  async createAdminUser(data: { email: string; password: string; fullName: string }) {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const adminRole = await this.rolesRepo.findOne({ where: { name: 'admin' } });
    if (!adminRole) throw new BadRequestException('Role admin not found');
    
    const user = this.usersRepo.create({
      email: data.email,
      password: hashedPassword,
      role: adminRole
    });
    
    await this.usersRepo.save(user);
    
    return {
      message: 'Admin user created successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name
      }
    };
  }

  async changePassword(userId: number, newPassword: string, currentUser: User) {
    const user = await this.findById(userId);
    if (!user) throw new ForbiddenException(userMessages.USER_NOT_FOUND);
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
    if (!user) throw new ForbiddenException(userMessages.USER_NOT_FOUND);
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
    if (!user) throw new ForbiddenException(userMessages.USER_NOT_FOUND);
    const before = { ...user };

    // Chỉ update trường cho phép
    if (updateProfileDto.email) user.email = updateProfileDto.email;
    if (user.player) {
      if (updateProfileDto.fullName) user.player.fullName = updateProfileDto.fullName;
      if (updateProfileDto.ign) user.player.ign = updateProfileDto.ign;
      if (updateProfileDto.gameAccount) user.player.gameAccount = updateProfileDto.gameAccount;
      if (updateProfileDto.roleInGame) {
        const roleInGameEntity = await this.roleInGameRepo.findOne({ where: { players: { id: user.player.id } } });
        if (!roleInGameEntity) throw new BadRequestException('RoleInGame not found');
        user.player.roleInGame = roleInGameEntity;
      }
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
    const users = await this.usersRepo.find({ relations: ['player', 'role'] });
    const usersWithoutPlayer = users.filter(u => !u.player);
    for (const user of usersWithoutPlayer) {
      const player = this.playersRepo.create({
        fullName: user.email, // hoặc để trống hoặc sinh giá trị mặc định
        ign: 'IGN_' + user.id,
        roleInGame: undefined, // hoặc gán roleInGame mặc định nếu muốn
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
    if (adminUser.role.name !== 'admin') {
      throw new ForbiddenException(userMessages.FORBIDDEN);
    }
    const user = await this.usersRepo.findOne({ where: { id: userId }, relations: ['role'] });
    if (!user) throw new NotFoundException(userMessages.USER_NOT_FOUND);
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
