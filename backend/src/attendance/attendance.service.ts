import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { Event } from '../events/entities/event.entity';
import { Player } from '../players/entities/player.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    private notificationsService: NotificationsService,
    private activityLogService: ActivityLogService,
  ) {}

  // Player xác nhận RSVP
  async updateRSVP(attendanceId: number, status: 'accepted' | 'declined', playerId: number, note?: string) {
    const attendance = await this.attendanceRepo.findOne({ 
      where: { id: attendanceId }, 
      relations: ['player', 'event', 'event.team', 'event.team.leader'] 
    });
    if (!attendance || attendance.player.id !== playerId) {
      throw new ForbiddenException('Không có quyền cập nhật attendance này');
    }
    if (attendance.status !== 'pending') {
      throw new BadRequestException('Attendance đã được xử lý');
    }
    attendance.status = status;
    if (note) attendance.note = note;
    const savedAttendance = await this.attendanceRepo.save(attendance);

    // Ghi log RSVP
    await this.activityLogService.createLog(
      attendance.player.user,
      'rsvp_attendance',
      'attendance',
      attendance.id,
      { status, note }
    );

    // Gửi notification cho leader khi player RSVP
    if (attendance.event.team && attendance.event.team.leader) {
      await this.notificationsService.create(
        attendance.event.team.leader,
        `Player ${attendance.player.fullName} đã ${status === 'accepted' ? 'tham gia' : 'từ chối'} sự kiện ${attendance.event.title}`,
        'rsvp'
      );
    }

    return savedAttendance;
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
    const savedAttendance = await this.attendanceRepo.save(attendance);

    // Ghi log check-in
    await this.activityLogService.createLog(
      attendance.event.team.leader,
      'checkin_attendance',
      'attendance',
      attendance.id,
      { status, note, playerId: attendance.player.id }
    );

    // Gửi notification cho player nếu bị điểm danh vắng mặt
    if (status === 'absent') {
      await this.notificationsService.create(
        attendance.player.user,
        `Bạn đã bị điểm danh vắng mặt sự kiện ${attendance.event.title}`,
        'attendance'
      );
    }

    return savedAttendance;
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
  async createAttendancesForEvent(eventId: number, teamId: number, leader?: any) {
    const players = await this.playersRepo.find({ where: { team: { id: teamId } } });
    const attendances = players.map(player => 
      this.attendanceRepo.create({ 
        event: { id: eventId }, 
        player: { id: player.id }, 
        status: 'pending' 
      })
    );
    await this.attendanceRepo.save(attendances);
    // Ghi log tạo attendance cho event nếu có leader
    if (leader) {
      await this.activityLogService.createLog(
        leader,
        'create_attendance_for_event',
        'event',
        eventId,
        { teamId, playerIds: players.map(p => p.id) }
      );
    }
  }
}
