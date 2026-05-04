import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['behavioral', 'situational', 'cv'],
      required: true,
    },
    subCategory: String,
    text: {
      type: String,
      required: true,
    },
    sampleAnswer: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: [String],
  },
  { timestamps: true }
);

export const Question = mongoose.model('Question', questionSchema);
