'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const articles: Record<string, { title: string; content: React.ReactNode }> = {
  'star-method': {
    title: 'The STAR Method for Behavioral Questions',
    content: (
      <>
        <div className='space-y-6'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>What is the STAR Method?</h2>
            <p className='text-gray-700 leading-relaxed'>
              The STAR method is a structured approach to answering behavioral interview questions. It helps you tell
              clear, compelling stories that demonstrate your skills and experience. STAR stands for:
            </p>
          </section>

          <section className='bg-blue-50 p-6 rounded-lg'>
            <div className='space-y-4'>
              <div>
                <h3 className='font-bold text-blue-900 mb-2'>📍 Situation</h3>
                <p className='text-blue-800'>
                  Describe the context and background. What was happening? What was the challenge or goal?
                </p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-2'>✅ Task</h3>
                <p className='text-blue-800'>Explain what you were responsible for. What was your role in the situation?</p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-2'>⚡ Action</h3>
                <p className='text-blue-800'>Describe the specific actions you took to address the challenge or achieve the goal.</p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-2'>🎯 Result</h3>
                <p className='text-blue-800'>
                  Share the outcome and impact. What did you learn? How did it benefit the team or company?
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Example: Handling a Difficult Team Member</h2>
            <Card>
              <CardContent className='p-6 space-y-3'>
                <div>
                  <p className='font-semibold text-gray-900'>Situation:</p>
                  <p className='text-gray-700'>
                    "In my previous role, we had a team member who was resistant to code review feedback and would
                    often push back on suggestions."
                  </p>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>Task:</p>
                  <p className='text-gray-700'>
                    "As a senior developer, I was responsible for maintaining code quality and helping junior developers grow."
                  </p>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>Action:</p>
                  <p className='text-gray-700'>
                    "I scheduled a one-on-one conversation to understand their concerns. I explained how code reviews
                    benefit everyone and suggested we approach them as learning opportunities. I then paired with them on a
                    feature to demonstrate the review process in a collaborative way."
                  </p>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>Result:</p>
                  <p className='text-gray-700'>
                    "Over the next month, they became more receptive to feedback. They eventually started participating
                    actively in code reviews and helped mentor newer team members. This improved team collaboration and code
                    quality overall."
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Tips for Mastering STAR</h2>
            <ul className='space-y-2'>
              <li className='flex gap-3'>
                <span className='text-green-600 font-bold'>✓</span>
                <span className='text-gray-700'>Be specific: Use concrete details, numbers, and outcomes</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-green-600 font-bold'>✓</span>
                <span className='text-gray-700'>Keep it concise: Aim for 2-3 minutes per answer</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-green-600 font-bold'>✓</span>
                <span className='text-gray-700'>Focus on "I", not "we": Highlight your personal contribution</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-green-600 font-bold'>✓</span>
                <span className='text-gray-700'>Show learning: Explain what you learned from the experience</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-green-600 font-bold'>✓</span>
                <span className='text-gray-700'>End on a high note: Emphasize positive outcomes and growth</span>
              </li>
            </ul>
          </section>
        </div>
      </>
    ),
  },
  'cap-method': {
    title: 'The CAP Method for CV and Situational Questions',
    content: (
      <>
        <div className='space-y-6'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>What is the CAP Method?</h2>
            <p className='text-gray-700 leading-relaxed'>
              The CAP method is perfect for CV-based and situational questions where you need to demonstrate problem-solving
              skills and technical depth. It emphasizes the Challenge you faced, your Approach, and the Problem-solving
              outcome.
            </p>
          </section>

          <section className='bg-green-50 p-6 rounded-lg'>
            <div className='space-y-4'>
              <div>
                <h3 className='font-bold text-green-900 mb-2'>🚨 Challenge</h3>
                <p className='text-green-800'>
                  What was the technical or strategic challenge? What problem needed solving?
                </p>
              </div>
              <div>
                <h3 className='font-bold text-green-900 mb-2'>💡 Approach</h3>
                <p className='text-green-800'>
                  How did you approach it? What methodology, tools, or frameworks did you use?
                </p>
              </div>
              <div>
                <h3 className='font-bold text-green-900 mb-2'>✨ Problem-solving & Results</h3>
                <p className='text-green-800'>
                  What was the outcome? How did your approach solve the problem? What impact did it have?
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Example: Optimizing a Slow Database Query</h2>
            <Card>
              <CardContent className='p-6 space-y-3'>
                <div>
                  <p className='font-semibold text-gray-900'>Challenge:</p>
                  <p className='text-gray-700'>
                    "We had a critical API endpoint that was taking 10+ seconds to respond, causing timeouts for users."
                  </p>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>Approach:</p>
                  <p className='text-gray-700'>
                    "I analyzed the slow query logs and identified N+1 queries. I used database indexing on frequently
                    queried columns, added query pagination, and implemented Redis caching for frequently accessed data. I
                    also refactored the API response to only include necessary fields."
                  </p>
                </div>
                <div>
                  <p className='font-semibold text-gray-900'>Result:</p>
                  <p className='text-gray-700'>
                    "Response time dropped to under 200ms, a 98% improvement. This reduced user-facing timeouts by 85% and
                    improved the overall system reliability. I documented the optimization for future developers."
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </>
    ),
  },
  'behavioral-tips': {
    title: 'Behavioral Interview Tips',
    content: (
      <>
        <div className='space-y-6'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>How to approach behavioral questions</h2>
            <p className='text-gray-700 leading-relaxed'>
              Behavioral interviews are about demonstrating how you work with others, solve problems, and handle
              pressure. Use real examples, keep your answer structured, and focus on outcomes.
            </p>
          </section>

          <section className='bg-blue-50 p-6 rounded-lg'>
            <div className='space-y-3'>
              <div>
                <h3 className='font-bold text-blue-900 mb-1'>1. Pick a relevant story</h3>
                <p className='text-blue-800'>Choose a story that shows teamwork, ownership, conflict resolution, or growth.</p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-1'>2. Lead with the result</h3>
                <p className='text-blue-800'>Be clear about the outcome, then explain how your actions contributed to it.</p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-1'>3. Keep it concise</h3>
                <p className='text-blue-800'>Aim for a focused answer that stays under two minutes unless asked for more detail.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Common mistakes to avoid</h2>
            <ul className='space-y-2 text-gray-700'>
              <li>• Giving vague answers without a concrete example</li>
              <li>• Spending too long on setup and not enough on actions and result</li>
              <li>• Blaming others instead of showing ownership</li>
              <li>• Forgetting to mention what you learned</li>
            </ul>
          </section>
        </div>
      </>
    ),
  },
  'technical-communication': {
    title: 'Technical Communication',
    content: (
      <>
        <div className='space-y-6'>
          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Explain technical work clearly</h2>
            <p className='text-gray-700 leading-relaxed'>
              For CV-based technical questions, show both depth and clarity. Explain what you built, why you made those
              choices, and what the trade-offs were.
            </p>
          </section>

          <section className='bg-blue-50 p-6 rounded-lg'>
            <div className='space-y-3'>
              <div>
                <h3 className='font-bold text-blue-900 mb-1'>Context</h3>
                <p className='text-blue-800'>Start with the project, the problem, and your role in it.</p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-1'>Choices</h3>
                <p className='text-blue-800'>Explain the architecture, libraries, or design decisions you made.</p>
              </div>
              <div>
                <h3 className='font-bold text-blue-900 mb-1'>Impact</h3>
                <p className='text-blue-800'>Finish with the measurable outcome or what improved because of your work.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-bold text-gray-900 mb-3'>Tips for technical questions</h2>
            <ul className='space-y-2 text-gray-700'>
              <li>• Use simple language before adding technical detail</li>
              <li>• Mention trade-offs instead of only describing implementation</li>
              <li>• Tie the story back to business or user impact</li>
              <li>• Be ready to go deeper if the interviewer asks follow-up questions</li>
            </ul>
          </section>
        </div>
      </>
    ),
  },
};

export default function LearnArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const article = articles[slug];

  if (!article) {
    return (
      <div className='mx-auto max-w-3xl px-4 py-8'>
        <p className='text-red-600 mb-4'>Article not found.</p>
        <Link href='/learn'>
          <Button>← Back to Learn</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      <Link href='/learn' className='mb-6 inline-block'>
        <Button variant='outline'>← Back to Learn</Button>
      </Link>

      <h1 className='text-4xl font-bold text-gray-900 mb-8'>{article.title}</h1>

      <div className='prose prose-sm max-w-none'>{article.content}</div>

      <div className='mt-12 p-6 bg-gray-50 rounded-lg text-center'>
        <p className='text-gray-700 mb-4'>Ready to practice using this framework?</p>
        <Link href='/questions'>
          <Button size='lg'>Start Practicing Questions</Button>
        </Link>
      </div>
    </div>
  );
}
