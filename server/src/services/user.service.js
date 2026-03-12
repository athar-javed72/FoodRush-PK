import { User } from '../models/User.js';

export async function getCurrentUser(userId) {
  return User.findById(userId).select('-password');
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

