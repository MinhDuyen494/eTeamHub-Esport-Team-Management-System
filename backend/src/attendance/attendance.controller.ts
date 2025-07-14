import { Controller, Get, Post, Body, Param, Patch, Req, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserGuard } from '../common/guards/user.guard';
import { LeaderGuard } from '../common/guards/leader.guard';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // Dashboard API - Lấy danh sách events vừa diễn ra có điểm danh
  @Get('recent-events')
  @UseGuards(AdminGuard)
  async getRecentAttendanceEvents(@Query('limit') limit = 5) {
    return this.attendanceService.getRecentAttendanceEvents(Number(limit));
  }

  // Player xác nhận RSVP
  @UseGuards(JwtAuthGuard, RolesGuard, UserGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Patch(':id/check-in')
  async checkIn(
    @Param('id') id: number,
    @Body() dto: { status: 'present' | 'absent', note?: string },
    @Req() req
  ) {
    return this.attendanceService.checkIn(Number(id), dto.status, req.user.id, dto.note);
  }

  // Player xem attendance của mình
  @UseGuards(JwtAuthGuard, RolesGuard, UserGuard)
  @Get('my-attendances')
  async getMyAttendances(@Req() req) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy player profile');
    return this.attendanceService.getPlayerAttendances(playerId);
  }

  // Leader xem attendance của team
  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Get('team/:teamId')
  async getTeamAttendances(@Param('teamId') teamId: number, @Req() req) {
    return this.attendanceService.getTeamAttendances(Number(teamId), req.user.id);
  }
}
  