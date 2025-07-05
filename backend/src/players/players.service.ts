import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private playerRepository: Repository<Player>,
  ) {}

  // CREATE
  async create(playerDto: Partial<Player>): Promise<Player> {
    const player = this.playerRepository.create(playerDto);
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
  async update(id: number, updateDto: Partial<Player>): Promise<Player> {
    const player = await this.findOne(id);
    Object.assign(player, updateDto);
    return this.playerRepository.save(player);
  }

  // DELETE
  async remove(id: number): Promise<void> {
    const player = await this.findOne(id);
    await this.playerRepository.remove(player);
  }
}
