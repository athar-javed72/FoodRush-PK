import { User } from '../models/User.js';
import { ROLES } from '../constants/roles.js';
import { comparePassword, hashPassword } from '../utils/password.util.js';

export async function getCurrentUser(userId) {
  return User.findById(userId).select('-password');
}

export async function listUsers() {
  return User.find().select('name email role createdAt').sort({ createdAt: -1 });
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

