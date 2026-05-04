'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className='border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <div className='h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold'>
              I
            </div>
            <span className='text-lg font-semibold text-gray-900'>InterviewPrep.ai</span>
          </Link>

          {/* Navigation Links */}
          <div className='hidden md:flex items-center space-x-8'>
            {isAuthenticated && (
              <>
                <Link href='/learn' className='text-gray-600 hover:text-gray-900'>
                  Learn
                </Link>
                <Link href='/questions' className='text-gray-600 hover:text-gray-900'>
                  Questions
                </Link>
                <Link href='/mock-interview' className='text-gray-600 hover:text-gray-900'>
                  Mock Interview
                </Link>
                <Link href='/dashboard' className='text-gray-600 hover:text-gray-900'>
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className='flex items-center space-x-4'>
            {isAuthenticated && user ? (
              <>
                <span className='text-sm text-gray-600'>{user.email}</span>
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
