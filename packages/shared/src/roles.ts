export const ROLES = {
  USER: 'user',
  RESTAURANT_OWNER: 'restaurant_owner',
  DELIVERY: 'delivery',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  [ROLES.USER]: 1,
  [ROLES.RESTAURANT_OWNER]: 2,
  [ROLES.DELIVERY]: 2,
  [ROLES.ADMIN]: 10,
};

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}
