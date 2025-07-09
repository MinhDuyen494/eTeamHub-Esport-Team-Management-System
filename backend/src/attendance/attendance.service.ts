import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Event } from '../events/entities/event.entity';
import { Player } from '../players/entities/player.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
  ) {}

  // Player xác nhận RSVP
  async updateRSVP(attendanceId: number, status: 'accepted' | 'declined', playerId: number, note?: string) {
    const attendance = await this.attendanceRepo.findOne({ 
      where: { id: attendanceId }, 
      relations: ['player', 'event'] 
    });
    if (!attendance || attendance.player.id !== playerId) {
      throw new ForbiddenException('Không có quyền cập nhật attendance này');
    }
    if (attendance.status !== 'pending') {
      throw new BadRequestException('Attendance đã được xử lý');
    }
    attendance.status = status;
    if (note) attendance.note = note;
    return this.attendanceRepo.save(attendance);
  }

  // Leader check-in thực tế
  async checkIn(attendanceId: number, status: 'present' | 'absent', leaderId: number, note?: string) {
    const attendance = await this.attendanceRepo.findOne({ 
      where: { id: attendanceId }, 
      relations: ['player', 'event', 'event.team', 'event.team.leader'] 
    });
    if (!attendance) throw new NotFoundException('Attendance không tồn tại');
    if (attendance.event.team.leader.id !== leaderId) {
      throw new ForbiddenException('Bạn không có quyền check-in cho team này');
    }
    attendance.status = status;
    if (note) attendance.note = note;
    return this.attendanceRepo.save(attendance);
  }

  // Player xem attendance của mình
  async getPlayerAttendances(playerId: number) {
    return this.attendanceRepo.find({ 
      where: { player: { id: playerId } },
      relations: ['event'],
      order: { createdAt: 'DESC' }
    });
  }

  // Leader xem attendance của team
  async getTeamAttendances(teamId: number, leaderId: number) {
    const attendances = await this.attendanceRepo.find({ 
      where: { event: { team: { id: teamId } } },
      relations: ['player', 'event', 'event.team', 'event.team.leader'],
      order: { createdAt: 'DESC' }
    });
    if (attendances.length > 0 && attendances[0].event.team.leader.id !== leaderId) {
      throw new ForbiddenException('Bạn không có quyền xem attendance của team này');
    }
    return attendances;
  }

  // Tạo attendance cho tất cả player khi tạo event
  async createAttendancesForEvent(eventId: number, teamId: number) {
    const players = await this.playersRepo.find({ where: { team: { id: teamId } } });
    const attendances = players.map(player => 
      this.attendanceRepo.create({ 
        event: { id: eventId }, 
        player: { id: player.id }, 
        status: 'pending' 
      })
    );
    await this.attendanceRepo.save(attendances);
  }
}
