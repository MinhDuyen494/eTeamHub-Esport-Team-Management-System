import { Injectable } from '@nestjs/common';
import { BaseRoleGuard } from './base-role.guard';

@Injectable()
export class LeaderGuard extends BaseRoleGuard {
  allowedRoles = ['leader', 'admin'];
}
