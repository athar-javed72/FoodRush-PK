/**
 * RBAC: Role labels (positive names) and helpers.
 * Backend roles: customer, admin, driver, service_associate, facility_associate, manager
 */

export const ROLES = [
  'customer',
  'admin',
  'driver',
  'service_associate',
  'facility_associate',
  'manager'
] as const;

export type Role = (typeof ROLES)[number];

/** Positive display names for each role (workers, waiters, cleaning staff ke liye respectful names) */
export const ROLE_LABELS: Record<string, string> = {
  customer: 'Customer',
  admin: 'Admin',
  driver: 'Delivery Partner',
  service_associate: 'Service Associate',
  facility_associate: 'Facility Associate',
  manager: 'Manager'
};

/** Roles for team members (shown when adding from Team page) */
export const EMPLOYEE_ROLES: Role[] = [
  'admin',
  'manager',
  'driver',
  'service_associate',
  'facility_associate'
];

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

/** Staff hub access: Service Associate, Facility Associate */
export function isStaffRole(role: string): boolean {
  return role === 'service_associate' || role === 'facility_associate';
}

/** Redirect path after login by role (when no returnUrl) */
export function getDefaultRedirectForRole(role: string): string {
  if (role === 'admin') return '/admin';
  if (role === 'driver') return '/driver/dashboard';
  if (isStaffRole(role)) return '/staff/dashboard';
  if (role === 'manager') return '/admin'; // manager can see admin (limited by backend)
  return '/menu';
}
