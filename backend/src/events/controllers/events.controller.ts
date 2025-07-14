import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { EventsService } from '../events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { LeaderGuard } from '../../common/guards/leader.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Dashboard API - Lấy số lượng events sắp diễn ra
  @Get('upcoming/count')
  @UseGuards(AdminGuard)
  async getUpcomingEventsCount() {
    return this.eventsService.getUpcomingEventsCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    return this.eventsService.create(createEventDto, req.user);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto, @Req() req) {
    return this.eventsService.update(id, updateEventDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard, LeaderGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.eventsService.remove(id, req.user);
  }
}
