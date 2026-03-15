import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema(
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
      enum: ['new', 'under_review', 'accepted', 'rejected'],
      default: 'new'
    },
    adminNotes: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

suggestionSchema.index({ user: 1, createdAt: -1 });
suggestionSchema.index({ status: 1 });

export const Suggestion = mongoose.model('Suggestion', suggestionSchema);
