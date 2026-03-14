export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  DRIVER: 'driver'
};

export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

export function isDriver(role) {
  return role === ROLES.DRIVER;
}

