import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Patch, Req, UseGuards } from '@nestjs/common';
import { EventsService } from '../events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEventDto: UpdateEventDto, @Req() req) {
    return this.eventsService.update(id, updateEventDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('leader')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.eventsService.remove(id, req.user);
  }
}
