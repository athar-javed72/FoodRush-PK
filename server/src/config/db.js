import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENV.MONGODB_URI);
    // Optional: log once; caller can also log
  } catch (error) {
    // Re-throw so server startup can handle and exit
    throw error;
  }
}

