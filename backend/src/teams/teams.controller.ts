import { Controller, Post, Body, Req, UseGuards, UnauthorizedException, Delete, Get } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { Param, Patch } from '@nestjs/common';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { LeaderGuard } from '../common/guards/leader.guard';
import { AdminGuard } from '../common/guards/admin.guard';
// Định nghĩa interface cho user từ JWT
interface JwtUser {
  id: number;
  email: string;
  role: 'leader' | 'player';
}

// Extend Request interface để có user
interface RequestWithUser extends Request {
  user: JwtUser;
}

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Dashboard API - Lấy thống kê teams
  @Get('stats')
  @UseGuards(AdminGuard)
  async getTeamStats() {
    return this.teamsService.getTeamStats();
  }

  // Lấy danh sách teams (cho frontend fallback)
  @Get()
  @UseGuards(AdminGuard)
  async getTeams() {
    return this.teamsService.getTeams();
  }

  // Create team
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Post()
  async create(@Body() dto: CreateTeamDto, @Req() req: RequestWithUser) {
    // Lúc này req.user đã là { id, email, role }
    const leaderId = req.user.id;
    if (!leaderId) {
      throw new UnauthorizedException('Bạn không có quyền tạo đội');
    }
    return this.teamsService.create(dto, leaderId);
  }
  // Update team
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateTeamDto,
    @Req() req: RequestWithUser,
  ) {
    const leaderId = req.user.id;
    return this.teamsService.update(Number(id), dto, leaderId);
  }

  // Delete team
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ) {
    const leaderId = req.user.id;
    return this.teamsService.remove(Number(id), leaderId);
  }

  // Add member
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Post(':id/add-member')
  async addMember(
    @Param('id') id: number,
    @Body() dto: AddMemberDto,
    @Req() req: RequestWithUser,
  ) {
    const leaderId = req.user.id;
    return this.teamsService.addMember(Number(id), dto.playerId, leaderId);
  }

  // Remove member
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Delete(':id/remove-member')
  async removeMember(
    @Param('id') id: number,
    @Body() dto: AddMemberDto,
    @Req() req: RequestWithUser,
  ) {
    const leaderId = req.user.id;
    return this.teamsService.removeMember(Number(id), dto.playerId, leaderId);
  }
}
