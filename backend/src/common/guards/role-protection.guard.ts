import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RoleProtectionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params, body } = request;

    // Nếu không có user (chưa đăng nhập), cho phép qua
    if (!user) {
      return true;
    }

    // Lấy ID của user đang được cập nhật
    const targetUserId = parseInt(params.id) || user.id;

    // Nếu user đang cập nhật chính mình hoặc user khác
    if (targetUserId !== user.id) {
      // Chỉ admin/leader mới được cập nhật user khác
      if (user.role !== 'leader') {
        throw new ForbiddenException('Bạn không có quyền cập nhật user khác');
      }
    }

    // Kiểm tra nếu đang cập nhật role
    if (body && body.role !== undefined) {
      // Lấy thông tin user hiện tại từ database
      const currentUser = await this.usersService.findById(targetUserId);
      
      if (!currentUser) {
        throw new ForbiddenException('User không tồn tại');
      }

      // Nếu user hiện tại là leader, không cho phép thay đổi role
      if (currentUser.role.name === 'leader') {
        throw new ForbiddenException('Không thể thay đổi role của leader');
      }

      // Nếu đang thay đổi thành leader, chỉ admin mới được phép
      if (body.role === 'leader' && user.role.name !== 'leader'|| user.role.name !== 'admin') {
        throw new ForbiddenException('Chỉ leader mới có thể gán role leader');
      }
    }

    return true;
  }
} 