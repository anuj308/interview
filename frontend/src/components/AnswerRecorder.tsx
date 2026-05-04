'use client';

import React, { useState } from 'react';
import { useMediaRecorder } from 'react-media-recorder';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnswerRecorderProps {
  onSubmit: (answer: string, audioUrl?: string) => void;
  isLoading?: boolean;
}

type AnswerMode = 'type' | 'record';

export function AnswerRecorder({ onSubmit, isLoading = false }: AnswerRecorderProps) {
  const [mode, setMode] = useState<AnswerMode>('type');
  const [textAnswer, setTextAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } = useMediaRecorder({
    audio: true,
  });

  const handleRecordStart = () => {
    startRecording();
    setIsRecording(true);
  };

  const handleRecordStop = () => {
    stopRecording();
    setIsRecording(false);
  };

  const handleSubmitType = () => {
    if (!textAnswer.trim()) {
      alert('Please enter your answer');
      return;
    }
    onSubmit(textAnswer);
  };

  const handleSubmitRecord = () => {
    if (!mediaBlobUrl) {
      alert('Please record an answer');
      return;
    }
    // In a real app, you'd transcribe the audio first using Whisper API
    onSubmit('Audio answer recorded', mediaBlobUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Answer</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Mode Toggle */}
        <div className='flex gap-2'>
          <Button
            variant={mode === 'type' ? 'default' : 'outline'}
            onClick={() => setMode('type')}
          >
            Type Answer
          </Button>
          <Button
            variant={mode === 'record' ? 'default' : 'outline'}
            onClick={() => setMode('record')}
          >
            Record Voice
          </Button>
        </div>

        {/* Type Mode */}
        {mode === 'type' && (
          <div className='space-y-4'>
            <Textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder='Type your answer here...'
              className='min-h-[150px]'
            />
            <Button
              onClick={handleSubmitType}
              disabled={isLoading || !textAnswer.trim()}
              className='w-full'
            >
              {isLoading ? 'Getting Feedback...' : 'Submit Answer'}
            </Button>
          </div>
        )}

        {/* Record Mode */}
        {mode === 'record' && (
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded-lg text-center'>
              <div className='text-sm text-gray-600 mb-4'>
                {status === 'recording' ? (
                  <span className='flex items-center justify-center space-x-2'>
                    <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
                    <span>Recording...</span>
                  </span>
                ) : mediaBlobUrl ? (
                  <span>Recording ready</span>
                ) : (
                  <span>Ready to record</span>
                )}
              </div>

              {mediaBlobUrl && (
                <audio src={mediaBlobUrl} controls className='w-full mb-4' />
              )}

              <div className='flex gap-2 justify-center'>
                {!isRecording && !mediaBlobUrl && (
                  <Button
                    variant='default'
                    onClick={handleRecordStart}
                  >
                    Start Recording
                  </Button>
                )}

                {isRecording && (
                  <Button
                    variant='destructive'
                    onClick={handleRecordStop}
                  >
                    Stop Recording
                  </Button>
                )}

                {mediaBlobUrl && (
                  <>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setMode('record');
                        // Reset recording
                        window.location.reload();
                      }}
                    >
                      Rerecord
                    </Button>
                    <Button
                      onClick={handleSubmitRecord}
                      disabled={isLoading}
                      className='flex-1'
                    >
                      {isLoading ? 'Getting Feedback...' : 'Submit Recording'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
