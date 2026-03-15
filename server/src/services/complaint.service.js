import { Complaint } from '../models/Complaint.js';
import { ROLES, hasPrivilege, PRIVILEGES } from '../constants/roles.js';

export async function createComplaint(userId, { subject, description }) {
  const complaint = await Complaint.create({
    user: userId,
    subject: subject.trim(),
    description: description.trim()
  });
  return complaint.populate('user', 'name email role');
}

export async function listMyComplaints(userId) {
  return Complaint.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user', 'name email role');
}

export async function listAllComplaints(filters = {}) {
  const q = {};
  if (filters.status) q.status = filters.status;
  return Complaint.find(q)
    .sort({ createdAt: -1 })
    .populate('user', 'name email role');
}

export async function getComplaintById(id, userId, userRole) {
  const complaint = await Complaint.findById(id).populate('user', 'name email role');
  if (!complaint) return null;
  const isOwner = (complaint.user._id ? complaint.user._id.toString() : complaint.user.toString()) === userId;
  const canList = hasPrivilege(userRole, PRIVILEGES.COMPLAINT_LIST);
  if (!isOwner && !canList) return null;
  return complaint;
}

export async function updateComplaintStatus(id, { status, adminNotes }, userRole) {
  if (!hasPrivilege(userRole, PRIVILEGES.COMPLAINT_LIST)) return null;
  return Complaint.findByIdAndUpdate(
    id,
    { status, ...(adminNotes !== undefined && { adminNotes }) },
    { new: true }
  ).populate('user', 'name email role');
}
