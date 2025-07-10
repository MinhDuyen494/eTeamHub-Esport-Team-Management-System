import { Injectable } from '@nestjs/common';
import { BaseRoleGuard } from './base-role.guard';

@Injectable()
export class UserGuard extends BaseRoleGuard {
  allowedRoles = ['player', 'leader', 'admin'];
}
