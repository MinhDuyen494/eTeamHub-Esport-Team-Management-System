import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param } from '@nestjs/common';
import { TeamInvitesService } from './team-invites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';
import { UserGuard } from 'src/common/guards/user.guard';
import { LeaderGuard } from 'src/common/guards/leader.guard';

@Controller('team-invites')
export class TeamInvitesController {
  constructor(private readonly invitesService: TeamInvitesService) {}

  // Leader gửi invite
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Post()
  async invite(@Body() dto: { teamId: number, playerId: number, status: 'pending'}) {
    return this.invitesService.create(dto.teamId, dto.playerId, dto.status);
  }

  // Player xem invite của mình
  @UseGuards(JwtAuthGuard, RolesGuard, UserGuard)
  @Get()
  async myInvites(@Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) {
      // Trả về empty array thay vì throw error để tránh lỗi 500 cho leader
      return [];
    }
    return this.invitesService.findInvitesForPlayer(playerId);
  }

  // Player accept
  @UseGuards(JwtAuthGuard, RolesGuard, UserGuard)
  @Patch(':id/accept')
  async accept(@Param('id') id: number, @Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.invitesService.acceptInvite(Number(id), playerId);
  }

  // Player reject
  @UseGuards(JwtAuthGuard, RolesGuard, UserGuard)
  @Patch(':id/reject')
  async reject(@Param('id') id: number, @Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.invitesService.rejectInvite(Number(id), playerId);
  }
}
