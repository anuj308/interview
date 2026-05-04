import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  hash: vi.fn(),
  compare: vi.fn(),
  generateToken: vi.fn(),
  verifyToken: vi.fn(),
  userFindOne: vi.fn(),
  userCreate: vi.fn(),
  userFindById: vi.fn(),
  questionFind: vi.fn(),
  questionFindById: vi.fn(),
  questionCreate: vi.fn(),
  practiceCreate: vi.fn(),
  practiceFind: vi.fn(),
  practiceCountDocuments: vi.fn(),
  practiceFindById: vi.fn(),
  generateFeedback: vi.fn(),
}));

vi.mock('bcryptjs', () => ({
  default: { hash: mocks.hash, compare: mocks.compare },
  hash: mocks.hash,
  compare: mocks.compare,
}));

vi.mock('../src/lib/jwt.js', () => ({
  generateToken: mocks.generateToken,
  verifyToken: mocks.verifyToken,
}));

vi.mock('../src/models/User.js', () => ({
  User: {
    findOne: mocks.userFindOne,
    create: mocks.userCreate,
    findById: mocks.userFindById,
  },
}));

vi.mock('../src/models/Question.js', () => ({
  Question: {
    find: mocks.questionFind,
    findById: mocks.questionFindById,
    create: mocks.questionCreate,
  },
}));

vi.mock('../src/models/PracticeSession.js', () => ({
  PracticeSession: {
    create: mocks.practiceCreate,
    find: mocks.practiceFind,
    countDocuments: mocks.practiceCountDocuments,
    findById: mocks.practiceFindById,
  },
}));

vi.mock('../src/lib/ai.js', () => ({
  generateFeedback: mocks.generateFeedback,
}));

const authRoutes = (await import('../src/routes/auth.js')).default;
const questionsRoutes = (await import('../src/routes/questions.js')).default;
const practiceRoutes = (await import('../src/routes/practice.js')).default;

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/questions', questionsRoutes);
  app.use('/api/practice', practiceRoutes);
  return app;
}

describe('api routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    mocks.generateToken.mockReturnValue('signed-token');
    mocks.verifyToken.mockImplementation((token: string) =>
      token === 'valid-token' ? { userId: 'user-1' } : null
    );
    mocks.hash.mockResolvedValue('hashed-password');
    mocks.compare.mockResolvedValue(true);
  });

  describe('auth', () => {
    it('registers a new user', async () => {
      mocks.userFindOne.mockResolvedValue(null);
      mocks.userCreate.mockResolvedValue({
        _id: 'user-1',
        email: 'tester@example.com',
        name: 'Tester',
      });

      const response = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'tester@example.com', password: 'password', name: 'Tester' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        token: 'signed-token',
        user: {
          id: 'user-1',
          email: 'tester@example.com',
          name: 'Tester',
        },
      });
    });

    it('rejects duplicate registrations', async () => {
      mocks.userFindOne.mockResolvedValue({ email: 'tester@example.com' });

      const response = await request(createApp())
        .post('/api/auth/register')
        .send({ email: 'tester@example.com', password: 'password' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'User already exists' });
    });

    it('logs in a valid user', async () => {
      mocks.userFindOne.mockResolvedValue({
        _id: 'user-1',
        email: 'tester@example.com',
        name: 'Tester',
        password: 'hashed-password',
      });

      const response = await request(createApp())
        .post('/api/auth/login')
        .send({ email: 'tester@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('signed-token');
    });

    it('fetches the current user when authorized', async () => {
      mocks.userFindById.mockReturnValue({
        select: vi.fn().mockResolvedValue({
          _id: 'user-1',
          email: 'tester@example.com',
          name: 'Tester',
        }),
      });

      const response = await request(createApp())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('tester@example.com');
    });
  });

  describe('questions', () => {
    it('filters questions by category, difficulty, and search', async () => {
      const questionList = [{ _id: 'q-1', text: 'Tell me about teamwork' }];
      mocks.questionFind.mockReturnValue({
        limit: vi.fn().mockResolvedValue(questionList),
      });

      const response = await request(createApp())
        .get('/api/questions')
        .query({ category: 'behavioral', difficulty: 'medium', search: 'team' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(questionList);
      expect(mocks.questionFind).toHaveBeenCalledWith({
        category: 'behavioral',
        difficulty: 'medium',
        $or: [
          { text: { $regex: 'team', $options: 'i' } },
          { tags: { $regex: 'team', $options: 'i' } },
        ],
      });
    });

    it('returns a question by id', async () => {
      mocks.questionFindById.mockResolvedValue({ _id: 'q-1', text: 'Question' });

      const response = await request(createApp()).get('/api/questions/q-1');

      expect(response.status).toBe(200);
      expect(response.body._id).toBe('q-1');
    });

    it('creates a new question', async () => {
      mocks.questionCreate.mockResolvedValue({
        _id: 'q-1',
        category: 'behavioral',
        text: 'Question text',
        difficulty: 'medium',
        tags: [],
      });

      const response = await request(createApp())
        .post('/api/questions')
        .send({ category: 'behavioral', text: 'Question text' });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Question text');
    });
  });

  describe('practice', () => {
    it('saves a practice session with feedback', async () => {
      const session = {
        _id: 'session-1',
        userId: 'user-1',
        questionId: { _id: 'q-1', text: 'Tell me about a time' },
        userAnswer: 'I led a team.',
        feedback: {
          overallScore: 5,
          starBreakdown: { situation: 5, task: 5, action: 5, result: 5 },
          strengths: ['Strong answer'],
          improvements: ['None'],
          technicalDepth: 5,
          exampleBetterAnswer: 'Great answer',
        },
        populate: vi.fn().mockResolvedValue(undefined),
      };

      mocks.questionFindById.mockResolvedValue({ _id: 'q-1', text: 'Tell me about a time' });
      mocks.generateFeedback.mockResolvedValue(session.feedback);
      mocks.practiceCreate.mockResolvedValue(session);

      const response = await request(createApp())
        .post('/api/practice')
        .set('Authorization', 'Bearer valid-token')
        .send({ questionId: 'q-1', userAnswer: 'I led a team.' });

      expect(response.status).toBe(201);
      expect(mocks.generateFeedback).toHaveBeenCalledWith('Tell me about a time', 'I led a team.');
      expect(response.body._id).toBe('session-1');
    });

    it('returns practice history for the current user', async () => {
      const sessions = [{ _id: 'session-1', userId: 'user-1' }];
      const query = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockResolvedValue(sessions),
      };

      mocks.practiceFind.mockReturnValue(query);
      mocks.practiceCountDocuments.mockResolvedValue(1);

      const response = await request(createApp())
        .get('/api/practice/history')
        .set('Authorization', 'Bearer valid-token')
        .query({ limit: 10, skip: 0 });

      expect(response.status).toBe(200);
      expect(response.body.sessions).toEqual(sessions);
      expect(response.body.total).toBe(1);
    });

    it('blocks access to another user session', async () => {
      mocks.practiceFindById.mockReturnValue({
        populate: vi.fn().mockResolvedValue({ _id: 'session-1', userId: 'other-user' }),
      });

      const response = await request(createApp())
        .get('/api/practice/session-1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });
  });
});