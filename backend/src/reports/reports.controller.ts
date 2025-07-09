import { Controller, Get, Query, UseGuards, Req, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
  @Get('team/:teamId')
  async getTeamReport(
    @Param('teamId') teamId: number,
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.reportsService.getTeamReport(
      Number(teamId), 
      req.user.id, 
      start, 
      end
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('player')
  @Get('player/me')
  async getMyPlayerReport(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const playerId = req.user.player?.id;
    if (!playerId) throw new Error('Không tìm thấy playerId trong token');
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.reportsService.getPlayerReport(playerId, start, end);
  }
}
