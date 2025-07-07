import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Player } from '../players/entities/player.entity';
import { UserRole, CreateUserWithPlayerData } from '../common/types/user.types';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
  ) {}

  async findByEmail(email: string, options?: { withPlayer?: boolean }) {
    return this.usersRepo.findOne({
      where: { email },
      relations: options?.withPlayer ? ['player'] : [],
    });
  }

  async findById(id: number, options?: { withPlayer?: boolean }) {
    return this.usersRepo.findOne({
      where: { id },
      relations: options?.withPlayer ? ['player'] : [],
    });
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
    Object.assign(user, updateUserDto);
    return this.usersRepo.save(user);
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
}
