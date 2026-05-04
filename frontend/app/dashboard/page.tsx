'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';
import { PracticeSession } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [sessions, setSessions] = useState<PracticeSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (authLoading) return;

    fetchHistory();
  }, [isAuthenticated, authLoading, router]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await api.getPracticeHistory(50);
      setSessions(data.sessions);

      // Calculate average score
      const scores = data.sessions
        .filter((s) => s.feedback?.overallScore)
        .map((s) => s.feedback!.overallScore);

      if (scores.length > 0) {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        setAverageScore(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = sessions
    .slice()
    .reverse()
    .slice(0, 10)
    .map((s, idx) => ({
      name: `Q${idx + 1}`,
      score: s.feedback?.overallScore || 0,
    }));

  const categoryStats = sessions.reduce(
    (acc, s) => {
      const cat = s.questionId.category;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (authLoading || isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-7xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Dashboard</h1>
        <p className='text-gray-600'>Track your interview practice progress</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='text-sm text-gray-600'>Total Practices</div>
            <div className='text-3xl font-bold text-gray-900 mt-2'>{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='text-sm text-gray-600'>Average Score</div>
            <div className='text-3xl font-bold text-blue-600 mt-2'>{averageScore}/5</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='text-sm text-gray-600'>Behavioral</div>
            <div className='text-3xl font-bold text-gray-900 mt-2'>{categoryStats['behavioral'] || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <div className='text-sm text-gray-600'>CV-Based</div>
            <div className='text-3xl font-bold text-gray-900 mt-2'>{categoryStats['cv'] || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type='monotone' dataKey='score' stroke='#2563eb' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Practice History</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length > 0 ? (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-200'>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>Question</th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>Category</th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>Score</th>
                    <th className='text-left py-3 px-4 font-medium text-gray-700'>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session) => (
                    <tr key={session._id} className='border-b border-gray-200 hover:bg-gray-50'>
                      <td className='py-3 px-4 text-gray-700 max-w-xs truncate'>
                        {session.questionId.text}
                      </td>
                      <td className='py-3 px-4'>
                        <Badge variant='blue' className='capitalize text-xs'>
                          {session.questionId.category}
                        </Badge>
                      </td>
                      <td className='py-3 px-4'>
                        {session.feedback ? (
                          <span className='font-semibold text-gray-900'>
                            {session.feedback.overallScore}/5
                          </span>
                        ) : (
                          <span className='text-gray-500'>—</span>
                        )}
                      </td>
                      <td className='py-3 px-4 text-gray-600'>
                        {new Date(session.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className='text-center text-gray-600 py-8'>
              No practice sessions yet. Start practicing to see your progress!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
