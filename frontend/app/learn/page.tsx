'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const learnTopics = [
  {
    slug: 'star-method',
    title: 'STAR Method',
    description: 'Learn the Situation, Task, Action, Result framework for behavioral questions.',
    icon: '⭐',
  },
  {
    slug: 'cap-method',
    title: 'CAP Method',
    description: 'Master the Challenge, Action, Problem-solving approach for CV and situational questions.',
    icon: '🎯',
  },
  {
    slug: 'behavioral-tips',
    title: 'Behavioral Interview Tips',
    description: 'Best practices and common pitfalls to avoid when answering behavioral questions.',
    icon: '💡',
  },
  {
    slug: 'technical-communication',
    title: 'Technical Communication',
    description: 'How to explain technical concepts clearly and handle technical questions with confidence.',
    icon: '🔧',
  },
];

export default function LearnPage() {
  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      {/* Header */}
      <div className='mb-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>Learn & Master Interview Frameworks</h1>
        <p className='text-lg text-gray-600'>
          Study proven frameworks and techniques used by successful tech interviewees
        </p>
      </div>

      {/* Topics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {learnTopics.map((topic) => (
          <Link key={topic.slug} href={`/learn/${topic.slug}`}>
            <Card className='h-full cursor-pointer hover:shadow-lg transition-shadow'>
              <CardContent className='p-6'>
                <div className='text-4xl mb-4'>{topic.icon}</div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>{topic.title}</h3>
                <p className='text-gray-600'>{topic.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Additional Resources */}
      <div className='mt-12 bg-blue-50 p-8 rounded-lg'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Quick Tips for Success</h2>
        <ul className='space-y-3 text-gray-700'>
          <li className='flex items-start gap-3'>
            <span className='text-blue-600 font-bold'>•</span>
            <span>Prepare 5-7 stories in advance that demonstrate your skills</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-blue-600 font-bold'>•</span>
            <span>Use the STAR method consistently across all behavioral questions</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-blue-600 font-bold'>•</span>
            <span>Practice out loud—not just in your head—to build confidence</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-blue-600 font-bold'>•</span>
            <span>Focus on the impact and results, not just the process</span>
          </li>
          <li className='flex items-start gap-3'>
            <span className='text-blue-600 font-bold'>•</span>
            <span>Tailor your examples to the job description and company</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
