import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createComplaint,
  listMyComplaints,
  listAllComplaints,
  getComplaintById,
  updateComplaintStatus
} from '../services/complaint.service.js';
import { hasPrivilege, PRIVILEGES } from '../constants/roles.js';

export const createComplaintController = asyncHandler(async (req, res) => {
  const complaint = await createComplaint(req.user.id, req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Complaint submitted successfully',
    data: { complaint }
  });
});

export const listComplaintsController = asyncHandler(async (req, res) => {
  const canListAll = hasPrivilege(req.user.role, PRIVILEGES.COMPLAINT_LIST);
  const list = canListAll
    ? await listAllComplaints({ status: req.query.status })
    : await listMyComplaints(req.user.id);
  return successResponse(res, {
    message: 'Complaints fetched successfully',
    data: { complaints: list }
  });
});

export const getComplaintController = asyncHandler(async (req, res) => {
  const complaint = await getComplaintById(req.params.id, req.user.id, req.user.role);
  if (!complaint) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found',
      errors: [{ message: 'Complaint not found' }]
    });
  }
  return successResponse(res, {
    message: 'Complaint fetched successfully',
    data: { complaint }
  });
});

export const updateComplaintStatusController = asyncHandler(async (req, res) => {
  const updated = await updateComplaintStatus(req.params.id, req.body, req.user.role);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Complaint not found or access denied',
      errors: [{ message: 'Not found' }]
    });
  }
  return successResponse(res, {
    message: 'Complaint status updated',
    data: { complaint: updated }
  });
});
