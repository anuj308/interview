import { describe, expect, it } from 'vitest';
import { User } from '../src/models/User.js';
import { Question } from '../src/models/Question.js';
import { PracticeSession } from '../src/models/PracticeSession.js';

describe('mongoose models', () => {
  it('defines the user schema fields', () => {
    expect(User.modelName).toBe('User');
    expect(User.schema.path('email').options.required).toBe(true);
    expect(User.schema.path('password').options.required).toBe(true);
    expect(User.schema.options.timestamps).toBe(true);
  });

  it('defines the question schema defaults and enums', () => {
    expect(Question.modelName).toBe('Question');
    expect(Question.schema.path('category').options.enum).toEqual(['behavioral', 'situational', 'cv']);
    expect(Question.schema.path('difficulty').options.default).toBe('medium');
    expect(Question.schema.path('tags')).toBeDefined();
  });

  it('defines practice session refs and feedback shape', () => {
    expect(PracticeSession.modelName).toBe('PracticeSession');
    expect(PracticeSession.schema.path('userId').options.ref).toBe('User');
    expect(PracticeSession.schema.path('questionId').options.ref).toBe('Question');
    expect(PracticeSession.schema.path('feedback.overallScore')).toBeDefined();
  });
});