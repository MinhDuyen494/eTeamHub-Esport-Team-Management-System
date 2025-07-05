import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepo: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    console.log(createEventDto); // Thêm dòng này để check log
    const event = this.eventsRepo.create(createEventDto);
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

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);
    Object.assign(event, updateEventDto);
    return this.eventsRepo.save(event);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const event = await this.findOne(id);
    await this.eventsRepo.remove(event);
    return { deleted: true };
  }
}
