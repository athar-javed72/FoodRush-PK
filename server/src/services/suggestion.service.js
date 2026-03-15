import { Suggestion } from '../models/Suggestion.js';
import { hasPrivilege, PRIVILEGES } from '../constants/roles.js';

export async function createSuggestion(userId, { subject, description }) {
  const suggestion = await Suggestion.create({
    user: userId,
    subject: subject.trim(),
    description: description.trim()
  });
  return suggestion.populate('user', 'name email role');
}

export async function listMySuggestions(userId) {
  return Suggestion.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('user', 'name email role');
}

export async function listAllSuggestions(filters = {}) {
  const q = {};
  if (filters.status) q.status = filters.status;
  return Suggestion.find(q)
    .sort({ createdAt: -1 })
    .populate('user', 'name email role');
}

export async function getSuggestionById(id, userId, userRole) {
  const suggestion = await Suggestion.findById(id).populate('user', 'name email role');
  if (!suggestion) return null;
  const isOwner = (suggestion.user._id ? suggestion.user._id.toString() : suggestion.user.toString()) === userId;
  const canList = hasPrivilege(userRole, PRIVILEGES.SUGGESTION_LIST);
  if (!isOwner && !canList) return null;
  return suggestion;
}

export async function updateSuggestionStatus(id, { status, adminNotes }, userRole) {
  if (!hasPrivilege(userRole, PRIVILEGES.SUGGESTION_LIST)) return null;
  return Suggestion.findByIdAndUpdate(
    id,
    { status, ...(adminNotes !== undefined && { adminNotes }) },
    { new: true }
  ).populate('user', 'name email role');
}
