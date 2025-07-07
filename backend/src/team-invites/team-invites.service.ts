import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from 'src/teams/dto/create-team.dto';
import { UpdateTeamDto } from 'src/teams/dto/update-team.dto';
import { TeamInvite } from '../team-invites/entities/team-invite.entity';

@Injectable()
export class TeamInvitesService {
  constructor(
    @InjectRepository(TeamInvite) private invitesRepo: Repository<TeamInvite>,
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
  ) {}

  async create(teamId: number, playerId: number) {
    const player = await this.playersRepo.findOne({ where: { id: playerId }, relations: ['team'] });
    if (!player) throw new NotFoundException('Player không tồn tại');
    if (player.team) throw new BadRequestException('Player đã thuộc team khác');

    const existing = await this.invitesRepo.findOne({ where: { player: { id: playerId }, status: 'pending' } });
    if (existing) throw new BadRequestException('Player đã có invite chờ xử lý');

    const team = await this.teamsRepo.findOne({ where: { id: teamId } });
    if (!team) throw new NotFoundException('Team không tồn tại');

    const invite = this.invitesRepo.create({ team, player, status: 'pending' });
    return this.invitesRepo.save(invite);
  }

  async findInvitesForPlayer(playerId: number) {
    return this.invitesRepo.find({ where: { player: { id: playerId }, status: 'pending' } });
  }

  async acceptInvite(inviteId: number, playerId: number) {
    const invite = await this.invitesRepo.findOne({ where: { id: inviteId }, relations: ['player', 'team'] });
    if (!invite || invite.player.id !== playerId) throw new NotFoundException('Invite không hợp lệ');
    if (invite.status !== 'pending') throw new BadRequestException('Invite đã xử lý');

    // Kiểm tra player chưa có team
    const player = await this.playersRepo.findOne({ where: { id: playerId }, relations: ['team'] });
    if (!player) throw new NotFoundException('Player không tồn tại');
    if (player.team) throw new BadRequestException('Bạn đã thuộc team khác');

    // Cập nhật player.team
    player.team = invite.team;
    await this.playersRepo.save(player);

    // Cập nhật invite
    invite.status = 'accepted';
    return this.invitesRepo.save(invite);
  }

  async rejectInvite(inviteId: number, playerId: number) {
    const invite = await this.invitesRepo.findOne({ where: { id: inviteId }, relations: ['player'] });
    if (!invite || invite.player.id !== playerId) throw new NotFoundException('Invite không hợp lệ');
    if (invite.status !== 'pending') throw new BadRequestException('Invite đã xử lý');

    invite.status = 'rejected';
    return this.invitesRepo.save(invite);
  }
}
