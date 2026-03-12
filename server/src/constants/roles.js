export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

