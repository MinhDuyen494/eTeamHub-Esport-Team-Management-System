import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { User } from '../users/entities/user.entity';
import { Player } from '../players/entities/player.entity';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import teamMessages from './messages/en';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private teamsRepo: Repository<Team>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    private activityLogService: ActivityLogService,
  ) {}

  async create(createTeamDto: CreateTeamDto, leaderId: number) {
    // Tìm leader
    const leader = await this.usersRepo.findOne({ where: { id: leaderId } });
    if (!leader || leader.role.name !== 'leader')
      throw new ForbiddenException(teamMessages.FORBIDDEN);

    // Tìm các player muốn thêm (nếu có)
    let members: Player[] = [];
    if (createTeamDto.memberIds && createTeamDto.memberIds.length > 0) {
      members = await this.playersRepo.findByIds(createTeamDto.memberIds);
    }

    const team = this.teamsRepo.create({
      name: createTeamDto.name,
      description: createTeamDto.description,
      leader,
      members,
    });
    const savedTeam = await this.teamsRepo.save(team);
    await this.activityLogService.createLog(
      leader,
      'create_team',
      'team',
      savedTeam.id,
      { ...createTeamDto }
    );
    return savedTeam;
  }

  async update(teamId: number, updateTeamDto: UpdateTeamDto, leaderId: number) {
    // Chỉ leader của team mới được update
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    if (team.leader.id !== leaderId) throw new ForbiddenException(teamMessages.FORBIDDEN);

    const before = { ...team };
    Object.assign(team, updateTeamDto);
    const updated = await this.teamsRepo.save(team);
    await this.activityLogService.createLog(
      team.leader,
      'update_team',
      'team',
      team.id,
      { before, after: updated }
    );
    return updated;
  }

  async remove(teamId: number, leaderId: number) {
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    if (team.leader.id !== leaderId) throw new ForbiddenException(teamMessages.FORBIDDEN);
    await this.teamsRepo.remove(team);
    await this.activityLogService.createLog(
      team.leader,
      'delete_team',
      'team',
      team.id,
      { name: team.name }
    );
    return { message: 'Đã xóa team thành công' };
  }
  
  async addMember(teamId: number, playerId: number, leaderId: number) {
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader', 'members'] });
    if (!team) throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    if (team.leader.id !== leaderId) throw new ForbiddenException(teamMessages.FORBIDDEN);
  
    const player = await this.playersRepo.findOne({ where: { id: playerId } });
    if (!player) throw new NotFoundException(teamMessages.MEMBER_ALREADY_IN_TEAM);
  
    if (team.members.some(mem => mem.id === playerId)) {
      throw new ForbiddenException(teamMessages.MEMBER_ALREADY_IN_TEAM);
    }
  
    team.members.push(player);
    const updatedTeam = await this.teamsRepo.save(team);
    await this.activityLogService.createLog(
      team.leader,
      'add_member_to_team',
      'team',
      team.id,
      { memberId: playerId, memberName: player.fullName }
    );
    return updatedTeam;
  }
  
  async removeMember(teamId: number, playerId: number, leaderId: number) {
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader', 'members'] });
    if (!team) throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    if (team.leader.id !== leaderId) throw new ForbiddenException(teamMessages.FORBIDDEN);
    team.members = team.members.filter(mem => mem.id !== playerId);
    const updatedTeam = await this.teamsRepo.save(team);
    await this.activityLogService.createLog(
      team.leader,
      'remove_member_from_team',
      'team',
      team.id,
      { memberId: playerId, memberName: team.members.find(mem => mem.id === playerId)?.fullName }
    );
    return updatedTeam;
  }

  // Dashboard API - Lấy thống kê teams
  async getTeamStats() {
    const totalTeams = await this.teamsRepo.count();
    const activeTeams = await this.teamsRepo
      .createQueryBuilder('team')
      .leftJoin('team.members', 'member')
      .groupBy('team.id')
      .having('COUNT(member.id) > 0')
      .getCount();
    
    return {
      totalTeams,
      activeTeams,
      emptyTeams: totalTeams - activeTeams,
    };
  }

  // Lấy danh sách teams (cho frontend fallback)
  async getTeams() {
    return this.teamsRepo.find({
      relations: ['leader', 'members'],
      order: { createdAt: 'DESC' }
    });
  }
}
