import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  // CREATE
  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    console.log('Creating player:', createPlayerDto);
    const player = this.playerRepository.create(createPlayerDto);
    return this.playerRepository.save(player);
  }

  // READ ALL
  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  // READ ONE
  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepository.findOneBy({ id });
    if (!player) {
      throw new NotFoundException(`Player #${id} not found`);
    }
    return player;
  }

  // UPDATE
  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    console.log('=== UPDATE PLAYER DEBUG ===');
    console.log('ID:', id);
    console.log('Update DTO:', updatePlayerDto);
    
    const player = await this.findOne(id);
    console.log('Found player before update:', player);
    
    // Sử dụng merge và save để đảm bảo update thành công
    const mergedPlayer = this.playerRepository.merge(player, updatePlayerDto);
    console.log('Merged player:', mergedPlayer);
    
    const savedPlayer = await this.playerRepository.save(mergedPlayer, { reload: true });
    console.log('Saved player:', savedPlayer);
    
    // Kiểm tra lại từ database
    const finalPlayer = await this.findOne(id);
    console.log('Final player from DB:', finalPlayer);
    console.log('=== END UPDATE DEBUG ===');
    
    return finalPlayer;
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }
}
