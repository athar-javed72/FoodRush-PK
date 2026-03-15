import express from 'express';
import { authMiddleware, requirePrivilege } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { PRIVILEGES } from '../constants/roles.js';
import {
  createComplaintController,
  listComplaintsController,
  getComplaintController,
  updateComplaintStatusController
} from '../controllers/complaint.controller.js';
import {
  createSuggestionController,
  listSuggestionsController,
  getSuggestionController,
  updateSuggestionStatusController
} from '../controllers/suggestion.controller.js';
import {
  markCheckInController,
  markCheckOutController,
  listAttendanceController
} from '../controllers/attendance.controller.js';
import {
  createComplaintSchema,
  updateComplaintStatusSchema
} from '../validators/complaint.validator.js';
import {
  createSuggestionSchema,
  updateSuggestionStatusSchema
} from '../validators/suggestion.validator.js';

const router = express.Router();

// Complaints
router.post(
  '/complaints',
  authMiddleware,
  requirePrivilege(PRIVILEGES.COMPLAINT_SUBMIT),
  validate(createComplaintSchema),
  createComplaintController
);
router.get(
  '/complaints',
  authMiddleware,
  listComplaintsController
);
router.get(
  '/complaints/:id',
  authMiddleware,
  getComplaintController
);
router.put(
  '/complaints/:id/status',
  authMiddleware,
  requirePrivilege(PRIVILEGES.COMPLAINT_LIST),
  validate(updateComplaintStatusSchema),
  updateComplaintStatusController
);

// Suggestions
router.post(
  '/suggestions',
  authMiddleware,
  requirePrivilege(PRIVILEGES.SUGGESTION_SUBMIT),
  validate(createSuggestionSchema),
  createSuggestionController
);
router.get(
  '/suggestions',
  authMiddleware,
  listSuggestionsController
);
router.get(
  '/suggestions/:id',
  authMiddleware,
  getSuggestionController
);
router.put(
  '/suggestions/:id/status',
  authMiddleware,
  requirePrivilege(PRIVILEGES.SUGGESTION_LIST),
  validate(updateSuggestionStatusSchema),
  updateSuggestionStatusController
);

// Attendance
router.post(
  '/attendance/check-in',
  authMiddleware,
  requirePrivilege(PRIVILEGES.ATTENDANCE_MARK),
  markCheckInController
);
router.post(
  '/attendance/check-out',
  authMiddleware,
  requirePrivilege(PRIVILEGES.ATTENDANCE_MARK),
  markCheckOutController
);
router.get(
  '/attendance',
  authMiddleware,
  requirePrivilege(PRIVILEGES.ATTENDANCE_MARK, PRIVILEGES.ATTENDANCE_VIEW_OWN, PRIVILEGES.ATTENDANCE_LIST),
  listAttendanceController
);

export default router;
