'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { MoonStar, SunMedium } from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className='border-b border-gray-200 bg-white/90 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-slate-950/90'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold'>
              I
            </div>
            <span className='text-lg font-semibold text-gray-900 dark:text-gray-100'>InterviewPrep.ai</span>
          </Link>

          {/* Navigation Links */}
          <div className='hidden md:flex items-center space-x-8'>
            {isAuthenticated && (
              <>
                <Link href='/learn' className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'>
                  Learn
                </Link>
                <Link href='/questions' className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'>
                  Questions
                </Link>
                <Link href='/mock-interview' className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'>
                  Mock Interview
                </Link>
                <Link href='/dashboard' className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'>
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className='flex items-center space-x-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <SunMedium className='h-4 w-4' /> : <MoonStar className='h-4 w-4' />}
            </Button>
            {isAuthenticated && user ? (
              <>
                <span className='text-sm text-gray-600 dark:text-gray-300'>{user.email}</span>
                <Button variant='outline' size='sm' onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href='/login'>
                  <Button variant='outline' size='sm'>
                    Login
                  </Button>
                </Link>
                <Link href='/register'>
                  <Button size='sm'>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
