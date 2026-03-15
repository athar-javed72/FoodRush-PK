import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import {
  createSuggestion,
  listMySuggestions,
  listAllSuggestions,
  getSuggestionById,
  updateSuggestionStatus
} from '../services/suggestion.service.js';
import { hasPrivilege, PRIVILEGES } from '../constants/roles.js';

export const createSuggestionController = asyncHandler(async (req, res) => {
  const suggestion = await createSuggestion(req.user.id, req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Suggestion submitted successfully',
    data: { suggestion }
  });
});

export const listSuggestionsController = asyncHandler(async (req, res) => {
  const canListAll = hasPrivilege(req.user.role, PRIVILEGES.SUGGESTION_LIST);
  const list = canListAll
    ? await listAllSuggestions({ status: req.query.status })
    : await listMySuggestions(req.user.id);
  return successResponse(res, {
    message: 'Suggestions fetched successfully',
    data: { suggestions: list }
  });
});

export const getSuggestionController = asyncHandler(async (req, res) => {
  const suggestion = await getSuggestionById(req.params.id, req.user.id, req.user.role);
  if (!suggestion) {
    return res.status(404).json({
      success: false,
      message: 'Suggestion not found',
      errors: [{ message: 'Suggestion not found' }]
    });
  }
  return successResponse(res, {
    message: 'Suggestion fetched successfully',
    data: { suggestion }
  });
});

export const updateSuggestionStatusController = asyncHandler(async (req, res) => {
  const updated = await updateSuggestionStatus(req.params.id, req.body, req.user.role);
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: 'Suggestion not found or access denied',
      errors: [{ message: 'Not found' }]
    });
  }
  return successResponse(res, {
    message: 'Suggestion status updated',
    data: { suggestion: updated }
  });
});
