import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    checkIn: {
      type: Date,
      default: null
    },
    checkOut: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'half_day', 'leave'],
      default: 'present'
    },
    notes: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// One record per user per day (staff marks check-in/check-out; date is start of day)
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
