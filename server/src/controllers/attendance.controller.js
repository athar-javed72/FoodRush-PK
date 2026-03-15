import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  markCheckIn,
  markCheckOut,
  listMyAttendance,
  listAllAttendance
} from '../services/attendance.service.js';
import { hasPrivilege, PRIVILEGES } from '../constants/roles.js';

export const markCheckInController = asyncHandler(async (req, res) => {
  const attendance = await markCheckIn(req.user.id);
  return successResponse(res, {
    message: 'Check-in recorded successfully',
    data: { attendance }
  });
});

export const markCheckOutController = asyncHandler(async (req, res) => {
  const attendance = await markCheckOut(req.user.id);
  if (!attendance) {
    return res.status(400).json({
      success: false,
      message: 'No check-in found for today. Please check in first.',
      errors: [{ message: 'No check-in for today' }]
    });
  }
  return successResponse(res, {
    message: 'Check-out recorded successfully',
    data: { attendance }
  });
});

export const listAttendanceController = asyncHandler(async (req, res) => {
  const canListAll = hasPrivilege(req.user.role, PRIVILEGES.ATTENDANCE_LIST);
  const { from, to, userId } = req.query;
  const list = canListAll
    ? await listAllAttendance({ from, to, userId })
    : await listMyAttendance(req.user.id, { from, to });
  return successResponse(res, {
    message: 'Attendance fetched successfully',
    data: { attendance: list }
  });
});
