import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Navbar } from '@/components/Navbar';
import { QuestionCard } from '@/components/QuestionCard';
import { FeedbackCard } from '@/components/FeedbackCard';
import { AnswerRecorder } from '@/components/AnswerRecorder';

const useAuthMock = vi.hoisted(() => vi.fn());

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: useAuthMock,
}));

const routerState = globalThis.__routerState as {
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
};

const mediaRecorderState = globalThis.__mediaRecorderState as {
  status: string;
  startRecording: ReturnType<typeof vi.fn>;
  stopRecording: ReturnType<typeof vi.fn>;
  mediaBlobUrl: string;
};

describe('shared components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    routerState.push.mockReset();
    routerState.replace.mockReset();
    routerState.refresh.mockReset();
    routerState.back.mockReset();
    routerState.prefetch.mockReset();
    mediaRecorderState.status = 'idle';
    mediaRecorderState.mediaBlobUrl = '';
    mediaRecorderState.startRecording.mockReset();
    mediaRecorderState.stopRecording.mockReset();
    useAuthMock.mockReset();
    window.alert = vi.fn();
  });

  it('renders navbar links based on auth state', () => {
    useAuthMock.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    render(<Navbar />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('logs out and routes home', () => {
    const logout = vi.fn();
    useAuthMock.mockReturnValue({
      user: { email: 'tester@example.com' },
      isAuthenticated: true,
      logout,
    });

    render(<Navbar />);
    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(routerState.push).toHaveBeenCalledWith('/');
  });

  it('renders a question card with a practice link', () => {
    render(
      <QuestionCard
        question={{
          _id: 'q-1',
          category: 'behavioral',
          subCategory: 'teamwork',
          text: 'Tell me about a time you resolved conflict.',
          difficulty: 'medium',
          tags: ['team', 'conflict'],
          createdAt: '2024-01-01T00:00:00.000Z',
        }}
      />
    );

    expect(screen.getByText('Tell me about a time you resolved conflict.')).toBeInTheDocument();
    expect(screen.getByText('behavioral')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tell me about a time you resolved conflict/i })).toHaveAttribute(
      'href',
      '/practice/q-1'
    );
  });

  it('renders feedback details', () => {
    render(
      <FeedbackCard
        feedback={{
          overallScore: 4,
          starBreakdown: { situation: 4, task: 3, action: 4, result: 5 },
          strengths: ['Clear story'],
          improvements: ['Add metrics'],
          technicalDepth: 4,
          exampleBetterAnswer: 'A stronger answer',
        }}
      />
    );

    expect(screen.getByText('AI Feedback')).toBeInTheDocument();
    expect(screen.getByText('Score: 4/5')).toBeInTheDocument();
    expect(screen.getByText('Clear story')).toBeInTheDocument();
    expect(screen.getByText('Add metrics')).toBeInTheDocument();
    expect(screen.getByText('A stronger answer')).toBeInTheDocument();
  });

  it('collects typed answers', () => {
    const onSubmit = vi.fn();
    render(<AnswerRecorder onSubmit={onSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Type your answer here...'), {
      target: { value: 'This is my answer' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }));

    expect(onSubmit).toHaveBeenCalledWith('This is my answer');
  });

  it('records and submits audio answers', async () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<AnswerRecorder onSubmit={onSubmit} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Record Voice' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Start Recording' }));
    expect(mediaRecorderState.startRecording).toHaveBeenCalledTimes(1);

    mediaRecorderState.mediaBlobUrl = 'blob:audio';
    mediaRecorderState.status = 'stopped';
    rerender(<AnswerRecorder onSubmit={onSubmit} />);

    await waitFor(() => expect(screen.getByText('Recording ready')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Submit Recording' }));

    expect(onSubmit).toHaveBeenCalledWith('Audio answer recorded', 'blob:audio');
  });
});