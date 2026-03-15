import { User } from '../models/User.js';
import { ROLES } from '../constants/roles.js';
import { comparePassword, hashPassword } from '../utils/password.util.js';

const EMPLOYEE_ROLES = [
  ROLES.ADMIN,
  ROLES.DRIVER,
  ROLES.SERVICE_ASSOCIATE,
  ROLES.FACILITY_ASSOCIATE,
  ROLES.MANAGER
];

export async function getCurrentUser(userId) {
  return User.findById(userId).select('-password');
}

export async function listUsers(options = {}) {
  const { employeesOnly } = options;
  const query = employeesOnly ? { role: { $in: EMPLOYEE_ROLES } } : {};
  return User.find(query)
    .select('name email role avatar isActive createdAt department phone')
    .sort({ createdAt: -1 });
}

export async function getUserById(id) {
  const user = await User.findById(id).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

export async function createUser(payload) {
  const { name, email, password, role } = payload;
  if (!Object.values(ROLES).includes(role)) {
    const err = new Error('Invalid role');
    err.statusCode = 400;
    throw err;
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }
  const hashed = await hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashed,
    role
  });
  const u = user.toObject ? user.toObject() : user;
  delete u.password;
  return u;
}

export async function updateUserByAdmin(userId, updates) {
  const allowed = ['name', 'email', 'role', 'isActive', 'avatar', 'phone', 'department'];
  const safeUpdates = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) safeUpdates[key] = updates[key];
  }
  if (safeUpdates.email) safeUpdates.email = safeUpdates.email.toLowerCase().trim();
  if (updates.newPassword && updates.newPassword.length >= 6) {
    safeUpdates.password = await hashPassword(updates.newPassword);
  }
  const user = await User.findByIdAndUpdate(userId, safeUpdates, {
    new: true,
    runValidators: true
  }).select('name email role avatar isActive createdAt department phone');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

export async function deleteUser(userId) {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

export async function updateUserRole(userId, role) {
  if (!Object.values(ROLES).includes(role)) {
    const err = new Error('Invalid role');
    err.statusCode = 400;
    throw err;
  }
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select('name email role createdAt');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
}

export async function updateCurrentUser(userId, updates) {
  const allowed = ['name', 'phone', 'avatar'];
  const safeUpdates = {};

  for (const key of allowed) {
    if (updates[key] !== undefined) {
      safeUpdates[key] = updates[key];
    }
  }

  return User.findByIdAndUpdate(userId, safeUpdates, {
    new: true,
    runValidators: true,
    select: '-password'
  });
}

export async function updateUserPassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  const match = await comparePassword(currentPassword, user.password);
  if (!match) {
    const err = new Error('Current password is incorrect');
    err.statusCode = 400;
    throw err;
  }
  const hashed = await hashPassword(newPassword);
  await User.findByIdAndUpdate(userId, { password: hashed });
  return User.findById(userId).select('-password');
}

