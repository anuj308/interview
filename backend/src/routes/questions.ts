import { Router, Request, Response } from 'express';
import { Question } from '../models/Question.js';

const router = Router();

// Get all questions with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, difficulty, search } = req.query;

    let filter: any = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) {
      filter.$or = [
        { text: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const questions = await Question.find(filter).limit(100);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get single question by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Create question (admin only - in real app, add role check)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { category, subCategory, text, sampleAnswer, difficulty, tags } = req.body;

    if (!category || !text) {
      return res.status(400).json({ error: 'Category and text are required' });
    }

    const question = await Question.create({
      category,
      subCategory,
      text,
      sampleAnswer,
      difficulty: difficulty || 'medium',
      tags: tags || [],
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

export default router;
