# Development Workflow & Architecture Guide

This document explains the architecture, key concepts, and development workflows for InterviewPrep.ai.

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│         User Browser                 │
├─────────────────────────────────────┤
│   Next.js Frontend (Port 3000)       │
│  - Pages, Components, Styling        │
│  - Auth Context, API Client          │
│  - React Hooks & State Management    │
└──────────────┬──────────────────────┘
               │ HTTP/JSON
               │ (Axios)
┌──────────────▼──────────────────────┐
│    Express Backend (Port 5000)       │
│  - REST API Routes                   │
│  - JWT Auth Middleware               │
│  - OpenAI Integration                │
│  - MongoDB Operations                │
└──────────────┬──────────────────────┘
               │ Mongoose ODM
┌──────────────▼──────────────────────┐
│      MongoDB Database                │
│  - Users Collection                  │
│  - Questions Collection              │
│  - PracticeSession Collection        │
└─────────────────────────────────────┘
```

## 📝 Development Flow

### User Registration & Login

1. **Frontend** → User fills form and submits
2. **API** (`POST /api/auth/register`) → Validates, hashes password, creates user
3. **Database** → Stores user document
4. **Backend** → Returns JWT token
5. **Frontend** → Stores token in localStorage, updates auth context
6. **Navigation** → Redirects to `/questions`

### Answering a Practice Question

1. **Frontend** → User selects question from `/questions`
2. **Frontend** → Shows question on `/practice/[id]` page
3. **User Action** → Types or records answer
4. **Frontend** → Submits to `POST /api/practice`
5. **Backend** → 
   - Saves session to database
   - Calls OpenAI API with question + answer
   - Parses JSON response with STAR breakdown
   - Stores feedback in database
6. **API Response** → Returns session with feedback
7. **Frontend** → Displays FeedbackCard component with:
   - STAR breakdown with scores
   - Strengths & improvements
   - Better example answer

### Mock Interview Flow

1. **Frontend** → User configures (category, difficulty, count)
2. **Frontend** → Fetches questions from `/api/questions`
3. **Backend** → Returns filtered questions
4. **Frontend** → Shows first question
5. **User** → Answers question
6. **Frontend** → Saves session, shows next question
7. **Repeat** → Steps 5-6 for each question
8. **Complete** → Shows summary and links to dashboard

## 🔑 Key Components & Concepts

### Frontend Architecture

**Pages:**
- `page.tsx` - Landing page with features/CTA
- `login/page.tsx` - Authentication
- `register/page.tsx` - Registration
- `questions/page.tsx` - Question browser
- `practice/[questionId]/page.tsx` - Single question practice
- `mock-interview/page.tsx` - Multi-question interview
- `dashboard/page.tsx` - User progress tracking
- `learn/page.tsx` - Educational content
- `learn/[slug]/page.tsx` - Individual framework guide

**Components:**
- `Navbar.tsx` - Navigation across app
- `QuestionCard.tsx` - Displays question preview
- `FeedbackCard.tsx` - Shows AI feedback
- `AnswerRecorder.tsx` - Type/record interface
- UI components in `components/ui/` - Reusable elements

**State Management:**
- `AuthContext` - Manages user auth state
- localStorage - Stores JWT token
- Component state (React hooks) - Local page state

**API Client:**
- `lib/api.ts` - Axios wrapper with token injection
- Automatic token attachment to all requests
- Error handling and response parsing

### Backend Architecture

**Models:**
- `User.ts` - User schema with auth fields
- `Question.ts` - Interview questions
- `PracticeSession.ts` - User sessions with feedback

**Routes:**
- `routes/auth.ts` - Register, login, get user
- `routes/questions.ts` - Get/filter questions
- `routes/practice.ts` - Save sessions, get history

**Middleware:**
- `middleware/auth.ts` - JWT verification
- Built-in Express CORS and JSON parsing

**Utilities:**
- `lib/db.ts` - MongoDB connection
- `lib/jwt.ts` - Token generation/verification
- `lib/ai.ts` - OpenAI API wrapper

## 🔌 API Design Patterns

### Authentication Pattern

All protected routes require Authorization header:

```typescript
// Request
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// Middleware extracts userId
req.userId = decoded.userId
```

### Request/Response Pattern

**Successful Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "category": "behavioral",
  "text": "Tell me about a time..."
}
```

**Error Response:**
```json
{
  "error": "Invalid credentials"
}
```

### AI Feedback Pattern

**System Prompt** → Instructs AI to respond with strict JSON
**User Message** → Question + Answer
**Response Format** → Structured JSON with schema

```typescript
{
  "overallScore": 4,
  "starBreakdown": {
    "situation": 4,
    "task": 4,
    "action": 4,
    "result": 5
  },
  "strengths": [...],
  "improvements": [...],
  "technicalDepth": 3,
  "exampleBetterAnswer": "..."
}
```

## 🔄 Data Flow Examples

### Example 1: User Takes Practice

```
Client                    Server                    Database
  │                          │                           │
  ├─ GET /questions ──────────>                          │
  │                        <─ [questions] ────            │
  │                                             │         │
  │                                             ├─────────>
  │                                             │  find   │
  │                                             <─────────┤
  │                          │                           │
  ├─ POST /practice ────────>│                           │
  │   {q_id, answer}        │ Calls OpenAI             │
  │                          │ (gpt-4o-mini)           │
  │                          │ Gets feedback           │
  │                          ├─────────────────────────>│
  │                          │  save session           │
  │                          │  with feedback          │
  │                          <─────────────────────────┤
  │                        <─ {session+feedback} ────   │
  │ Display FeedbackCard    │                           │
```

### Example 2: Mock Interview

```
Start → Config → Fetch Questions → Show Q1
                                      │
                                      └─→ User Answers
                                         │
                                         └─→ Save Session
                                            │
                                            └─→ Show Q2
                                               │
                                               └─→ ... (repeat)
                                                  │
                                                  └─→ End
                                                     │
                                                     └─→ Show Summary
```

## 🛠️ Development Tips

### Adding a New Question Category

1. Update Question model `category` enum
2. Add to API filter logic
3. Update frontend filter UI
4. Add seed questions

### Creating New Learning Content

1. Create `app/learn/[slug]/page.tsx`
2. Add article data to `articles` object
3. Link from `app/learn/page.tsx`
4. Test navigation

### Modifying AI Feedback

1. Edit `backend/src/lib/ai.ts` system prompt
2. Update Feedback type in `frontend/src/types/index.ts`
3. Update FeedbackCard component
4. Test with sample answer

### Adding New API Endpoint

1. Create route file in `backend/src/routes/`
2. Add route to `backend/src/index.ts`
3. Create API client function in `frontend/src/lib/api.ts`
4. Use in component with error handling

## 🧪 Testing Workflows

### Manual Testing Checklist

- [ ] Register new account
- [ ] Login with credentials
- [ ] Browse questions with filters
- [ ] Answer text question
- [ ] Receive AI feedback
- [ ] Answer voice question
- [ ] Record and submit
- [ ] Start mock interview
- [ ] Complete mock interview
- [ ] Check dashboard history
- [ ] Logout and login again

### Common Test Scenarios

**Edge Cases:**
- Empty answer submission
- Very short answer (< 10 chars)
- Very long answer (> 1000 chars)
- Special characters in text
- Rapid consecutive submissions

**Error Scenarios:**
- Network timeout
- OpenAI API failure
- Database connection loss
- Invalid JWT token
- Missing required fields

## 📊 Performance Considerations

**Frontend:**
- Code splitting with Next.js App Router
- Lazy loading for learning content
- Efficient state management (avoid prop drilling)
- Image optimization for avatars

**Backend:**
- Connection pooling for MongoDB
- JWT caching (optional)
- Rate limiting on AI endpoint
- Index queries on userId, questionId

**Database:**
- Create indexes: `userId`, `questionId`, `category`
- Archive old sessions monthly
- Paginate large responses

## 🔐 Security Best Practices

**Frontend:**
- Never expose API keys in client code
- Validate all user inputs
- Sanitize displayed content
- Use httpOnly cookies (future)

**Backend:**
- Rate limit API endpoints
- Validate all inputs server-side
- Hash passwords with bcrypt
- Use strong JWT secrets
- Expire tokens regularly
- Log security events

**Database:**
- Require authentication
- Use TLS for connections
- Regular backups
- Monitor access logs

## 🚀 Deployment Checklist

- [ ] Build passes without warnings
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Tests passing
- [ ] No console errors
- [ ] API endpoints responding
- [ ] Auth token flow working
- [ ] Error handling in place
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Logging in place
- [ ] Monitoring alerts set

## 📚 Additional Resources

**Architecture Decisions:**
- Why MongoDB? Flexible schema for varied question types
- Why Express? Lightweight, mature, easy to extend
- Why Next.js? SSR, API routes, built-in optimizations
- Why OpenAI? State-of-the-art NLP for interview feedback

**Future Enhancements:**
- WebSocket for real-time mock interviews
- User analytics dashboard
- Team/company accounts
- Integration with HR systems
- Mobile app with React Native
- Video interview recording
- Peer review system
- Subscription tiers

---

This document evolves with the project. Update it as architecture changes!
