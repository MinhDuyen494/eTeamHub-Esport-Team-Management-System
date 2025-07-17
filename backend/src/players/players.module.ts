import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayersController } from './controllers/players.controller';
import { PlayersService } from './players.service';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { RoleInGame } from './entities/role-in-game.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Player, RoleInGame]),
    ActivityLogModule,
  ],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService],

})
export class PlayersModule {}
