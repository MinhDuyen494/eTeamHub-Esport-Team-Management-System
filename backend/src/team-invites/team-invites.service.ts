import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from 'src/teams/dto/create-team.dto';
import { UpdateTeamDto } from 'src/teams/dto/update-team.dto';
import { TeamInvite } from '../team-invites/entities/team-invite.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import teamInviteMessages from './messages/en';

@Injectable()
export class TeamInvitesService {
  constructor(
    @InjectRepository(TeamInvite) private invitesRepo: Repository<TeamInvite>,
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    private notificationsService: NotificationsService,
    private activityLogService: ActivityLogService,
  ) {}

  async create(teamId: number, playerId: number, leader?: any) {
    const player = await this.playersRepo.findOne({ where: { id: playerId }, relations: ['team', 'user'] });
    if (!player) throw new NotFoundException(teamInviteMessages.PLAYER_NOT_FOUND);
    if (player.team) throw new BadRequestException(teamInviteMessages.PLAYER_ALREADY_IN_TEAM);

    const existing = await this.invitesRepo.findOne({ where: { player: { id: playerId }, status: 'pending' } });
    if (existing) throw new BadRequestException(teamInviteMessages.INVITE_ALREADY_PENDING);

    const team = await this.teamsRepo.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException(teamInviteMessages.TEAM_NOT_FOUND);

    const invite = this.invitesRepo.create({ team, player, status: 'pending' });
    const savedInvite = await this.invitesRepo.save(invite);

    // Gửi notification cho player
    await this.notificationsService.create(
      player.user,
      `Bạn được mời vào team ${team.name}`,
      'invite'
    );

    // Ghi log gửi invite
    if (leader) {
      await this.activityLogService.createLog(
        leader,
        'invite_player',
        'team_invite',
        savedInvite.id,
        { teamId, playerId }
      );
    }

    return savedInvite;
  }

  async findInvitesForPlayer(playerId: number) {
    return this.invitesRepo.find({ where: { player: { id: playerId }, status: 'pending' } });
  }

  async acceptInvite(inviteId: number, playerId: number) {
    const invite = await this.invitesRepo.findOne({ where: { id: inviteId }, relations: ['player', 'team'] });
    if (!invite || invite.player.id !== playerId) throw new NotFoundException(teamInviteMessages.INVITE_NOT_FOUND);
    if (invite.status !== 'pending') throw new BadRequestException(teamInviteMessages.INVALID_INVITE_OPERATION || 'Invite đã xử lý');

    // Kiểm tra player chưa có team
    const player = await this.playersRepo.findOne({ where: { id: playerId }, relations: ['team'] });
    if (!player) throw new NotFoundException('Player không tồn tại');
    if (player.team) throw new BadRequestException('Bạn đã thuộc team khác');

    // Cập nhật player.team
    player.team = invite.team;
    await this.playersRepo.save(player);

    // Cập nhật invite
    invite.status = 'accepted';
    const savedInvite = await this.invitesRepo.save(invite);

    // Ghi log player accept invite
    await this.activityLogService.createLog(
      player.user,
      'accept_invite',
      'team_invite',
      invite.id,
      { teamId: invite.team.id }
    );

    return savedInvite;
  }

  async rejectInvite(inviteId: number, playerId: number) {
    const invite = await this.invitesRepo.findOne({ where: { id: inviteId }, relations: ['player', 'team'] });
    if (!invite || invite.player.id !== playerId) throw new NotFoundException('Invite không hợp lệ');
    if (invite.status !== 'pending') throw new BadRequestException('Invite đã xử lý');

    invite.status = 'rejected';
    const savedInvite = await this.invitesRepo.save(invite);

    // Gửi notification cho leader
    const team = await this.teamsRepo.findOne({ where: { id: invite.team.id }, relations: ['leader'] });
    if (team && team.leader) {
      await this.notificationsService.create(
        team.leader,
        `Player ${invite.player.fullName} đã từ chối lời mời vào team ${team.name}`,
        'invite'
      );
    }

    // Ghi log player reject invite
    await this.activityLogService.createLog(
      invite.player.user,
      'reject_invite',
      'team_invite',
      invite.id,
      { teamId: invite.team.id }
    );

    return savedInvite;
  }
}
