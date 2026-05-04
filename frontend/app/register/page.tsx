'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(email, password, name);
      router.push('/questions');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-center'>Create Your InterviewPrep.ai Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='John Doe'
              />
            </div>

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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <p className='mt-4 text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link href='/login' className='text-blue-600 hover:text-blue-700'>
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
