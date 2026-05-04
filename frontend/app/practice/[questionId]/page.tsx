'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import { Question, PracticeSession, Feedback } from '@/types';
import { FeedbackCard } from '@/components/FeedbackCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AnswerRecorder = dynamic(
  () => import('@/components/AnswerRecorder').then((mod) => mod.AnswerRecorder),
  { ssr: false }
);

export default function PracticePage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [session, setSession] = useState<PracticeSession | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (authLoading) return;

    fetchQuestion();
  }, [isAuthenticated, authLoading, router, params]);

  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const data = await api.getQuestion(params.questionId as string);
      setQuestion(data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (answer: string, audioUrl?: string) => {
    if (!question) return;

    setIsSaving(true);
    try {
      const newSession = await api.savePracticeSession(question._id, answer, audioUrl);
      setSession(newSession);
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save your answer. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading question...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className='mx-auto max-w-7xl px-4 py-8'>
        <div className='text-center'>
          <p className='text-red-600'>Question not found.</p>
          <Button onClick={() => router.push('/questions')} className='mt-4'>
            Back to Questions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      {/* Question Card */}
      <Card className='mb-6'>
        <CardHeader>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <Badge variant='blue' className='capitalize'>
                  {question.category}
                </Badge>
                {question.subCategory && (
                  <span className='text-xs text-gray-500'>{question.subCategory}</span>
                )}
              </div>
              <CardTitle className='text-2xl'>{question.text}</CardTitle>
            </div>
            <Badge
              variant={
                question.difficulty === 'easy'
                  ? 'green'
                  : question.difficulty === 'medium'
                  ? 'yellow'
                  : 'red'
              }
              className='whitespace-nowrap capitalize'
            >
              {question.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h3 className='font-semibold text-gray-900 mb-2'>Tags</h3>
              <div className='flex flex-wrap gap-2'>
                {question.tags.map((tag) => (
                  <Badge key={tag} variant='default'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {question.sampleAnswer && (
              <div className='bg-blue-50 p-4 rounded-lg'>
                <h3 className='font-semibold text-gray-900 mb-2'>Sample Answer</h3>
                <p className='text-sm text-gray-700'>{question.sampleAnswer}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Answer Section or Feedback */}
      {!session ? (
        <AnswerRecorder onSubmit={handleSubmitAnswer} isLoading={isSaving} />
      ) : (
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Your Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-gray-700 whitespace-pre-wrap'>{session.userAnswer}</p>
            </CardContent>
          </Card>

          {session.feedback && <FeedbackCard feedback={session.feedback} />}

          <Button onClick={() => router.push('/questions')} variant='outline' className='w-full'>
            ← Back to Questions
          </Button>

          <Button onClick={() => setSession(null)} className='w-full'>
            Try Another Answer
          </Button>
        </div>
      )}
    </div>
  );
}
