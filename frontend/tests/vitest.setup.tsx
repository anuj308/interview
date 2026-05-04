import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';
import { afterEach, vi } from 'vitest';

const sharedState = vi.hoisted(() => ({
  routerState: {
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  },
  navigationState: {
    params: {} as Record<string, string>,
    pathname: '/',
  },
  mediaRecorderState: {
    status: 'idle',
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    mediaBlobUrl: '',
  },
}));

Object.assign(globalThis, {
  __routerState: sharedState.routerState,
  __navigationState: sharedState.navigationState,
  __mediaRecorderState: sharedState.mediaRecorderState,
});

const storage = (() => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => (key in store ? store[key] : null)),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: storage,
  configurable: true,
});

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => (
    <a href={typeof href === 'string' ? href : href?.pathname ?? '#'} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => sharedState.routerState,
  useParams: () => sharedState.navigationState.params,
  usePathname: () => sharedState.navigationState.pathname,
}));

vi.mock('next/dynamic', () => ({
  default: (loader: any) => {
    const LazyComponent = React.lazy(async () => {
      const component = await loader();
      return { default: component };
    });

    return function DynamicComponent(props: any) {
      return (
        <React.Suspense fallback={null}>
          <LazyComponent {...props} />
        </React.Suspense>
      );
    };
  },
}));

vi.mock('react-media-recorder', () => ({
  useReactMediaRecorder: () => sharedState.mediaRecorderState,
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid='responsive-container'>{children}</div>,
  LineChart: ({ children }: any) => <div data-testid='line-chart'>{children}</div>,
  Line: () => <div data-testid='line' />,
  XAxis: () => <div data-testid='x-axis' />,
  YAxis: () => <div data-testid='y-axis' />,
  CartesianGrid: () => <div data-testid='grid' />,
  Tooltip: () => <div data-testid='tooltip' />,
}));

afterEach(() => {
  cleanup();
});
