import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Player } from '../players/entities/player.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersController } from './users.controller';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { Role } from './entities/roles.entity';
import { RoleInGame } from 'src/players/entities/role-in-game.entity';
import { Team } from '../teams/entities/team.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Player, Role, RoleInGame, Team]),
    NotificationsModule,
    ActivityLogModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
