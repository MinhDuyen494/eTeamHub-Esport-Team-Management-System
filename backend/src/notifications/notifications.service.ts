import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepo: Repository<Notification>,
  ) {}

  async create(user: User, content: string, type: 'invite' | 'event' | 'attendance' | 'team' | 'rsvp' | 'other' = 'other') {
    const notification = this.notificationsRepo.create({
      user,
      content,
      type,
      isRead: false,
    });
    return this.notificationsRepo.save(notification);
  }

  async findAllByUser(userId: number) {
    return this.notificationsRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    const noti = await this.notificationsRepo.findOne({ where: { id: notificationId }, relations: ['user'] });
    if (!noti || noti.user.id !== userId) throw new Error('Không có quyền sửa thông báo này');
    noti.isRead = true;
    return this.notificationsRepo.save(noti);
  }
}
