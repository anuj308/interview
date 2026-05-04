'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='min-h-screen bg-linear-to-br from-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <div className='mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
            Master Your Next.js &
            <br />
            <span className='text-blue-600'>Express Interviews</span>
          </h1>
          <p className='mt-6 text-lg text-gray-600 max-w-2xl mx-auto'>
            Learn proven answer frameworks, practice with real questions, and get instant AI-powered
            feedback to land your dream tech job.
          </p>

          <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
            {isAuthenticated ? (
              <>
                <Link href='/questions'>
                  <Button size='lg'>Start Practicing</Button>
                </Link>
                <Link href='/mock-interview'>
                  <Button variant='outline' size='lg'>
                    Try Mock Interview
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href='/register'>
                  <Button size='lg'>Get Started Free</Button>
                </Link>
                <Link href='/login'>
                  <Button variant='outline' size='lg'>
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className='mt-20 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <div className='text-3xl mb-4'>📚</div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Learn Frameworks</h3>
            <p className='text-gray-600'>Master STAR method, CAP method, and proven answer frameworks.</p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <div className='text-3xl mb-4'>🎤</div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Practice Anywhere</h3>
            <p className='text-gray-600'>Answer questions by typing or recording voice — just like real interviews.</p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm'>
            <div className='text-3xl mb-4'>🤖</div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>AI Feedback</h3>
            <p className='text-gray-600'>Get instant, personalized feedback to improve your answers.</p>
          </div>
        </div>

        {/* Stats */}
        <div className='mt-20 bg-white rounded-lg shadow-sm p-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-3xl font-bold text-blue-600'>50+</div>
              <p className='text-gray-600 text-sm mt-2'>Curated Questions</p>
            </div>
            <div>
              <div className='text-3xl font-bold text-blue-600'>5</div>
              <p className='text-gray-600 text-sm mt-2'>Difficulty Levels</p>
            </div>
            <div>
              <div className='text-3xl font-bold text-blue-600'>10k+</div>
              <p className='text-gray-600 text-sm mt-2'>Users Practicing</p>
            </div>
            <div>
              <div className='text-3xl font-bold text-blue-600'>4.9★</div>
              <p className='text-gray-600 text-sm mt-2'>Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
