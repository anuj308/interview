import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import HomePage from '../app/page';
import LoginPage from '../app/login/page';
import RegisterPage from '../app/register/page';
import LearnPage from '../app/learn/page';
import LearnArticlePage from '../app/learn/[slug]/page';
import QuestionsPage from '../app/questions/page';
import DashboardPage from '../app/dashboard/page';
import PracticePage from '../app/practice/[questionId]/page';
import MockInterviewPage from '../app/mock-interview/page';

const useAuthMock = vi.hoisted(() => vi.fn());

const apiMock = vi.hoisted(() => ({
  getQuestions: vi.fn(),
  getQuestion: vi.fn(),
  savePracticeSession: vi.fn(),
  getPracticeHistory: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: useAuthMock,
}));

vi.mock('@/lib/api', () => apiMock);

const routerState = globalThis.__routerState as {
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
  refresh: ReturnType<typeof vi.fn>;
  back: ReturnType<typeof vi.fn>;
  prefetch: ReturnType<typeof vi.fn>;
};

const navigationState = globalThis.__navigationState as {
  params: Record<string, string>;
  pathname: string;
};

const sampleQuestion = {
  _id: 'q-1',
  category: 'behavioral',
  subCategory: 'teamwork',
  text: 'Tell me about a time you resolved conflict.',
  difficulty: 'medium',
  tags: ['team', 'conflict'],
  sampleAnswer: 'Use STAR to explain the context, actions, and result.',
  createdAt: '2024-01-01T00:00:00.000Z',
};

const sampleSession = {
  _id: 'session-1',
  questionId: {
    _id: 'q-1',
    text: sampleQuestion.text,
    category: sampleQuestion.category,
  },
  userAnswer: 'I resolved the conflict by aligning goals.',
  feedback: {
    overallScore: 4,
    starBreakdown: { situation: 4, task: 4, action: 4, result: 4 },
    strengths: ['Clear structure'],
    improvements: ['Add metrics'],
    technicalDepth: 4,
    exampleBetterAnswer: 'A stronger answer',
  },
  createdAt: '2024-02-01T00:00:00.000Z',
};

describe('page routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    routerState.push.mockReset();
    routerState.replace.mockReset();
    routerState.refresh.mockReset();
    routerState.back.mockReset();
    routerState.prefetch.mockReset();
    navigationState.params = {};
    navigationState.pathname = '/';
    useAuthMock.mockReset();
    apiMock.getQuestions.mockReset();
    apiMock.getQuestion.mockReset();
    apiMock.savePracticeSession.mockReset();
    apiMock.getPracticeHistory.mockReset();
    apiMock.register.mockReset();
    apiMock.login.mockReset();
    window.alert = vi.fn();
  });

  it('renders the home page for guests', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false });

    render(<HomePage />);

    expect(screen.getByRole('link', { name: 'Get Started Free' })).toHaveAttribute('href', '/register');
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('link', { name: 'Start Practicing' })).not.toBeInTheDocument();
  });

  it('renders the home page actions for authenticated users', () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true });

    render(<HomePage />);

    expect(screen.getByRole('link', { name: 'Start Practicing' })).toHaveAttribute('href', '/questions');
    expect(screen.getByRole('link', { name: 'Try Mock Interview' })).toHaveAttribute('href', '/mock-interview');
  });

  it('submits the login form and routes to questions', async () => {
    const login = vi.fn().mockResolvedValue(undefined);
    useAuthMock.mockReturnValue({ login });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => expect(login).toHaveBeenCalledWith('alice@example.com', 'secret'));
    expect(routerState.push).toHaveBeenCalledWith('/questions');
  });

  it('submits the registration form and routes to questions', async () => {
    const register = vi.fn().mockResolvedValue(undefined);
    useAuthMock.mockReturnValue({ register });

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Alice Example' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => expect(register).toHaveBeenCalledWith('alice@example.com', 'secret', 'Alice Example'));
    expect(routerState.push).toHaveBeenCalledWith('/questions');
  });

  it('renders the learn hub and article pages', () => {
    render(<LearnPage />);

    expect(screen.getByRole('link', { name: /star method/i })).toHaveAttribute('href', '/learn/star-method');
    expect(screen.getByText('Technical Communication')).toBeInTheDocument();

    navigationState.params = { slug: 'star-method' };
    render(<LearnArticlePage />);

    expect(screen.getByRole('heading', { name: /the star method for behavioral questions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← Back to Learn' })).toHaveAttribute('href', '/learn');
  });

  it('redirects unauthenticated users from questions', async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, loading: false });

    render(<QuestionsPage />);

    await waitFor(() => expect(routerState.push).toHaveBeenCalledWith('/login'));
  });

  it('loads and filters questions for authenticated users', async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false });
    apiMock.getQuestions.mockResolvedValue([sampleQuestion]);

    render(<QuestionsPage />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Practice Questions' })).toBeInTheDocument());
    expect(apiMock.getQuestions).toHaveBeenCalledWith(undefined, undefined, undefined);
    expect(screen.getByText(sampleQuestion.text)).toBeInTheDocument();

    const [categorySelect, difficultySelect] = screen.getAllByRole('combobox');

    fireEvent.change(screen.getByPlaceholderText('Search questions...'), { target: { value: 'conflict' } });
    fireEvent.change(categorySelect, { target: { value: 'behavioral' } });
    await waitFor(() => expect(apiMock.getQuestions).toHaveBeenLastCalledWith('behavioral', undefined, 'conflict'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument());
    const refreshedDifficultySelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(refreshedDifficultySelect, { target: { value: 'medium' } });

    await waitFor(() => expect(apiMock.getQuestions).toHaveBeenLastCalledWith('behavioral', 'medium', 'conflict'));
  });

  it('renders dashboard metrics and history', async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false });
    apiMock.getPracticeHistory.mockResolvedValue({ sessions: [sampleSession] });

    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument());
    const totalCard = screen.getByText('Total Practices').closest('.rounded-lg');
    const averageCard = screen.getByText('Average Score').closest('.rounded-lg');
    const behavioralCard = screen.getByText('Behavioral').closest('.rounded-lg');

    expect(totalCard).not.toBeNull();
    expect(averageCard).not.toBeNull();
    expect(behavioralCard).not.toBeNull();
    expect(within(totalCard as HTMLElement).getByText('1')).toBeInTheDocument();
    expect(within(averageCard as HTMLElement).getByText('4/5')).toBeInTheDocument();
    expect(within(behavioralCard as HTMLElement).getByText('1')).toBeInTheDocument();
    expect(screen.getByText(sampleQuestion.text)).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('loads a practice question and submits an answer', async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false });
    navigationState.params = { questionId: 'q-1' };
    apiMock.getQuestion.mockResolvedValue(sampleQuestion);
    apiMock.savePracticeSession.mockResolvedValue(sampleSession);

    render(<PracticePage />);

    await waitFor(() => expect(screen.getByRole('heading', { name: sampleQuestion.text })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Your Answer')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Type your answer here...'), {
      target: { value: 'I used STAR to resolve the conflict.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }));

    await waitFor(() => expect(apiMock.savePracticeSession).toHaveBeenCalledWith('q-1', 'I used STAR to resolve the conflict.', undefined));
    expect(screen.getByText('Your Answer')).toBeInTheDocument();
    expect(screen.getByText('A stronger answer')).toBeInTheDocument();
  });

  it('runs a mock interview through to completion', async () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, loading: false });
    apiMock.getQuestions.mockResolvedValue([sampleQuestion]);
    apiMock.savePracticeSession.mockResolvedValue(sampleSession);

    render(<MockInterviewPage />);

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Mock Interview' })).toBeInTheDocument());
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Start Interview' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: /question 1 of 1/i })).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('Your Answer')).toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText('Type your answer here...'), {
      target: { value: 'I resolved the conflict by aligning goals.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Answer' }));

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Interview Complete!' })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'View Results' })).toBeInTheDocument();
  });
});