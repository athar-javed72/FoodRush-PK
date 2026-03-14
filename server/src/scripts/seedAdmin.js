/**
 * Ensures at least one admin user exists.
 * If no admin exists, promotes the first registered user (by createdAt) to admin.
 * Run: npm run seed:admin
 */
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { ROLES } from '../constants/roles.js';

async function seedAdmin() {
  await connectDB();

  const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
  if (adminCount > 0) {
    console.log('Admin user(s) already exist. No change.');
    process.exit(0);
    return;
  }

  const firstUser = await User.findOne().sort({ createdAt: 1 }).select('name email role');
  if (!firstUser) {
    console.log('No users in database. Register a user first, then run seed:admin again.');
    process.exit(1);
    return;
  }

  await User.findByIdAndUpdate(firstUser._id, { role: ROLES.ADMIN });
  console.log(`First user "${firstUser.email}" is now an admin.`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
