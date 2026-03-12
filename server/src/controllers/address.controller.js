import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/response.util.js';
import { listAddresses, createAddress, updateAddress, deleteAddress } from '../services/address.service.js';

export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await listAddresses(req.user.id);
  return successResponse(res, {
    message: 'Addresses fetched successfully',
    data: { addresses }
  });
});

export const createAddressController = asyncHandler(async (req, res) => {
  const address = await createAddress(req.user.id, req.body);
  return successResponse(res, {
    statusCode: 201,
    message: 'Address created successfully',
    data: { address }
  });
});

export const updateAddressController = asyncHandler(async (req, res) => {
  const address = await updateAddress(req.user.id, req.params.id, req.body);
  return successResponse(res, {
    message: 'Address updated successfully',
    data: { address }
  });
});

export const deleteAddressController = asyncHandler(async (req, res) => {
  await deleteAddress(req.user.id, req.params.id);
  return successResponse(res, {
    message: 'Address deleted successfully',
    data: {}
  });
});

