import { SetMetadata } from '@nestjs/common';

export const PROTECT_ROLE_KEY = 'protectRole';
export const ProtectRole = () => SetMetadata(PROTECT_ROLE_KEY, true); 