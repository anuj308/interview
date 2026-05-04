'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import { Question } from '@/types';
import { QuestionCard } from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuestionsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (authLoading) return;

    fetchQuestions();
  }, [isAuthenticated, authLoading, router, category, difficulty]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getQuestions(category || undefined, difficulty || undefined, search || undefined);
      setQuestions(data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const categories = ['behavioral', 'situational', 'cv'];
  const difficulties = ['easy', 'medium', 'hard'];

  if (authLoading || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Practice Questions</h1>
        <p className='text-gray-600'>Browse and practice real interview questions</p>
      </div>

      {/* Filters */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='text-lg'>Filters</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Search */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Search</label>
              <Input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder='Search questions...'
              />
            </div>

            {/* Category */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
              >
                <option value=''>All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
              >
                <option value=''>All Levels</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={fetchQuestions}
              className='flex-1'
            >
              Search
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                setCategory('');
                setDifficulty('');
                setSearch('');
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <div className='col-span-full text-center py-12'>
            <p className='text-gray-600'>No questions found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
