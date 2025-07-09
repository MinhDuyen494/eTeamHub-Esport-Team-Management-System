import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamInvite } from './entities/team-invite.entity';
import { TeamInvitesService } from './team-invites.service';
import { TeamInvitesController } from './team-invites.controller';
import { Team } from '../teams/entities/team.entity';
import { Player } from '../players/entities/player.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamInvite, Team, Player]),
    NotificationsModule,
    ActivityLogModule,
  ],
  providers: [TeamInvitesService],
  controllers: [TeamInvitesController],
  exports: [TeamInvitesService],
})
export class TeamInvitesModule {}
