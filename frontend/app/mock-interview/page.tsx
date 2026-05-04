'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import { Question } from '@/types';
import { FeedbackCard } from '@/components/FeedbackCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const AnswerRecorder = dynamic(
  () => import('@/components/AnswerRecorder').then((mod) => mod.AnswerRecorder),
  { ssr: false }
);

type InterviewMode = 'setup' | 'interview' | 'complete';

interface InterviewQuestion {
  question: Question;
  answer?: string;
}

export default function MockInterviewPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<InterviewMode>('setup');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(3);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const data = await api.getQuestions(category || undefined, difficulty || undefined);
      const shuffled = data.sort(() => Math.random() - 0.5).slice(0, questionCount);
      setQuestions(shuffled.map((q) => ({ question: q })));
      setCurrentIndex(0);
      setMode('interview');
    } catch (error) {
      console.error('Failed to start interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = async (answer: string, audioUrl?: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].answer = answer;
    setQuestions(updatedQuestions);

    // Save the session
    try {
      await api.savePracticeSession(
        updatedQuestions[currentIndex].question._id,
        answer,
        audioUrl
      );
    } catch (error) {
      console.error('Failed to save session:', error);
    }

    // Move to next or complete
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMode('complete');
    }
  };

  if (authLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      {mode === 'setup' && (
        <>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Mock Interview</h1>
            <p className='text-gray-600'>Practice a full interview with AI questions</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Configure Your Interview</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Question Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                >
                  <option value=''>Mixed Questions</option>
                  <option value='behavioral'>Behavioral</option>
                  <option value='situational'>Situational</option>
                  <option value='cv'>CV-Based</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                >
                  <option value=''>All Levels</option>
                  <option value='easy'>Easy</option>
                  <option value='medium'>Medium</option>
                  <option value='hard'>Hard</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Number of Questions
                </label>
                <div className='flex items-center gap-4'>
                  <input
                    type='range'
                    min='1'
                    max='10'
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className='flex-1'
                  />
                  <span className='text-lg font-semibold text-blue-600 min-w-12'>{questionCount}</span>
                </div>
              </div>

              <Button
                onClick={startInterview}
                disabled={isLoading}
                size='lg'
                className='w-full'
              >
                {isLoading ? 'Starting...' : 'Start Interview'}
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {mode === 'interview' && questions.length > 0 && (
        <>
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h1 className='text-2xl font-bold text-gray-900'>
                Question {currentIndex + 1} of {questions.length}
              </h1>
              <Badge variant='blue'>{questions[currentIndex].question.category}</Badge>
            </div>
            <Progress value={currentIndex + 1} max={questions.length} />
          </div>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>{questions[currentIndex].question.text}</CardTitle>
            </CardHeader>
            <CardContent>
              {questions[currentIndex].question.sampleAnswer && (
                <div className='bg-blue-50 p-4 rounded-lg'>
                  <p className='text-sm text-gray-700'>{questions[currentIndex].question.sampleAnswer}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <AnswerRecorder onSubmit={handleAnswerSubmit} />
        </>
      )}

      {mode === 'complete' && (
        <>
          <div className='mb-8 text-center'>
            <div className='text-5xl mb-4'>🎉</div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Interview Complete!</h1>
            <p className='text-gray-600'>You've answered all {questions.length} questions.</p>
          </div>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {questions.map((q, idx) => (
                  <div key={idx} className='flex items-start gap-2 pb-3 border-b border-gray-200 last:border-0'>
                    <span className='font-semibold text-gray-700 min-w-10'>Q{idx + 1}:</span>
                    <span className='text-gray-600 flex-1'>{q.question.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className='flex gap-4'>
            <Button onClick={() => router.push('/dashboard')} className='flex-1'>
              View Results
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                setMode('setup');
                setQuestions([]);
                setCurrentIndex(0);
              }}
              className='flex-1'
            >
              New Interview
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
