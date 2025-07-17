import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Req, UseGuards, Patch } from '@nestjs/common';
import { PlayersService } from '../players.service';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleInGame } from '../entities/role-in-game.entity';

@UseGuards(JwtAuthGuard)
@Controller('players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    @InjectRepository(RoleInGame) private readonly roleInGameRepo: Repository<RoleInGame>,
  ) {}

  // CREATE
  @Post()
  async create(@Body() createPlayerDto: CreatePlayerDto, @Req() req) {
    return this.playersService.create(createPlayerDto, req.user);
  }
  @Get('roles-in-game')
  async getRolesInGame() {
    const roles = await this.roleInGameRepo.find();
    return { roles };
  }
  // GET /players/me - lấy hồ sơ tuyển thủ của user hiện tại (phải đặt trước /:id)
  @Get('me')
  async getMyPlayer(@Req() req) {
    const userId = req.user.id;
    const player = await this.playersService.findByUserId(userId);
    if (!player) {
      return { player: null, message: 'Bạn chưa đăng ký hồ sơ tuyển thủ' };
    }
    return { player };
  }

  // READ ALL
  @Get()
  async findAll() {
    return this.playersService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  // GET /players/roles-in-game - lấy danh sách vai trò trong game
  

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
