import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Between } from 'typeorm';
import { Event } from './entities/event.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import eventMessages from './messages/en';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
    @InjectRepository(Team)
    private teamsRepo: Repository<Team>,
    private attendanceService: AttendanceService,
    private notificationsService: NotificationsService,
    @InjectRepository(Player)
    private playersRepo: Repository<Player>,
    private activityLogService: ActivityLogService,
  ) {}

  // Dashboard API - Lấy số lượng events sắp diễn ra
  async getUpcomingEventsCount() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const [upcomingCount, totalEvents, todayEvents] = await Promise.all([
      this.eventsRepo.count({ where: { startTime: MoreThan(now) } }),
      this.eventsRepo.count(),
      this.eventsRepo.count({ 
        where: { 
          startTime: Between(today, tomorrow) 
        } 
      }),
    ]);
    
    return {
      upcomingCount,
      totalEvents,
      todayEvents,
    };
  }

  // Tạo event, chỉ leader đúng mới được tạo, tự động tạo attendance cho các thành viên team
  async create(createEventDto: CreateEventDto, user: any): Promise<Event> {
    // Chỉ leader của team mới được tạo event
    if (user.role !== 'leader') throw new ForbiddenException(eventMessages.FORBIDDEN);
    const team = await this.teamsRepo.findOne({ where: { id: createEventDto.teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException(eventMessages.EVENT_NOT_FOUND);
    if (team.leader.id !== user.id) throw new ForbiddenException(eventMessages.FORBIDDEN);
    
    const event = this.eventsRepo.create({ ...createEventDto, team });
    const savedEvent = await this.eventsRepo.save(event);
    
    // Tự động tạo attendance cho tất cả player trong team
    await this.attendanceService.createAttendancesForEvent(savedEvent.id, team.id);

    // Gửi notification cho tất cả player trong team
    const players = await this.playersRepo.find({ where: { team: { id: team.id } }, relations: ['user'] });
    for (const player of players) {
      await this.notificationsService.create(
        player.user,
        `Team ${team.name} có sự kiện mới: ${event.title}`,
        'event'
      );
    }
    
    await this.activityLogService.createLog(
      user,
      'create_event',
      'event',
      savedEvent.id,
      { ...createEventDto }
    );
    
    return savedEvent;
  }

  // Sửa event (chỉ leader của team mới được sửa)
  async update(eventId: number, dto: UpdateEventDto, user: any): Promise<Event> {
    const event = await this.eventsRepo.findOne({ where: { id: eventId }, relations: ['team', 'team.leader'] });
    if (!event) throw new NotFoundException(eventMessages.EVENT_NOT_FOUND);
    if (event.team.leader.id !== user.id) throw new ForbiddenException(eventMessages.FORBIDDEN);

    const before = { ...event };
    Object.assign(event, dto);
    const updated = await this.eventsRepo.save(event);
    await this.activityLogService.createLog(
      user,
      'update_event',
      'event',
      event.id,
      { before, after: updated }
    );
    return updated;
  }

  // Xóa event (chỉ leader team)
  async remove(eventId: number, user: any): Promise<{ message: string }> {
    const event = await this.eventsRepo.findOne({ where: { id: eventId }, relations: ['team', 'team.leader'] });
    if (!event) throw new NotFoundException(eventMessages.EVENT_NOT_FOUND);
    if (event.team.leader.id !== user.id) throw new ForbiddenException(eventMessages.FORBIDDEN);

    await this.eventsRepo.remove(event);
    await this.activityLogService.createLog(
      user,
      'delete_event',
      'event',
      eventId,
      { title: event.title }
    );
    return { message: 'Đã xóa event thành công' };
  }

  // Lấy danh sách event của team
  async findByTeam(teamId: number, user: any): Promise<Event[]> {
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException(eventMessages.EVENT_NOT_FOUND);

    // Chỉ leader/team member mới được xem
    if (user.role === 'leader' && team.leader.id !== user.id)
      throw new ForbiddenException(eventMessages.FORBIDDEN);

    // Nếu player, phải thuộc team
    if (user.role === 'player' && (!user.player || user.player.team?.id !== team.id))
      throw new ForbiddenException(eventMessages.FORBIDDEN);

    return this.eventsRepo.find({ where: { team: { id: teamId } } });
  }

  // Lấy tất cả events
  async findAll(): Promise<Event[]> {
    return this.eventsRepo.find({ order: { startTime: "DESC" } });
  }

  // Lấy event theo id
  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepo.findOneBy({ id });
    if (!event) throw new NotFoundException(eventMessages.EVENT_NOT_FOUND);
    return event;
  }
}
