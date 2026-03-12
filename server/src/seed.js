import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { hashPassword } from './utils/password.util.js';
import { ROLES } from './constants/roles.js';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'password';
const ADMIN_NAME = 'Admin';

async function seedAdmin() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      existing.password = await hashPassword(ADMIN_PASSWORD);
      existing.role = ROLES.ADMIN;
      await existing.save();
      console.log(`Admin user updated: ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD}, role: admin)`);
    } else {
      const hashed = await hashPassword(ADMIN_PASSWORD);
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashed,
        role: ROLES.ADMIN
      });
      console.log(`Admin user created: ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD}, role: admin)`);
    }
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
