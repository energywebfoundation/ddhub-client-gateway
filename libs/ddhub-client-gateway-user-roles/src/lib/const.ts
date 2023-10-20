import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  ADMIN = 'admin',
  MESSAGING = 'messaging',
}

export type UserRoleEndpointMap = Record<string, boolean>;

export const USER_ROLES_PERMISSION_MAP: Record<UserRole, UserRoleEndpointMap> =
  {
    [UserRole.ADMIN]: {},
    [UserRole.MESSAGING]: {},
  };

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
