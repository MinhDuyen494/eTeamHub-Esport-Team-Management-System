import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Req, UseGuards, Patch } from '@nestjs/common';
import { PlayersService } from '../players.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // CREATE
  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto, @Req() req) {
    return this.playersService.create(createPlayerDto, req.user);
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
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePlayerDto: UpdatePlayerDto, @Req() req) {
    return this.playersService.update(id, updatePlayerDto, req.user);
  }

  // DELETE
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    return this.playersService.remove(id, req.user);
  }
}
