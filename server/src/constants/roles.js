/**
 * RBAC: Role-Based Access Control + Privileges
 * Kal koi naya role add karna ho to ROLES me add karo aur ROLE_PRIVILEGES me us role ke permissions set karo.
 *
 * Role hierarchy (positive names for frontend):
 * 1. ADMIN - Full access
 * 2. MANAGER - Reports, complaints/suggestions/attendance view, manage staff view
 * 3. DELIVERY_PARTNER (driver) - Assigned orders, status update
 * 4. SERVICE_ASSOCIATE (waiter) - Complaint submit, Suggestion submit, Attendance only
 * 5. FACILITY_ASSOCIATE (cleaning) - Complaint submit, Suggestion submit, Attendance only
 * 6. CUSTOMER - Menu, cart, orders, profile
 */

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  DRIVER: 'driver', // API key; display name: Delivery Partner
  SERVICE_ASSOCIATE: 'service_associate', // waiters - positive: Service Associate
  FACILITY_ASSOCIATE: 'facility_associate', // cleaning - positive: Facility Associate
  MANAGER: 'manager'
};

/** Privilege codes - in future add more and assign to roles in ROLE_PRIVILEGES */
export const PRIVILEGES = {
  // Staff hub (complaints, suggestions, attendance)
  COMPLAINT_SUBMIT: 'complaint:submit',
  COMPLAINT_LIST: 'complaint:list',
  SUGGESTION_SUBMIT: 'suggestion:submit',
  SUGGESTION_LIST: 'suggestion:list',
  ATTENDANCE_MARK: 'attendance:mark',
  ATTENDANCE_VIEW_OWN: 'attendance:view_own',
  ATTENDANCE_LIST: 'attendance:list',
  // Driver
  ORDERS_DRIVER: 'orders:driver',
  // Admin (full)
  ADMIN_FULL: 'admin:full',
  // Employees management (admin/manager)
  EMPLOYEES_LIST: 'employees:list',
  EMPLOYEES_CREATE: 'employees:create',
  EMPLOYEES_UPDATE: 'employees:update',
  EMPLOYEES_DELETE: 'employees:delete'
};

/** Kaun role ko kaunse privileges: array of PRIVILEGES keys */
export const ROLE_PRIVILEGES = {
  [ROLES.CUSTOMER]: [],
  [ROLES.ADMIN]: [
    PRIVILEGES.ADMIN_FULL,
    PRIVILEGES.COMPLAINT_LIST,
    PRIVILEGES.SUGGESTION_LIST,
    PRIVILEGES.ATTENDANCE_LIST,
    PRIVILEGES.EMPLOYEES_LIST,
    PRIVILEGES.EMPLOYEES_CREATE,
    PRIVILEGES.EMPLOYEES_UPDATE,
    PRIVILEGES.EMPLOYEES_DELETE
  ],
  [ROLES.DRIVER]: [PRIVILEGES.ORDERS_DRIVER],
  [ROLES.SERVICE_ASSOCIATE]: [
    PRIVILEGES.COMPLAINT_SUBMIT,
    PRIVILEGES.SUGGESTION_SUBMIT,
    PRIVILEGES.ATTENDANCE_MARK,
    PRIVILEGES.ATTENDANCE_VIEW_OWN
  ],
  [ROLES.FACILITY_ASSOCIATE]: [
    PRIVILEGES.COMPLAINT_SUBMIT,
    PRIVILEGES.SUGGESTION_SUBMIT,
    PRIVILEGES.ATTENDANCE_MARK,
    PRIVILEGES.ATTENDANCE_VIEW_OWN
  ],
  [ROLES.MANAGER]: [
    PRIVILEGES.COMPLAINT_LIST,
    PRIVILEGES.SUGGESTION_LIST,
    PRIVILEGES.ATTENDANCE_LIST,
    PRIVILEGES.ATTENDANCE_VIEW_OWN,
    PRIVILEGES.EMPLOYEES_LIST
  ]
};

/** Admin has all privileges (checked in requirePrivilege) */
export function isAdmin(role) {
  return role === ROLES.ADMIN;
}

export function isDriver(role) {
  return role === ROLES.DRIVER;
}

/** Staff roles that see Staff Hub: complaint, suggestion, attendance */
export function isStaffRole(role) {
  return [ROLES.SERVICE_ASSOCIATE, ROLES.FACILITY_ASSOCIATE].includes(role);
}

/** Check if role has a given privilege (admin always has all) */
export function hasPrivilege(role, privilege) {
  if (!role) return false;
  if (isAdmin(role)) return true;
  const list = ROLE_PRIVILEGES[role];
  return Array.isArray(list) && list.includes(privilege);
}
