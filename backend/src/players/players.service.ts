import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { User } from '../users/entities/user.entity';
import playerMessages from './messages/en';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    private activityLogService: ActivityLogService,
  ) {}

  // CREATE
  async create(createPlayerDto: CreatePlayerDto, user: User): Promise<Player> {
    console.log('Creating player:', createPlayerDto);
    const player = this.playersRepo.create({ ...createPlayerDto, user });
    await this.playersRepo.save(player);
    await this.activityLogService.createLog(
      user,
      'create_player',
      'player',
      player.id,
      { ...createPlayerDto }
    );
    return player;
  }

  // READ ALL
  async findAll(): Promise<Player[]> {
    return this.playersRepo.find();
  }

  // READ ONE
  async findOne(id: number): Promise<Player> {
    const player = await this.playersRepo.findOneBy({ id });
    if (!player) throw new NotFoundException(playerMessages.PLAYER_NOT_FOUND);
    return player;
  }

  // UPDATE
  async update(id: number, updatePlayerDto: UpdatePlayerDto, user: User): Promise<Player> {
    console.log('=== UPDATE PLAYER DEBUG ===');
    console.log('ID:', id);
    console.log('Update DTO:', updatePlayerDto);
    
    const player = await this.findOne(id);
    console.log('Found player before update:', player);
    
    // Sử dụng merge và save để đảm bảo update thành công
    const mergedPlayer = this.playersRepo.merge(player, updatePlayerDto);
    console.log('Merged player:', mergedPlayer);
    
    const savedPlayer = await this.playersRepo.save(mergedPlayer, { reload: true });
    console.log('Saved player:', savedPlayer);
    
    // Kiểm tra lại từ database
    const finalPlayer = await this.findOne(id);
    console.log('Final player from DB:', finalPlayer);
    console.log('=== END UPDATE DEBUG ===');
    
    await this.activityLogService.createLog(
      user,
      'update_player',
      'player',
      player.id,
      { before: player, after: finalPlayer }
    );
    return finalPlayer;
  }

  // DELETE
  async remove(id: number, user: User): Promise<void> {
    const player = await this.findOne(id);
    await this.playersRepo.remove(player);
    await this.activityLogService.createLog(
      user,
      'delete_player',
      'player',
      id,
      { fullName: player.fullName, ign: player.ign }
    );
  }
}
