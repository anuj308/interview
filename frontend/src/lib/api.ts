import axios, { AxiosError } from 'axios';
import { AuthResponse, User, Question, PracticeSession } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export async function register(email: string, password: string, name?: string): Promise<AuthResponse> {
  const response = await api.post('/auth/register', { email, password, name });
  return response.data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/auth/me');
  return response.data;
}

// Questions
export async function getQuestions(category?: string, difficulty?: string, search?: string): Promise<Question[]> {
  const response = await api.get('/questions', {
    params: { category, difficulty, search },
  });
  return response.data;
}

export async function getQuestion(id: string): Promise<Question> {
  const response = await api.get(`/questions/${id}`);
  return response.data;
}

// Practice
export async function savePracticeSession(
  questionId: string,
  userAnswer: string,
  audioUrl?: string
): Promise<PracticeSession> {
  const response = await api.post('/practice', {
    questionId,
    userAnswer,
    audioUrl,
  });
  return response.data;
}

export async function getPracticeHistory(limit = 20, skip = 0): Promise<{
  sessions: PracticeSession[];
  total: number;
}> {
  const response = await api.get('/practice/history', {
    params: { limit, skip },
  });
  return response.data;
}

export async function getPracticeSession(id: string): Promise<PracticeSession> {
  const response = await api.get(`/practice/${id}`);
  return response.data;
}

export default api;
