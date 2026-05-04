import { beforeEach, describe, expect, it, vi } from 'vitest';

const requestUse = vi.hoisted(() => vi.fn());
const getMock = vi.hoisted(() => vi.fn());
const postMock = vi.hoisted(() => vi.fn());
const createMock = vi.hoisted(() => vi.fn(() => ({
  interceptors: { request: { use: requestUse } },
  get: getMock,
  post: postMock,
})));

vi.mock('axios', () => ({
  default: { create: createMock },
}));

describe('frontend api client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    requestUse.mockReset();
    getMock.mockReset();
    postMock.mockReset();
    createMock.mockClear();
    getMock.mockResolvedValue({ data: {} });
    postMock.mockResolvedValue({ data: {} });
  });

  it('adds bearer tokens from localStorage', async () => {
    localStorage.setItem('auth_token', 'token-123');
    const api = await import('../src/lib/api');

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(requestUse).toHaveBeenCalledTimes(1);

    const interceptor = requestUse.mock.calls[0][0];
    const config = interceptor({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer token-123');
    expect(api.default).toBeDefined();
  });

  it('calls auth endpoints with expected payloads', async () => {
    const api = await import('../src/lib/api');

    getMock.mockResolvedValueOnce({ data: { id: 'user-1' } });
    postMock.mockResolvedValueOnce({ data: { token: 't', user: { id: 'user-1', email: 'a@b.com' } } });

    await api.register('a@b.com', 'secret', 'Alice');
    await api.login('a@b.com', 'secret');
    await api.getCurrentUser();
    await api.getQuestions('behavioral', 'easy', 'team');
    await api.getQuestion('q-1');
    await api.savePracticeSession('q-1', 'answer', 'blob:url');
    await api.getPracticeHistory(10, 5);
    await api.getPracticeSession('session-1');

    expect(postMock).toHaveBeenCalledWith('/auth/register', {
      email: 'a@b.com',
      password: 'secret',
      name: 'Alice',
    });
    expect(postMock).toHaveBeenCalledWith('/auth/login', {
      email: 'a@b.com',
      password: 'secret',
    });
    expect(getMock).toHaveBeenCalledWith('/auth/me');
    expect(getMock).toHaveBeenCalledWith('/questions', { params: { category: 'behavioral', difficulty: 'easy', search: 'team' } });
    expect(getMock).toHaveBeenCalledWith('/questions/q-1');
    expect(postMock).toHaveBeenCalledWith('/practice', { questionId: 'q-1', userAnswer: 'answer', audioUrl: 'blob:url' });
    expect(getMock).toHaveBeenCalledWith('/practice/history', { params: { limit: 10, skip: 5 } });
    expect(getMock).toHaveBeenCalledWith('/practice/session-1');
  });
});