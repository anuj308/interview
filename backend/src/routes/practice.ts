import { Router, Response } from 'express';
import { PracticeSession } from '../models/PracticeSession.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { generateFeedback } from '../lib/ai.js';
import { Question } from '../models/Question.js';

const router = Router();

// Save practice session with AI feedback
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, userAnswer, audioUrl } = req.body;
    const userId = req.userId;

    if (!questionId || !userAnswer) {
      return res.status(400).json({ error: 'Question ID and answer are required' });
    }

    // Fetch question
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Generate AI feedback
    let feedback;
    try {
      feedback = await generateFeedback(question.text, userAnswer);
    } catch (error) {
      console.error('AI feedback error:', error);
      // Continue without feedback if API fails
      feedback = null;
    }

    // Save session
    const session = await PracticeSession.create({
      userId,
      questionId,
      userAnswer,
      audioUrl,
      feedback,
    });

    // Populate question details
    await session.populate('questionId');

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating practice session:', error);
    res.status(500).json({ error: 'Failed to save practice session' });
  }
});

// Get user's practice history
router.get('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = parseInt(req.query.skip as string) || 0;

    const sessions = await PracticeSession.find({ userId })
      .populate('questionId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await PracticeSession.countDocuments({ userId });

    res.json({
      sessions,
      total,
      limit,
      skip,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get single session
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const session = await PracticeSession.findById(req.params.id).populate('questionId');

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

export default router;
