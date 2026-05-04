import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function generateFeedback(question: string, answer: string): Promise<Feedback> {
  try {
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

    const feedback = JSON.parse(content) as Feedback;
    return feedback;
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw error;
  }
}
