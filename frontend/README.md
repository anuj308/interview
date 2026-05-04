# Interview Prep Frontend

A Next.js 16 application for practicing interview questions with AI-powered feedback.

## Features

- User authentication and dashboard
- Browse curated interview questions
- Practice with type-to-answer or voice recording
- AI-powered feedback on answers
- Mock interview mode
- Educational resources on interview frameworks
- Performance tracking and history

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Radix UI components
- Recharts for visualizations
- Axios for API calls

## Setup

### Prerequisites

- Node.js 18+
- Backend server running (see backend README)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
cp .env.local.example .env.local
```

3. Update environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── login/page.tsx          # Login page
├── register/page.tsx       # Registration page
├── questions/page.tsx      # Question browser
├── practice/[id]/page.tsx  # Practice page
├── mock-interview/page.tsx # Mock interview mode
├── dashboard/page.tsx      # User dashboard
├── learn/page.tsx          # Learning resources
└── learn/[slug]/page.tsx   # Individual articles

components/
├── ui/                     # Reusable UI components
├── Navbar.tsx
├── QuestionCard.tsx
├── FeedbackCard.tsx
├── AnswerRecorder.tsx

contexts/
└── AuthContext.tsx        # Authentication context

lib/
├── api.ts                 # API client
└── utils.ts               # Utility functions

types/
└── index.ts               # TypeScript types
```

## Key Features

### Authentication

Users can register and login with email/password. Authentication is managed via JWT tokens stored in localStorage.

### Practice Questions

Browse and filter questions by category, difficulty, and search term. Each question includes a sample answer.

### AI Feedback

After answering a question, users receive AI-powered feedback including:

- Overall score (1-5)
- STAR method breakdown
- Strengths
- Areas for improvement
- Technical depth assessment
- Example better answer

### Mock Interview

Practice a full interview with multiple questions sequentially. Users can configure:

- Question category
- Difficulty level
- Number of questions

### Dashboard

View practice history with:

- Total practice count
- Average score
- Performance chart
- Category breakdown
- Detailed practice history table

## API Integration

The frontend connects to the backend API at `/api/*` endpoints:

- `/api/auth/*` - Authentication
- `/api/questions` - Question management
- `/api/practice` - Practice sessions

See [backend README](../backend/README.md) for detailed API documentation.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=<your-backend-url>/api`
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Node.js 18+.

## Development

### Code Style

- Use TypeScript for all files
- Follow React functional component patterns
- Use 'use client' for client components
- Tailwind CSS for styling

### Components

All UI components are built with:

- Radix UI primitives
- Custom Tailwind styling
- Consistent design system

## Troubleshooting

### API Connection Issues

- Ensure backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS settings in backend

### Authentication Issues

- Clear localStorage and try logging in again
- Check backend JWT configuration
- Verify environment variables

## License

ISC
