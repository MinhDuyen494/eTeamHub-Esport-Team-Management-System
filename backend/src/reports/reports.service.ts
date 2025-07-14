import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../attendance/entities/attendance.entity';
import { Event } from '../events/entities/event.entity';
import { Player } from '../players/entities/player.entity';
import { Team } from '../teams/entities/team.entity';
import reportMessages from './messages/en';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Attendance) private attendanceRepo: Repository<Attendance>,
    @InjectRepository(Event) private eventsRepo: Repository<Event>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
  ) {}

  async getTeamReport(teamId: number, leaderId: number, startDate?: Date, endDate?: Date) {
    // Kiểm tra quyền leader
    const team = await this.teamsRepo.findOne({ 
      where: { id: teamId }, 
      relations: ['leader'] 
    });
    if (!team || team.leader.id !== leaderId) {
      throw new ForbiddenException(reportMessages.FORBIDDEN);
    }

    // Lấy tất cả player trong team
    const players = await this.playersRepo.find({ 
      where: { team: { id: teamId } },
      relations: ['user']
    });

    // Lấy tất cả event trong khoảng thời gian
    const whereCondition: any = { team: { id: teamId } };
    if (startDate && endDate) {
      whereCondition.startTime = Between(startDate, endDate);
    }

    const events = await this.eventsRepo.find({ 
      where: whereCondition,
      order: { startTime: 'ASC' }
    });

    // Lấy attendance data
    const attendances = await this.attendanceRepo.find({
      where: { event: { team: { id: teamId } } },
      relations: ['event', 'player'],
      order: { event: { startTime: 'ASC' } }
    });

    // Xử lý dữ liệu cho từng player
    const playerReports = players.map(player => {
      const playerAttendances = attendances.filter(a => a.player.id === player.id);
      
      const totalEvents = events.length;
      const presentCount = playerAttendances.filter(a => a.status === 'present').length;
      const absentCount = playerAttendances.filter(a => a.status === 'absent').length;
      const acceptedCount = playerAttendances.filter(a => a.status === 'accepted').length;
      const declinedCount = playerAttendances.filter(a => a.status === 'declined').length;
      const pendingCount = playerAttendances.filter(a => a.status === 'pending').length;

      // Chi tiết từng event
      const eventDetails = events.map(event => {
        const attendance = playerAttendances.find(a => a.event.id === event.id);
        return {
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.startTime,
          eventType: event.type,
          rsvpStatus: attendance?.status === 'accepted' ? 'accepted' : 
                     attendance?.status === 'declined' ? 'declined' : 'pending',
          checkInStatus: attendance?.status === 'present' ? 'present' : 
                        attendance?.status === 'absent' ? 'absent' : 'not-checked',
          note: attendance?.note || null
        };
      });

      return {
        playerId: player.id,
        playerName: player.fullName,
        playerIGN: player.ign,
        playerRole: player.roleInGame.players,
        totalEvents,
        presentCount,
        absentCount,
        acceptedCount,
        declinedCount,
        pendingCount,
        attendanceRate: totalEvents > 0 ? ((presentCount / totalEvents) * 100).toFixed(1) : '0',
        eventDetails
      };
    });

    // Dữ liệu cho chart
    const chartData = {
      labels: playerReports.map(p => p.playerIGN),
      datasets: [
        {
          label: 'Có mặt',
          data: playerReports.map(p => p.presentCount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Vắng mặt',
          data: playerReports.map(p => p.absentCount),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };

    return {
      teamInfo: {
        teamId: team.id,
        teamName: team.name,
        totalMembers: players.length,
        totalEvents: events.length,
        reportPeriod: {
          startDate: startDate || events[0]?.startTime,
          endDate: endDate || events[events.length - 1]?.startTime
        }
      },
      summary: {
        totalPresent: playerReports.reduce((sum, p) => sum + p.presentCount, 0),
        totalAbsent: playerReports.reduce((sum, p) => sum + p.absentCount, 0),
        averageAttendanceRate: playerReports.length > 0 ? 
          (playerReports.reduce((sum, p) => sum + parseFloat(p.attendanceRate), 0) / playerReports.length).toFixed(1) : '0'
      },
      playerReports,
      chartData,
      eventTimeline: events.map(event => ({
        eventId: event.id,
        title: event.title,
        date: event.startTime,
        type: event.type
      }))
    };
  }

  async getPlayerReport(playerId: number, startDate?: Date, endDate?: Date) {
    // Lấy player, nếu không tồn tại thì báo lỗi
    const player = await this.playersRepo.findOne({ where: { id: playerId } });
    if (!player) throw new NotFoundException(reportMessages.PLAYER_NOT_FOUND);

    // Lấy attendance của player trong khoảng thời gian
    const whereAttendance: any = { player: { id: playerId } };
    if (startDate && endDate) {
      whereAttendance.event = { startTime: Between(startDate, endDate) };
    }
    const attendances = await this.attendanceRepo.find({
      where: whereAttendance,
      relations: ['event'],
      order: { event: { startTime: 'ASC' } }
    });

    const totalEvents = attendances.length;
    const presentCount = attendances.filter(a => a.status === 'present').length;
    const absentCount = attendances.filter(a => a.status === 'absent').length;

    const eventDetails = attendances.map(a => ({
      eventId: a.event.id,
      eventTitle: a.event.title,
      eventType: a.event.type,
      eventDate: a.event.startTime,
      rsvpStatus: a.status === 'accepted' ? 'accepted' : a.status === 'declined' ? 'declined' : a.status === 'pending' ? 'pending' : (a.status === 'present' || a.status === 'absent') ? 'accepted' : 'pending',
      attendanceStatus: a.status === 'present' ? 'present' : a.status === 'absent' ? 'absent' : 'not-checked',
      note: a.note || null
    }));

    return {
      playerId: player.id,
      playerName: player.fullName,
      playerIGN: player.ign,
      playerRole: player.roleInGame.players,
      totalEvents,
      presentCount,
      absentCount,
      eventDetails,
      chartData: {
        labels: ['Có mặt', 'Vắng mặt'],
        datasets: [
          {
            label: 'Số buổi',
            data: [presentCount, absentCount],
            backgroundColor: ['#4bc0c0', '#ff6384']
          }
        ]
      }
    };
  }
}
