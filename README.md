# Interview Prep Platform

A full-stack AI-powered interview practice platform built with Next.js, Express, MongoDB, and OpenAI.

## 🎯 Overview

InterviewPrep.ai is a comprehensive platform where users can:

- **Learn** proven interview frameworks (STAR method, CAP method)
- **Practice** answering real interview questions
- **Get Feedback** from AI coaches specialized in tech interviews
- **Track Progress** with detailed dashboards and analytics
- **Simulate** full mock interviews

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                   │
│  - Landing page, Auth pages, Question browsing             │
│  - Practice interface with voice/text recording            │
│  - Mock interview simulator, Dashboard                      │
│  - Learning resources with frameworks                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────┐
│                   Backend (Express.js)                      │
│  - RESTful API routes with JWT authentication              │
│  - AI feedback generation using OpenAI gpt-4o-mini        │
│  - Question bank management                                │
│  - Practice session tracking                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────────────┐
│              Database (MongoDB)                             │
│  - Users, Questions, Practice Sessions                      │
│  - Feedback records with STAR breakdowns                    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
interview/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, error handling
│   │   ├── lib/            # Utilities (JWT, AI, DB)
│   │   └── scripts/        # Seed script
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/                # Next.js application
    ├── app/
    │   ├── page.tsx        # Landing page
    │   ├── login/
    │   ├── register/
    │   ├── questions/
    │   ├── practice/
    │   ├── mock-interview/
    │   ├── dashboard/
    │   └── learn/
    ├── components/         # React components
    ├── contexts/          # Auth context
    ├── lib/               # API client, utilities
    ├── types/             # TypeScript types
    ├── package.json
    ├── tailwind.config.ts
    └── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install

# Create .env.local
cp .env.example .env.local

# Update with your values:
# MONGODB_URI=mongodb+srv://...
# OPENAI_API_KEY=sk-...
# JWT_SECRET=your-secret

# Run migrations and seed
npm run seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local
cp .env.local.example .env.local

# Update API URL (should match backend)
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🔑 Key Features

### 1. Authentication
- Email/password registration and login
- JWT token-based authentication
- Secure password hashing with bcrypt
- User profile management

### 2. Question Bank
- 50+ curated interview questions
- Categories: Behavioral, Situational, CV-based
- Difficulty levels: Easy, Medium, Hard
- Tags for filtering and search
- Sample answers included

### 3. Practice Questions
- Type answer or record voice
- Real-time feedback from AI
- STAR method breakdown
- Strengths and improvements
- Technical depth assessment
- Example better answers

### 4. AI Feedback System
- GPT-4o-mini model for fast, accurate feedback
- Structured JSON responses
- STAR method evaluation
- Customized coaching tips
- Technical depth analysis

### 5. Mock Interviews
- Multi-question interview simulation
- Configurable category and difficulty
- Sequential Q&A format
- Feedback after each question
- Complete session tracking

### 6. Dashboard
- Practice history tracking
- Average score calculation
- Performance charts
- Category breakdown
- Detailed session analysis

### 7. Learning Resources
- STAR method guide
- CAP method guide
- Interview tips
- Best practices
- Example stories

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Questions
- `GET /api/questions` - Get all questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (admin)

### Practice
- `POST /api/practice` - Save practice session with AI feedback
- `GET /api/practice/history` - Get user's practice history
- `GET /api/practice/:id` - Get single session

## 📊 Database Schema

### User
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Question
```javascript
{
  _id: ObjectId,
  category: String ('behavioral' | 'situational' | 'cv'),
  subCategory: String,
  text: String,
  sampleAnswer: String,
  difficulty: String ('easy' | 'medium' | 'hard'),
  tags: [String],
  createdAt: Date
}
```

### PracticeSession
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  questionId: ObjectId (ref: Question),
  userAnswer: String,
  audioUrl: String,
  feedback: {
    overallScore: Number (1-5),
    starBreakdown: {
      situation: Number,
      task: Number,
      action: Number,
      result: Number
    },
    strengths: [String],
    improvements: [String],
    technicalDepth: Number,
    exampleBetterAnswer: String
  },
  createdAt: Date
}
```

## 🎬 Workflow

1. **User Signup** → Create account with email/password
2. **Explore Learn** → Read STAR/CAP method guides
3. **Browse Questions** → Filter by category/difficulty
4. **Practice Answer** → Type or record voice answer
5. **Get Feedback** → Receive AI coaching
6. **Track Progress** → View dashboard and history
7. **Mock Interview** → Simulate full interview

## 🛠️ Development

### Available Scripts

**Backend:**
```bash
npm run dev      # Start development server with ts-node
npm run build    # Compile TypeScript
npm start        # Run compiled server
npm run seed     # Seed database with questions
```

**Frontend:**
```bash
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Environment Variables

**Backend (.env.local):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview_prep
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=sk-your-openai-api-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Backend (Railway/Heroku/Render)
1. Push code to GitHub
2. Connect repository to deployment platform
3. Set environment variables
4. Deploy

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy (automatic on push)

## 📝 API Response Examples

### Get Feedback
**Request:**
```json
POST /api/practice
{
  "questionId": "507f1f77bcf86cd799439011",
  "userAnswer": "I faced a tight deadline with incomplete requirements..."
}
```

**Response:**
```json
{
  "_id": "...",
  "feedback": {
    "overallScore": 4,
    "starBreakdown": {
      "situation": 4,
      "task": 4,
      "action": 4,
      "result": 5
    },
    "strengths": [
      "Clear situation context",
      "Strong action-oriented approach",
      "Measurable results"
    ],
    "improvements": [
      "Could mention communication with stakeholders",
      "More specific metrics would strengthen answer"
    ],
    "technicalDepth": 3,
    "exampleBetterAnswer": "..."
  }
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Make your changes
3. Write clear commit messages
4. Push and create a Pull Request

## 📄 License

ISC

## 🆘 Support

For issues and questions:
1. Check existing documentation
2. Review API error responses
3. Check browser console for frontend errors
4. Review server logs for backend errors

## 🎓 Learning Resources

- [STAR Method Guide](frontend/app/learn/star-method)
- [CAP Method Guide](frontend/app/learn/cap-method)
- [Next.js Docs](https://nextjs.org/docs)
- [Express Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [OpenAI API](https://platform.openai.com/docs)

---

Built with ❤️ for aspiring tech professionals
