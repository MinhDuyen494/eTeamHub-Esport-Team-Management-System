import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Player xác nhận RSVP
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Patch(':id/rsvp')
  async updateRSVP(
    @Param('id') id: number,
    @Body() dto: { status: 'accepted' | 'declined', note?: string },
    @Req() req
  ) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.attendanceService.updateRSVP(Number(id), dto.status, playerId, dto.note);
  }

  // Leader check-in
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
  @Patch(':id/check-in')
  async checkIn(
    @Param('id') id: number,
    @Body() dto: { status: 'present' | 'absent', note?: string },
    @Req() req
  ) {
    return this.attendanceService.checkIn(Number(id), dto.status, req.user.id, dto.note);
  }

  // Player xem attendance của mình
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Get('my-attendances')
  async getMyAttendances(@Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.attendanceService.getPlayerAttendances(playerId);
  }

  // Leader xem attendance của team
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
  @Get('team/:teamId')
  async getTeamAttendances(@Param('teamId') teamId: number, @Req() req) {
    return this.attendanceService.getTeamAttendances(Number(teamId), req.user.id);
  }
}
  