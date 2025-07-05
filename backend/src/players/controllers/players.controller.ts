import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { PlayersService } from '../players.service';
import { Player } from '../entities/player.entity';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // CREATE
  @Post()
  create(@Body() playerDto: Partial<Player>) {
    return this.playersService.create(playerDto);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  // UPDATE
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: Partial<Player>) {
    return this.playersService.update(id, updateDto);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.remove(id);
  }
}
