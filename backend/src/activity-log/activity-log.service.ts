import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import activityLogMessages from './messages/en';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private logRepo: Repository<ActivityLog>,
  ) {}

  // Ghi log cho bất kỳ hành động nào
  async createLog(
    user: User,
    action: string,
    targetType?: string,
    targetId?: number,
    detail?: any,
  ) {
    const log = this.logRepo.create({
      user,
      action,
      targetType,
      targetId,
      detail,
    });
    return this.logRepo.save(log);
  }

  // Truy vấn log theo các tiêu chí (ví dụ: theo user, action, thời gian)
  async findByUser(userId: number, limit = 20) {
    return this.logRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Lấy toàn bộ log (admin dùng)
  async findAll(limit = 50) {
    return this.logRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
