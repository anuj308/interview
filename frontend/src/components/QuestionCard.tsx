import React from 'react';
import Link from 'next/link';
import { Question } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const difficultyColor =
    question.difficulty === 'easy' ? 'green' : question.difficulty === 'medium' ? 'yellow' : 'red';

  return (
    <Link href={`/practice/${question._id}`}>
      <Card className='cursor-pointer hover:shadow-md transition-shadow'>
        <CardContent className='p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-2'>
                <Badge variant='blue' className='capitalize'>
                  {question.category}
                </Badge>
                {question.subCategory && (
                  <span className='text-xs text-gray-500'>{question.subCategory}</span>
                )}
              </div>
              <h3 className='font-semibold text-gray-900 line-clamp-2 mb-3'>{question.text}</h3>
              <div className='flex flex-wrap gap-1'>
                {question.tags.map((tag) => (
                  <Badge key={tag} variant='default' className='text-xs'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge variant={difficultyColor} className='whitespace-nowrap capitalize'>
              {question.difficulty}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
