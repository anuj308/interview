import mongoose from 'mongoose';
import 'dotenv/config';
import { Question } from '../models/Question.js';
import { connectDB, disconnectDB } from '../lib/db.js';
import { questionSeedData } from '../data/questions.js';

async function seed() {
  try {
    console.log('Starting database seed...');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert questions
    const result = await Question.insertMany(questionSeedData);
    console.log(`Successfully seeded ${result.length} questions`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
