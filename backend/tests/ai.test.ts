import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockOpenAiCreate = vi.hoisted(() => vi.fn());

vi.mock('openai', () => {
  class MockOpenAI {
    chat = {
      completions: {
        create: mockOpenAiCreate,
      },
    };
  }

  return { default: MockOpenAI };
});

describe('generateFeedback', () => {
  beforeEach(() => {
    vi.resetModules();
    mockOpenAiCreate.mockReset();
    delete (globalThis as { fetch?: typeof fetch }).fetch;
    delete process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
    process.env.OPENAI_API_KEY = 'openai-test-key';
    process.env.GOOGLE_MODEL = 'gemini-1.5-flash';
  });

  it('uses Google Gemini when GOOGLE_API_KEY is set', async () => {
    const feedback = {
      overallScore: 5,
      starBreakdown: { situation: 5, task: 5, action: 5, result: 5 },
      strengths: ['Clear structure'],
      improvements: ['None'],
      technicalDepth: 5,
      exampleBetterAnswer: 'Great answer',
    };

    process.env.GOOGLE_API_KEY = 'google-test-key';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify(feedback) }],
            },
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { generateFeedback } = await import('../src/lib/ai.js');
    const result = await generateFeedback('Tell me about a time...', 'I led a project.');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(mockOpenAiCreate).not.toHaveBeenCalled();
    expect(result).toEqual(feedback);
  });

  it('falls back to OpenAI when Google is not configured', async () => {
    const feedback = {
      overallScore: 4,
      starBreakdown: { situation: 4, task: 4, action: 4, result: 4 },
      strengths: ['Specific example'],
      improvements: ['Add metrics'],
      technicalDepth: 3,
      exampleBetterAnswer: 'Improved answer',
    };

    mockOpenAiCreate.mockResolvedValue({
      choices: [{ message: { content: JSON.stringify(feedback) } }],
    });

    const { generateFeedback } = await import('../src/lib/ai.js');
    const result = await generateFeedback('How do you handle conflict?', 'I talked with the team.');

    expect(mockOpenAiCreate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(feedback);
  });
});