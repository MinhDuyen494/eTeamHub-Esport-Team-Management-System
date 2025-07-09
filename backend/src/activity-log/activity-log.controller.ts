import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('activity-logs')
@UseGuards(JwtAuthGuard)
export class ActivityLogController {
  constructor(private readonly logService: ActivityLogService) {}

  // Lấy log của bản thân (player, leader)
  @Get('/my')
  async myLogs(@Req() req, @Query('limit') limit = 20) {
    return this.logService.findByUser(req.user.id, Number(limit));
  }

  // Admin xem toàn bộ log
  @Get()
  @Roles('admin')
  async allLogs(@Query('limit') limit = 50) {
    return this.logService.findAll(Number(limit));
  }
}
