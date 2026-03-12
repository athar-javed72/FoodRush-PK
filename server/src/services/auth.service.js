import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.util.js';
import { signToken } from '../utils/token.util.js';

export async function registerUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email is already registered');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashed
  });

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  };
}

