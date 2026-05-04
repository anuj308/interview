import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';

const apiMock = vi.hoisted(() => ({
  register: vi.fn(),
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('@/lib/api', () => apiMock);

function Probe() {
  const auth = useAuth();

  return (
    <div>
      <div data-testid='loading'>{auth.loading ? 'loading' : 'ready'}</div>
      <div data-testid='authenticated'>{auth.isAuthenticated ? 'yes' : 'no'}</div>
      <div data-testid='email'>{auth.user?.email ?? 'none'}</div>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads an existing user from localStorage', async () => {
    localStorage.setItem('auth_token', 'saved-token');
    apiMock.getCurrentUser.mockResolvedValue({ id: 'user-1', email: 'saved@example.com' });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('ready'));
    expect(screen.getByTestId('authenticated')).toHaveTextContent('yes');
    expect(screen.getByTestId('email')).toHaveTextContent('saved@example.com');
  });

  it('clears invalid saved tokens', async () => {
    localStorage.setItem('auth_token', 'bad-token');
    apiMock.getCurrentUser.mockRejectedValue(new Error('unauthorized'));

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    const view = screen;

    await waitFor(() => expect(view.getByTestId('loading')).toHaveTextContent('ready'));
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(view.getByTestId('authenticated')).toHaveTextContent('no');
  });

  it('registers, logs in, and logs out', async () => {
    apiMock.register.mockResolvedValue({
      token: 'register-token',
      user: { id: 'user-1', email: 'new@example.com' },
    });
    apiMock.login.mockResolvedValue({
      token: 'login-token',
      user: { id: 'user-2', email: 'login@example.com' },
    });

    function Controls() {
      const auth = useAuth();

      return (
        <>
          <button onClick={() => auth.register('new@example.com', 'secret', 'New User')}>register</button>
          <button onClick={() => auth.login('login@example.com', 'secret')}>login</button>
          <button onClick={auth.logout}>logout</button>
          <div data-testid='auth-state'>{auth.isAuthenticated ? 'yes' : 'no'}</div>
          <div data-testid='token'>{auth.token ?? 'none'}</div>
        </>
      );
    }

    render(
      <AuthProvider>
        <Controls />
      </AuthProvider>
    );

    await screen.findByText('register');

    await screen.findByText('register');
    fireEvent.click(screen.getByText('register'));
    await waitFor(() => expect(localStorage.getItem('auth_token')).toBe('register-token'));

    fireEvent.click(screen.getByText('login'));
    await waitFor(() => expect(localStorage.getItem('auth_token')).toBe('login-token'));

    fireEvent.click(screen.getByText('logout'));
    await waitFor(() => expect(localStorage.getItem('auth_token')).toBeNull());
    await waitFor(() => expect(screen.getByTestId('auth-state')).toHaveTextContent('no'));
  });

  it('throws when used outside the provider', () => {
    expect(() => render(<Probe />)).toThrow('useAuth must be used within AuthProvider');
  });
});