import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './lib/db.js';
import { errorHandler, authMiddleware } from './middleware/auth.js';
import { Question } from './models/Question.js';
import { questionSeedData } from './data/questions.js';

import authRoutes from './routes/auth.js';
import questionsRoutes from './routes/questions.js';
import practiceRoutes from './routes/practice.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Connect to database
await connectDB();

if ((await Question.countDocuments()) === 0) {
  await Question.insertMany(questionSeedData);
  console.log(`Seeded ${questionSeedData.length} questions`);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/practice', practiceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
