import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserGuard } from '../common/guards/user.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { LeaderGuard } from '../common/guards/leader.guard';
@Controller('activity-logs')
@UseGuards(JwtAuthGuard)
export class ActivityLogController {
  constructor(private readonly logService: ActivityLogService) {}

  // Lấy log của bản thân (player, leader)
  @Get('/my')
  @UseGuards(UserGuard)
  async myLogs(@Req() req, @Query('limit') limit = 20) {
    return this.logService.findByUser(req.user.id, Number(limit));
  }

  // Admin/Leader xem toàn bộ log
  @Get()
  @UseGuards(AdminGuard)
  async allLogs(@Query('limit') limit = 50) {
    return this.logService.findAll(Number(limit));
  }
}
