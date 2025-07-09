import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { AttendanceService } from '../attendance/attendance.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
    @InjectRepository(Team)
    private teamsRepo: Repository<Team>,
    private attendanceService: AttendanceService,
  ) {}

  // Tạo event, chỉ leader đúng mới được tạo, tự động tạo attendance cho các thành viên team
  async create(createEventDto: CreateEventDto, user: any): Promise<Event> {
    // Chỉ leader của team mới được tạo event
    if (user.role !== 'leader') throw new ForbiddenException('Chỉ leader mới được tạo event');
    const team = await this.teamsRepo.findOne({ where: { id: createEventDto.teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException('Team không tồn tại');
    if (team.leader.id !== user.id) throw new ForbiddenException('Bạn không phải leader của team này');
    
    const event = this.eventsRepo.create({ ...createEventDto, team });
    const savedEvent = await this.eventsRepo.save(event);
    
    // Tự động tạo attendance cho tất cả player trong team
    await this.attendanceService.createAttendancesForEvent(savedEvent.id, team.id);
    
    return savedEvent;
  }

  // Sửa event (chỉ leader của team mới được sửa)
  async update(eventId: number, dto: UpdateEventDto, user: any): Promise<Event> {
    const event = await this.eventsRepo.findOne({ where: { id: eventId }, relations: ['team', 'team.leader'] });
    if (!event) throw new NotFoundException('Event không tồn tại');
    if (event.team.leader.id !== user.id) throw new ForbiddenException('Bạn không có quyền sửa event này');

    Object.assign(event, dto);
    return this.eventsRepo.save(event);
  }

  // Xóa event (chỉ leader team)
  async remove(eventId: number, user: any): Promise<{ message: string }> {
    const event = await this.eventsRepo.findOne({ where: { id: eventId }, relations: ['team', 'team.leader'] });
    if (!event) throw new NotFoundException('Event không tồn tại');
    if (event.team.leader.id !== user.id) throw new ForbiddenException('Bạn không có quyền xóa event này');

    await this.eventsRepo.remove(event);
    return { message: 'Đã xóa event thành công' };
  }

  // Lấy danh sách event của team
  async findByTeam(teamId: number, user: any): Promise<Event[]> {
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException('Team không tồn tại');

    // Chỉ leader/team member mới được xem
    if (user.role === 'leader' && team.leader.id !== user.id)
      throw new ForbiddenException('Không phải leader của team này');

    // Nếu player, phải thuộc team
    if (user.role === 'player' && (!user.player || user.player.team?.id !== team.id))
      throw new ForbiddenException('Bạn không thuộc team này');

    return this.eventsRepo.find({ where: { team: { id: teamId } } });
  }

  // Lấy tất cả events
  async findAll(): Promise<Event[]> {
    return this.eventsRepo.find({ order: { startTime: "DESC" } });
  }

  // Lấy event theo id
  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepo.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}
