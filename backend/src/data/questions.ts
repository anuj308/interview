export const questionSeedData = [
  {
    category: 'behavioral',
    subCategory: 'teamwork',
    text: 'Tell me about a time you worked with a difficult team member. How did you handle it?',
    sampleAnswer:
      'In my previous role, I collaborated with a developer who had a different approach to code organization. Instead of avoiding the person, I scheduled a one-on-one to understand their perspective. We found common ground and established coding standards together.',
    difficulty: 'medium',
    tags: ['teamwork', 'communication', 'conflict-resolution'],
  },
  {
    category: 'behavioral',
    subCategory: 'failure',
    text: 'Describe a time you failed. What did you learn from it?',
    sampleAnswer:
      'I once deployed a feature without proper testing that caused a production bug. I learned the importance of test coverage and now advocate for comprehensive testing before deployment.',
    difficulty: 'medium',
    tags: ['learning', 'accountability', 'leadership'],
  },
  {
    category: 'behavioral',
    subCategory: 'initiative',
    text: 'Tell me about a time you took initiative on something that was not part of your job.',
    sampleAnswer:
      'I noticed our team was spending hours on repetitive deployment tasks. I created an automation script that reduced deployment time by 80%, saving the team valuable hours.',
    difficulty: 'hard',
    tags: ['initiative', 'problem-solving', 'automation'],
  },
  {
    category: 'behavioral',
    subCategory: 'performance',
    text: 'Tell me about a performance optimization you implemented.',
    sampleAnswer:
      'I reduced page load time by 60% by implementing code splitting, lazy loading images, and caching strategies. I monitored performance using Lighthouse and Core Web Vitals.',
    difficulty: 'hard',
    tags: ['performance', 'optimization', 'monitoring'],
  },
  {
    category: 'cv',
    subCategory: 'nextjs',
    text: 'Describe your experience with Next.js and what project you built with it.',
    sampleAnswer:
      'I built a full-stack e-commerce platform using Next.js 14 with the App Router. I leveraged server components for SEO optimization, API routes for backend logic, and middleware for authentication.',
    difficulty: 'medium',
    tags: ['nextjs', 'fullstack', 'react'],
  },
  {
    category: 'cv',
    subCategory: 'express',
    text: 'Tell us about an Express.js API you built and the challenges you faced.',
    sampleAnswer:
      'I developed a REST API with Express handling 10k requests/hour. The main challenge was database connection pooling, which I solved by implementing connection reuse with proper timeout management.',
    difficulty: 'medium',
    tags: ['express', 'nodejs', 'api-design'],
  },
  {
    category: 'cv',
    subCategory: 'database',
    text: 'What database technologies have you worked with? Describe your most complex data model.',
    sampleAnswer:
      'I have experience with MongoDB and PostgreSQL. My most complex model involved designing a hierarchical structure for an organization tree with efficient querying using recursive CTEs.',
    difficulty: 'hard',
    tags: ['database', 'mongodb', 'postgresql'],
  },
  {
    category: 'cv',
    subCategory: 'nextjs',
    text: 'Explain the difference between Server Components and Client Components in Next.js.',
    sampleAnswer:
      'Server Components render on the server, reducing bundle size and enabling direct database access. Client Components run in the browser, enabling interactivity. We use Server Components by default for better performance.',
    difficulty: 'hard',
    tags: ['nextjs', 'react', 'performance'],
  },
  {
    category: 'cv',
    subCategory: 'nextjs',
    text: 'How would you optimize a Next.js application for SEO?',
    sampleAnswer:
      'I would use dynamic meta tags, Server Components for content, generate sitemaps, use proper heading hierarchy, implement structured data, and ensure fast page load times with image optimization.',
    difficulty: 'hard',
    tags: ['nextjs', 'seo', 'optimization'],
  },
  {
    category: 'cv',
    subCategory: 'express',
    text: 'How do you handle authentication and authorization in Express?',
    sampleAnswer:
      'I use JWT tokens for stateless authentication. I create middleware to verify tokens and check user roles/permissions before accessing protected routes.',
    difficulty: 'medium',
    tags: ['express', 'security', 'authentication'],
  },
  {
    category: 'cv',
    subCategory: 'express',
    text: 'Describe how you would structure a large Express.js application.',
    sampleAnswer:
      'I organize by feature with routes, controllers, models, and middleware in separate folders. I use dependency injection for services and keep business logic separate from route handlers.',
    difficulty: 'hard',
    tags: ['express', 'architecture', 'nodejs'],
  },
  {
    category: 'situational',
    subCategory: 'deadline',
    text: 'You have a deadline you cannot meet. What do you do?',
    sampleAnswer:
      'I would immediately communicate with my manager and stakeholders about the realistic timeline. I would break down the work, prioritize critical features, and propose a phased delivery plan.',
    difficulty: 'medium',
    tags: ['communication', 'deadline-management', 'problem-solving'],
  },
  {
    category: 'situational',
    subCategory: 'code-review',
    text: 'During a code review, a senior developer rejects your PR with harsh criticism. How do you respond?',
    sampleAnswer:
      'I would thank them for the feedback and ask specific questions to understand their concerns. I would focus on the code, not the person, and use it as a learning opportunity.',
    difficulty: 'medium',
    tags: ['communication', 'feedback', 'professionalism'],
  },
  {
    category: 'situational',
    subCategory: 'scope-creep',
    text: 'A client asks for a significant change mid-project. How do you handle it?',
    sampleAnswer:
      'I would assess the impact on timeline and resources, document the change request, discuss with my team, and present options with trade-offs to the client.',
    difficulty: 'hard',
    tags: ['project-management', 'communication', 'negotiation'],
  },
  {
    category: 'cv',
    subCategory: 'unix-linux',
    text: 'Explain what the Unix `man` command does and provide examples of how you would use it.',
    sampleAnswer:
      'The `man` command displays the manual pages for Unix/Linux commands. For example, `man ls` shows documentation for the ls command, `man grep` for grep, and `man man` for the man command itself. You can search within man pages using `/` and navigate with arrow keys. `man -k keyword` searches for commands related to a topic.',
    difficulty: 'easy',
    tags: ['unix', 'linux', 'command-line', 'troubleshooting'],
  },
] as const;