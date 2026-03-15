import path from 'path';
import fs from 'fs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export const uploadFile = asyncHandler(async (req, res) => {
  ensureUploadDir();
  if (!req.file || !req.file.filename) {
    const err = new Error('No file uploaded');
    err.statusCode = 400;
    throw err;
  }
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const url = `${baseUrl}/uploads/${req.file.filename}`;
  return successResponse(res, {
    message: 'File uploaded successfully',
    data: { url, filename: req.file.filename }
  });
});
