import mongoose from 'mongoose';
import { ROLES } from '../constants/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.CUSTOMER
    },
    // Optional: for employees - department/location (e.g. "Floor 1", "Kitchen")
    department: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    avatar: {
      type: String,
      default: null
    },
    phone: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model('User', userSchema);

