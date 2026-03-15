import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open'
    },
    adminNotes: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });

export const Complaint = mongoose.model('Complaint', complaintSchema);
