import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param } from '@nestjs/common';
import { TeamInvitesService } from './team-invites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('team-invites')
export class TeamInvitesController {
  constructor(private readonly invitesService: TeamInvitesService) {}

  // Leader gửi invite
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
  @Post()
  async invite(@Body() dto: { teamId: number, playerId: number }) {
    return this.invitesService.create(dto.teamId, dto.playerId);
  }

  // Player xem invite của mình
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Get()
  async myInvites(@Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.invitesService.findInvitesForPlayer(playerId);
  }

  // Player accept
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Patch(':id/accept')
  async accept(@Param('id') id: number, @Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.invitesService.acceptInvite(Number(id), playerId);
  }

  // Player reject
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Patch(':id/reject')
  async reject(@Param('id') id: number, @Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.invitesService.rejectInvite(Number(id), playerId);
  }
}
