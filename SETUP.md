# InterviewPrep.ai - Complete Setup Guide

This guide walks you through setting up the entire InterviewPrep.ai platform locally and deploying to production.

## 📋 Prerequisites

Before starting, make sure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **MongoDB** - Local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **OpenAI API Key** - [Sign up](https://platform.openai.com/signup) (requires payment info)
- **Git** - For version control
- **npm** or **yarn** - Package manager (comes with Node.js)

## 🔑 Getting API Keys

### 1. MongoDB Atlas Setup (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project
4. Create a cluster (free tier available)
5. Create a database user with username/password
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/interview_prep?retryWrites=true&w=majority`

**Or use local MongoDB:**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Linux
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 2. OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/account/api-keys)
4. Create a new secret key
5. Copy it (you'll only see it once)
6. Add $5-20 to your account for API usage

## 🚀 Local Development Setup

### Step 1: Clone and Setup Repository

```bash
# Clone the repository
git clone <your-repo-url>
cd interview

# Create a .env.local in backend
cd backend
cp .env.example .env.local
```

### Step 2: Configure Backend Environment

Edit `backend/.env.local`:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interview_prep?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 4: Seed the Database

```bash
# This populates the database with 15+ interview questions
npm run seed
```

Expected output:
```
MongoDB connected successfully
Starting database seed...
Cleared existing questions
Successfully seeded 15 questions
```

### Step 5: Start Backend Server

```bash
npm run dev
```

Expected output:
```
Server running on http://localhost:5000
```

### Step 6: Configure Frontend Environment

```bash
cd ../frontend
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 7: Install Frontend Dependencies

```bash
npm install
```

### Step 8: Start Frontend Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.2.4
- Local:        http://localhost:3000
```

## ✅ Verification Checklist

Open your browser and verify:

- [ ] Landing page loads at http://localhost:3000
- [ ] Can register new account at http://localhost:3000/register
- [ ] Can login with created account at http://localhost:3000/login
- [ ] Can view questions at http://localhost:3000/questions
- [ ] Can navigate to practice page and see a question
- [ ] Can type or record an answer
- [ ] Receives AI feedback (might take 5-10 seconds)
- [ ] Can access dashboard at http://localhost:3000/dashboard

If you see errors, check:

1. **Backend not responding**: Is `npm run dev` running in backend folder?
2. **MongoDB connection error**: Check `MONGODB_URI` in `.env.local`
3. **OpenAI API error**: Check `OPENAI_API_KEY` is valid and has credits
4. **Feedback not loading**: Check browser console for errors

## 📦 Project Structure Recap

```
interview/
├── backend/                 # Express API server
│   ├── src/
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & errors
│   │   ├── lib/            # Utilities
│   │   └── scripts/        # Seed data
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local          # ← Create this
│
└── frontend/                # Next.js app
    ├── app/                # Pages
    ├── components/         # React components
    ├── contexts/          # State management
    ├── lib/               # API client
    ├── types/             # TypeScript types
    ├── package.json
    ├── tailwind.config.ts
    └── .env.local         # ← Create this
```

## 🌍 Production Deployment

### Backend Deployment (Railway)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - Connect your repository
   - Railway will auto-detect Node.js
   - Add environment variables:
     ```
     MONGODB_URI=<your-atlas-url>
     JWT_SECRET=<generate-random-secret>
     OPENAI_API_KEY=<your-key>
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=<your-vercel-domain>
     ```
   - Deploy

3. **Get Your Backend URL**
   - Railway provides a URL like `https://interview-prod-xyz.railway.app`
   - This is your production backend URL

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://interview-prod-xyz.railway.app/api
     ```
   - Click "Deploy"

2. **Get Your Frontend URL**
   - Vercel provides a URL like `https://interview-prep.vercel.app`
   - This is your production frontend URL

3. **Update Backend CORS**
   - Go back to Railway project
   - Update `FRONTEND_URL` to your Vercel domain
   - Redeploy

## 🔐 Security Checklist

For production, ensure:

- [ ] `JWT_SECRET` is a strong random string (not the default)
- [ ] `OPENAI_API_KEY` is not hardcoded or exposed
- [ ] MongoDB requires authentication
- [ ] CORS is restricted to your frontend domain
- [ ] Environment variables use a secrets manager
- [ ] Use HTTPS everywhere (automatic on Railway/Vercel)
- [ ] Enable rate limiting on API endpoints
- [ ] Validate all user inputs

## 📊 Monitoring & Debugging

### Backend Logs

View logs on Railway dashboard or locally:

```bash
cd backend
npm run dev 2>&1 | tee server.log
```

### Frontend Console

Check browser DevTools (F12) → Console for errors

### API Testing

Test endpoints with curl or Postman:

```bash
# Get questions
curl http://localhost:5000/api/questions

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Database Inspection

Use MongoDB Compass to browse data:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect with your `MONGODB_URI`
3. Browse `interview_prep` database
4. View documents in collections

## 🆘 Troubleshooting

### "Cannot find module 'express'"

```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection timeout"

- Check internet connection
- Verify MongoDB Atlas is running
- Whitelist your IP in MongoDB Atlas
- Check connection string format

### "OpenAI API rate limit exceeded"

- Wait 1 minute before retrying
- Check your API balance
- Consider using `gpt-3.5-turbo` instead

### "Frontend can't connect to backend"

- Verify backend is running: `http://localhost:5000/health`
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Check browser Network tab for failed requests
- Verify CORS settings in backend

### "Auth token invalid"

- Clear localStorage: Open DevTools → Application → Storage → clear all
- Log in again

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)

## 🎯 Next Steps

After setup, you can:

1. **Customize Learning Content** - Edit `app/learn/[slug]/page.tsx`
2. **Add More Questions** - Edit `backend/src/scripts/seed.ts` and run `npm run seed`
3. **Improve AI Feedback** - Modify system prompt in `backend/src/lib/ai.ts`
4. **Add Authentication Methods** - Implement OAuth/GitHub login
5. **Enhance Voice Recording** - Add audio upload to cloud storage
6. **Add Analytics** - Track user behavior and engagement
7. **Implement Payment** - Add Stripe for premium features

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review error messages in console/logs
3. Check API responses in Network tab
4. Search GitHub issues
5. Ask in discussions

---

Happy interviewing! 🚀
