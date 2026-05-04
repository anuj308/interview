export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Question {
  _id: string;
  category: 'behavioral' | 'situational' | 'cv';
  subCategory?: string;
  text: string;
  sampleAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: string;
}

export interface Feedback {
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

export interface PracticeSession {
  _id: string;
  userId: string;
  questionId: Question;
  userAnswer: string;
  audioUrl?: string;
  feedback?: Feedback;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
