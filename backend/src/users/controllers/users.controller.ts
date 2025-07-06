import { Controller, Get, Put, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RoleProtectionGuard } from '../../common/guards/role-protection.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ProtectRole } from '../../common/decorators/protect-role.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RoleProtectionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id, { withPlayer: true });
  }

  @Put(':id')
  @ProtectRole()
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req
  ) {
    return this.usersService.updateUser(id, updateUserDto, req.user);
  }
} 