import { Controller, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // Lấy danh sách thông báo cho user đăng nhập
  @Get()
  async findAllByUser(@Req() req) {
    return this.notificationsService.findAllByUser(req.user.id);
  }

  // Đánh dấu đã đọc
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number, @Req() req) {
    return this.notificationsService.markAsRead(Number(id), req.user.id);
  }
}
