import { Address } from '../models/Address.js';

export async function listAddresses(userId) {
  return Address.find({ user: userId }).sort({ createdAt: -1 });
}

export async function createAddress(userId, payload) {
  const address = await Address.create({
    ...payload,
    user: userId
  });
  return address;
}

export async function updateAddress(userId, id, updates) {
  const address = await Address.findOneAndUpdate({ _id: id, user: userId }, updates, {
    new: true,
    runValidators: true
  });
  if (!address) {
    const err = new Error('Address not found');
    err.statusCode = 404;
    throw err;
  }
  return address;
}

export async function deleteAddress(userId, id) {
  const address = await Address.findOneAndDelete({ _id: id, user: userId });
  if (!address) {
    const err = new Error('Address not found');
    err.statusCode = 404;
    throw err;
  }
  return address;
}

