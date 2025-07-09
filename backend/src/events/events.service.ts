import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Team } from '../teams/entities/team.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
    @InjectRepository(Team)
    private teamsRepo: Repository<Team>,
  ) {}

  async create(createEventDto: CreateEventDto, user: any): Promise<Event> {
    if (user.role !== 'leader') throw new ForbiddenException('Chỉ leader mới được tạo event');
    const team = await this.teamsRepo.findOne({ where: { id: createEventDto.teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException('Team không tồn tại');
    if (team.leader.id !== user.id) throw new ForbiddenException('Bạn không phải leader của team này');
    const event = this.eventsRepo.create({ ...createEventDto, team });
    return this.eventsRepo.save(event);
  }
  

  async findAll(): Promise<Event[]> {
    return this.eventsRepo.find({ order: { startTime: "DESC" } });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepo.findOneBy({ id });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto, user: any): Promise<Event> {
    const event = await this.eventsRepo.findOne({ where: { id }, relations: ['team', 'team.leader'] });
    if (!event) throw new NotFoundException('Event không tồn tại');
    if (user.role !== 'leader' || event.team.leader.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa event này');
    }
    Object.assign(event, updateEventDto);
    return this.eventsRepo.save(event);
  }  

  async remove(id: number, user: any): Promise<{ deleted: boolean }> {
    const event = await this.eventsRepo.findOne({ where: { id }, relations: ['team', 'team.leader'] });
    if (!event) throw new NotFoundException('Event không tồn tại');
    if (user.role !== 'leader' || event.team.leader.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa event này');
    }
    await this.eventsRepo.remove(event);
    return { deleted: true };
  }
}
