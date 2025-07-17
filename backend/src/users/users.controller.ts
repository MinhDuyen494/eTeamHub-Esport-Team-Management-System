import { Controller, Get, Put, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Req, Request, BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RoleProtectionGuard } from '../common/guards/role-protection.guard';
import { ProtectRole } from '../common/decorators/protect-role.decorator';
import { ResetUserPasswordDto } from './dto/reset-user-password.dto';
import { Throttle } from '@nestjs/throttler';
import { AdminGuard } from '../common/guards/admin.guard';
import { UserGuard } from '../common/guards/user.guard';
import { LeaderGuard } from '../common/guards/leader.guard';
import { Query } from '@nestjs/common';
@Throttle({ default: { limit: 5, ttl: 60 } }) // 5 requests mỗi 60 giây cho tất cả route trong controller này
@Controller('users')  
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Dashboard API - Lấy thống kê users
  @Get('stats')
  @UseGuards( AdminGuard) 
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  // Temporary API to create admin user (for development only)
  @Post('create-admin')
  async createAdminUser(@Body() data: { email: string; password: string; fullName: string }) {
    return this.usersService.createAdminUser(data);
  }
  @Post('create-leader')
  async createLeaderUser(@Body() data: { email: string; password: string; fullName: string }) {
    return this.usersService.createLeaderUser(data);
  }

  // 1. GET /users/profile – lấy thông tin user hiện tại (dựa trên JWT)
  @Get('profile')
  @UseGuards(UserGuard)
  async getProfile(@Request() req) {
    const user = await this.usersService.getProfile(req.user.id);
    if (!user) throw new BadRequestException('User không tồn tại');
    return { message: 'Lấy profile thành công', user };
  }

  // Đã loại bỏ API cập nhật user khác. Chỉ giữ API cho user tự cập nhật profile/mật khẩu của mình.

  // 3. POST /users/change-password-secure – đổi mật khẩu bảo mật
  @Post('change-password-secure')
  @UseGuards(UserGuard)
  async changePasswordSecure(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req
  ) {
    if (!changePasswordDto.oldPassword || !changePasswordDto.newPassword) {
      throw new BadRequestException('Thiếu thông tin oldPassword hoặc newPassword');
    }
    return this.usersService.changePasswordSecure(
      req.user.id,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
      req.user
    );
  }

  // 4. PUT /users/profile/update – user chỉ được cập nhật thông tin cá nhân của chính mình, không cho phép update role
  @Put('profile/update')
  @UseGuards(UserGuard)
  async updateUserProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req
  ) {
    // Không cho phép update trường role qua API này
    if ('role' in updateProfileDto) {
      throw new BadRequestException('Không được phép cập nhật role qua API này');
    }
    // Đảm bảo user chỉ update chính mình
    return this.usersService.updateUserProfile(
      req.user.id,
      updateProfileDto,
      req.user
    );
  }

  // API cho admin reset mật khẩu user khác
  @Put('admin/:id/reset-password')
  @UseGuards(RoleProtectionGuard, AdminGuard)
  @ProtectRole()
  async adminResetUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() resetDto: ResetUserPasswordDto,
    @Request() req
  ) {
    // req.user là admin thực hiện
    const result = await this.usersService.adminResetUserPassword(id, resetDto.newPassword, req.user);
    return {
      message: 'Đặt lại mật khẩu thành công',
      userId: id,
      newPassword: result.newPassword, // chỉ trả về cho admin
      resetBy: req.user.id,
      resetAt: result.resetAt,
    };
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }
}
