import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const GOOGLE_MODEL = process.env.GOOGLE_MODEL || 'gemini-1.5-flash';

interface Feedback {
  overallScore: number;
  starBreakdown: {
    situation: number;
    task: number;
    action: number;
    result: number;
  };
  strengths: string[];
  improvements: string[];
  technicalDepth: number;
  exampleBetterAnswer: string;
}

const SYSTEM_PROMPT = `You are an interview coach specialized in tech roles. Given the interview question and the candidate's answer, evaluate it using the STAR method (if behavioral) or CAP method (if CV/situational). Return valid JSON with this exact structure:
{
  "overallScore": <1-5>,
  "starBreakdown": {
    "situation": <score 1-5>,
    "task": <score 1-5>,
    "action": <score 1-5>,
    "result": <score 1-5>
  },
  "strengths": ["..."],
  "improvements": ["..."],
  "technicalDepth": <score 1-5>,
  "exampleBetterAnswer": "<a concise improved version>"
}
Be strict but constructive. Always mention specific improvements. Return ONLY valid JSON, no markdown or extra text.`;

async function generateWithGoogle(question: string, answer: string): Promise<Feedback> {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google API key is not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_MODEL}:generateContent?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `Question: ${question}\n\nAnswer: ${answer}` }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json() as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) {
    throw new Error('Empty response from Google API');
  }

  return JSON.parse(content) as Feedback;
}

async function generateWithOpenAI(question: string, answer: string): Promise<Feedback> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Question: ${question}\n\nAnswer: ${answer}`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Empty response from OpenAI');
  }

  return JSON.parse(content) as Feedback;
}

export async function generateFeedback(question: string, answer: string): Promise<Feedback> {
  try {
    if (GOOGLE_API_KEY) {
      return await generateWithGoogle(question, answer);
    }

    return await generateWithOpenAI(question, answer);
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw error;
  }
}
