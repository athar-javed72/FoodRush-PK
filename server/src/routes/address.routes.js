import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  getAddresses,
  createAddressController,
  updateAddressController,
  deleteAddressController
} from '../controllers/address.controller.js';
import { createAddressSchema, updateAddressSchema } from '../validators/address.validator.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAddresses);
router.post('/', validate(createAddressSchema), createAddressController);
router.put('/:id', validate(updateAddressSchema), updateAddressController);
router.delete('/:id', deleteAddressController);

export default router;

