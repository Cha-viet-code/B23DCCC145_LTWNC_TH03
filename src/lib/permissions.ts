import type { Role } from '../types';

export type Action = 'post:view' | 'post:create' | 'post:resolve' | 'post:moderate';

const GUEST: Action[] = ['post:view'];

const PERMISSIONS: Record<Role, Action[]> = {
  member: ['post:view', 'post:create', 'post:resolve'],
  admin: ['post:view', 'post:moderate'],
};

export function can(role: Role | undefined, action: Action): boolean {
  return (role ? PERMISSIONS[role] : GUEST).includes(action);
}
