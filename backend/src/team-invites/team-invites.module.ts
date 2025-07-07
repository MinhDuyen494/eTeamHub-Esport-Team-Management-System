import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamInvite } from './entities/team-invite.entity';
import { TeamInvitesService } from './team-invites.service';
import { TeamInvitesController } from './team-invites.controller';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamInvite, Team, Player])],
  providers: [TeamInvitesService],
  controllers: [TeamInvitesController],
})
export class TeamInvitesModule {}
