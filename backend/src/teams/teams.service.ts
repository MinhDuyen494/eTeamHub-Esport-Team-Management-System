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
    // Tìm user thực hiện thao tác (có thể là leader hoặc admin)
    const user = await this.usersRepo.findOne({ where: { id: leaderId }, relations: ['role'] });
    if (!user || (user.role.name !== 'leader' && user.role.name !== 'admin')) {
      throw new ForbiddenException(teamMessages.FORBIDDEN);
    }

    let teamLeader: User;

    if (user.role.name === 'admin') {
      // Admin tạo team: phải chọn leader chưa có team
      if (!createTeamDto.leaderId) {
        throw new BadRequestException('Admin phải chọn leader cho team');
      }
      const foundLeader = await this.usersRepo.findOne({ 
        where: { id: createTeamDto.leaderId }, 
        relations: ['role'] 
      });
      if (!foundLeader || foundLeader.role.name !== 'leader') {
        throw new BadRequestException('User được chọn không phải là leader');
      }
      teamLeader = foundLeader;
      
      // Kiểm tra leader đã có team chưa
      const existingTeam = await this.teamsRepo.findOne({ 
        where: { leader: { id: teamLeader.id } } 
      });
      if (existingTeam) {
        throw new BadRequestException('Leader này đã có team');
      }
    } else {
      // Leader tạo team: kiểm tra leader chưa có team
      const existingTeam = await this.teamsRepo.findOne({ 
        where: { leader: { id: user.id } } 
      });
      if (existingTeam) {
        throw new BadRequestException('Bạn đã có team, không thể tạo thêm');
      }
      teamLeader = user;
    }

    // Tìm các player muốn thêm (nếu có)
    let members: Player[] = [];
    if (createTeamDto.memberIds && createTeamDto.memberIds.length > 0) {
      members = await this.playersRepo.findByIds(createTeamDto.memberIds);
    }

    const team = this.teamsRepo.create({
      name: createTeamDto.name,
      description: createTeamDto.description,
      leader: teamLeader,
      members,
    });
    const savedTeam = await this.teamsRepo.save(team);
    await this.activityLogService.createLog(
      user,
      'create_team',
      'team',
      savedTeam.id,
      { ...createTeamDto }
    );
    return savedTeam;
  }

  async update(teamId: number, updateTeamDto: UpdateTeamDto, leaderId: number) {
    console.log('Update team - teamId:', teamId);
    console.log('Update team - updateTeamDto:', updateTeamDto);
    console.log('Update team - leaderId:', leaderId);
    
    const team = await this.teamsRepo.findOne({ where: { id: teamId }, relations: ['leader'] });
    if (!team) throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    const user = await this.usersRepo.findOne({ where: { id: leaderId }, relations: ['role'] });
    if (!user || (user.role.name !== 'leader' && user.role.name !== 'admin')) {
      throw new ForbiddenException(teamMessages.FORBIDDEN);
    }
    if (user.role.name === 'leader' && team.leader.id !== leaderId) {
      throw new ForbiddenException(teamMessages.FORBIDDEN);
    }

    const before = { ...team };
    
    // Chỉ update name và description
    if (updateTeamDto.name) {
      console.log('Updating name from:', team.name, 'to:', updateTeamDto.name);
      team.name = updateTeamDto.name;
    }
    if (updateTeamDto.description) {
      console.log('Updating description from:', team.description, 'to:', updateTeamDto.description);
      team.description = updateTeamDto.description;
    }
    
    console.log('Team object before save:', team);
    const updated = await this.teamsRepo.save(team);
    console.log('Updated team data:', updated);
    await this.activityLogService.createLog(
      user,
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
    const user = await this.usersRepo.findOne({ where: { id: leaderId }, relations: ['role'] });
    if (!user || (user.role.name !== 'leader' && user.role.name !== 'admin')) {
      throw new ForbiddenException(teamMessages.FORBIDDEN);
    }
    if (user.role.name === 'leader' && team.leader.id !== leaderId) {
      throw new ForbiddenException(teamMessages.FORBIDDEN);
    }
    await this.teamsRepo.remove(team);
    await this.activityLogService.createLog(
      user,
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

  // Lấy thông tin chi tiết của một team
  async getTeam(teamId: number) {
    const team = await this.teamsRepo.findOne({
      where: { id: teamId },
      relations: ['leader', 'members'],
    });
    if (!team) {
      throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    }
    return team;
  }

  // User tự rời khỏi team
  async leaveTeam(teamId: number, userId: number) {
    const team = await this.teamsRepo.findOne({ 
      where: { id: teamId }, 
      relations: ['leader', 'members', 'members.user'] 
    });
    if (!team) {
      throw new NotFoundException(teamMessages.TEAM_NOT_FOUND);
    }

    // Kiểm tra user có phải là member của team không
    const isMember = team.members.some(member => member.user?.id === userId);
    if (!isMember) {
      throw new ForbiddenException('Bạn không phải là thành viên của team này');
    }

    // Không cho phép leader rời khỏi team
    if (team.leader.id === userId) {
      throw new ForbiddenException('Leader không thể rời khỏi team. Hãy xóa team hoặc chuyển quyền leader.');
    }

    // Xóa user khỏi team
    team.members = team.members.filter(member => member.user?.id !== userId);
    const updatedTeam = await this.teamsRepo.save(team);

    // Lấy thông tin user để log
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    
    if (user) {
      await this.activityLogService.createLog(
        user,
        'leave_team',
        'team',
        team.id,
        { teamName: team.name, userName: user.email }
      );
    }

    return {
      message: 'Đã rời khỏi team thành công',
      team: updatedTeam
    };
  }
}
