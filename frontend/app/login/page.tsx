'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/questions');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Sign In to InterviewPrep.ai</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                required
              />
            </div>

            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className='mt-4 text-center text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link href='/register' className='text-blue-600 hover:text-blue-700'>
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
