import React from 'react';
import { Feedback } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const scoreColor =
    feedback.overallScore >= 4 ? 'green' : feedback.overallScore >= 3 ? 'yellow' : 'red';

  return (
    <Card className='mt-6'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>AI Feedback</CardTitle>
          <Badge variant={scoreColor}>Score: {feedback.overallScore}/5</Badge>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* STAR Breakdown */}
        <div>
          <h3 className='font-semibold text-gray-900 mb-4'>STAR Method Breakdown</h3>
          <div className='space-y-3'>
            {Object.entries(feedback.starBreakdown).map(([key, value]) => (
              <div key={key}>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700 capitalize'>{key}</span>
                  <span className='text-sm text-gray-600'>{value}/5</span>
                </div>
                <Progress value={value} max={5} />
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div>
          <h3 className='font-semibold text-gray-900 mb-2'>Strengths</h3>
          <ul className='space-y-2'>
            {feedback.strengths.map((strength, idx) => (
              <li key={idx} className='flex items-start space-x-2 text-sm'>
                <span className='text-green-600 mt-1'>✓</span>
                <span className='text-gray-700'>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h3 className='font-semibold text-gray-900 mb-2'>Areas for Improvement</h3>
          <ul className='space-y-2'>
            {feedback.improvements.map((improvement, idx) => (
              <li key={idx} className='flex items-start space-x-2 text-sm'>
                <span className='text-yellow-600 mt-1'>→</span>
                <span className='text-gray-700'>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technical Depth */}
        <div>
          <div className='flex justify-between mb-1'>
            <span className='text-sm font-medium text-gray-700'>Technical Depth</span>
            <span className='text-sm text-gray-600'>{feedback.technicalDepth}/5</span>
          </div>
          <Progress value={feedback.technicalDepth} max={5} />
        </div>

        {/* Better Answer */}
        <div className='bg-blue-50 p-4 rounded-lg'>
          <h3 className='font-semibold text-gray-900 mb-2'>Example Better Answer</h3>
          <p className='text-sm text-gray-700'>{feedback.exampleBetterAnswer}</p>
        </div>
      </CardContent>
    </Card>
  );
}
