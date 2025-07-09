import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EventsController } from './controllers/events.controller';
import { Team } from '../teams/entities/team.entity';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Team]),
    AttendanceModule,
  ],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
