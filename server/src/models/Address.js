import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    area: {
      type: String,
      required: true
    },
    streetAddress: {
      type: String,
      required: true
    },
    landmark: {
      type: String
    },
    postalCode: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: 'Home'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export const Address = mongoose.model('Address', addressSchema);

