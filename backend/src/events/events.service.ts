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
    console.log('=== UPDATE EVENT DEBUG ===');
    console.log('ID:', id);
    console.log('Update DTO:', updateEventDto);
    
    const event = await this.findOne(id);
    console.log('Found event before update:', event);
    
    // Thử cách khác: merge và save
    const mergedEvent = this.eventsRepo.merge(event, updateEventDto);
    console.log('Merged event:', mergedEvent);
    
    const savedEvent = await this.eventsRepo.save(mergedEvent, { reload: true });
    console.log('Saved event:', savedEvent);
    
    // Kiểm tra lại từ database
    const finalEvent = await this.findOne(id);
    console.log('Final event from DB:', finalEvent);
    console.log('=== END UPDATE DEBUG ===');
    
    return finalEvent;
  }  

  async remove(id: number): Promise<{ deleted: boolean }> {
    const event = await this.findOne(id);
    await this.eventsRepo.remove(event);
    return { deleted: true };
  }
}
