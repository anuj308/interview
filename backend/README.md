# Interview Prep Backend

A Node.js/Express backend for the Interview Practice platform with AI-powered feedback.

## Features

- User authentication with JWT
- MongoDB for data persistence
- Questions bank with filtering
- Practice session tracking
- AI-powered feedback using Google Gemini or OpenAI
- RESTful API

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Google Gemini API key or OpenAI API key

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
cp .env.example .env.local
```

3. Update environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_key
GOOGLE_MODEL=gemini-1.5-flash
OPENAI_API_KEY=your_openai_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Running the Server

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

### Seeding the Database

```bash
npm run seed
```

This will populate the database with 15+ interview questions across behavioral, situational, and CV-based categories.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Questions

- `GET /api/questions` - Get all questions (with optional filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create a new question (admin)

### Practice

- `POST /api/practice` - Save practice session with AI feedback (requires auth)
- `GET /api/practice/history` - Get user's practice history (requires auth)
- `GET /api/practice/:id` - Get single session (requires auth)

## Database Schema

### User

- `_id`: ObjectId
- `email`: String (unique)
- `password`: String (hashed)
- `name`: String
- `createdAt`: Date
- `updatedAt`: Date

### Question

- `_id`: ObjectId
- `category`: String (behavioral, situational, cv)
- `subCategory`: String
- `text`: String
- `sampleAnswer`: String
- `difficulty`: String (easy, medium, hard)
- `tags`: String[]
- `createdAt`: Date
- `updatedAt`: Date

### PracticeSession

- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `questionId`: ObjectId (ref: Question)
- `userAnswer`: String
- `audioUrl`: String
- `feedback`: Object
  - `overallScore`: Number (1-5)
  - `starBreakdown`: Object
  - `strengths`: String[]
  - `improvements`: String[]
  - `technicalDepth`: Number
  - `exampleBetterAnswer`: String
- `createdAt`: Date
- `updatedAt`: Date
