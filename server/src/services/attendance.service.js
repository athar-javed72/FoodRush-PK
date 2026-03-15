import { Attendance } from '../models/Attendance.js';
import { hasPrivilege, PRIVILEGES } from '../constants/roles.js';

function startOfDay(d) {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

export async function markCheckIn(userId) {
  const date = startOfDay(new Date());
  let att = await Attendance.findOne({ user: userId, date });
  if (att) {
    if (att.checkIn) return att; // already checked in
    att.checkIn = new Date();
    att.status = 'present';
    await att.save();
  } else {
    att = await Attendance.create({
      user: userId,
      date,
      checkIn: new Date(),
      status: 'present'
    });
  }
  return att.populate('user', 'name email role');
}

export async function markCheckOut(userId) {
  const date = startOfDay(new Date());
  const att = await Attendance.findOne({ user: userId, date });
  if (!att) return null;
  att.checkOut = new Date();
  await att.save();
  return att.populate('user', 'name email role');
}

export async function listMyAttendance(userId, { from, to } = {}) {
  const q = { user: userId };
  if (from || to) {
    q.date = {};
    if (from) q.date.$gte = startOfDay(new Date(from));
    if (to) q.date.$lte = new Date(to);
  }
  return Attendance.find(q).sort({ date: -1 }).populate('user', 'name email role');
}

export async function listAllAttendance(filters = {}) {
  const q = {};
  if (filters.userId) q.user = filters.userId;
  if (filters.from || filters.to) {
    q.date = {};
    if (filters.from) q.date.$gte = startOfDay(new Date(filters.from));
    if (filters.to) q.date.$lte = new Date(filters.to);
  }
  return Attendance.find(q)
    .sort({ date: -1 })
    .populate('user', 'name email role');
}
