import mongoose from 'mongoose';

interface Feedback {
  overallScore: number;
  starBreakdown: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  strengths: string[];
  improvements: string[];
  technicalDepth: number;
  exampleBetterAnswer: string;
}

const practiceSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    audioUrl: String,
    feedback: {
      overallScore: Number,
      starBreakdown: {
        situation: Number,
        task: Number,
        action: Number,
        result: Number,
      },
      strengths: [String],
      improvements: [String],
      technicalDepth: Number,
      exampleBetterAnswer: String,
    },
  },
  { timestamps: true }
);

export const PracticeSession = mongoose.models.PracticeSession || mongoose.model('PracticeSession', practiceSessionSchema);
