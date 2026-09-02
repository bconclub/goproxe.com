/**
 * Blog posts registry - single source of truth for all published posts.
 * Drives the /blog index, sitemap, and post chrome (related/recent/prev/next).
 */

export type Trade = 'healthcare' | 'coaching' | 'realestate' | 'wellness' | 'home-services' | 'professional' | 'product';

export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  date: string; // YYYY-MM-DD
  thumbnail: string; // path to 1200x630 hero image
  trade: Trade;
  wordCount?: number; // for min read calculation
  related?: string[]; // optional override for related post slugs (in order)
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'people-miss-conversations',
    title: 'People miss conversations. Then they lose the lead.',
    dek: 'WhatsApp leads go cold overnight. Clinics, coaches, and brokers miss the chat. How fast to reply, what after-hours enquiries do, and how to stop the leak.',
    date: '2026-07-21',
    thumbnail: '/blog/people-miss-conversations.png',
    trade: 'product',
    wordCount: 520,
  },
  {
    slug: 'what-is-proxe',
    title: 'What is PROXe?',
    dek: 'PROXe answers, qualifies, books and follows up on every lead, on every channel.',
    date: '2026-07-23',
    thumbnail: '/blog/what-is-proxe.png',
    trade: 'product',
    wordCount: 480,
  },
  {
    slug: 'crm-wont-answer',
    title: 'Your CRM will not answer that WhatsApp',
    dek: 'A CRM stores the lead. It does not answer, qualify, book, or follow up. That is why the chat still sits.',
    date: '2026-07-28',
    thumbnail: '/blog/crm-wont-answer.png',
    trade: 'product',
    wordCount: 450,
  },
  {
    slug: 'not-a-whatsapp-bot',
    title: 'PROXe is not a WhatsApp chatbot',
    dek: 'A chatbot dumps FAQs on one channel. PROXe answers, qualifies, books and follows up, on every channel, with one memory.',
    date: '2026-07-30',
    thumbnail: '/blog/not-a-whatsapp-bot.png',
    trade: 'product',
    wordCount: 430,
  },
  {
    slug: 'after-hours-whatsapp',
    title: 'After-hours WhatsApp is how you lose the lead',
    dek: 'They wrote at 11pm. An away message is not an answer. Answer, qualify, book. Do not wait until morning.',
    date: '2026-08-04',
    thumbnail: '/blog/after-hours-whatsapp.png',
    trade: 'product',
    wordCount: 410,
  },
  {
    slug: 'how-fast-to-reply-whatsapp',
    title: 'How fast should you reply to a WhatsApp lead',
    dek: 'First useful reply gets the slot. Thanks, we will call you, is not a reply.',
    date: '2026-08-06',
    thumbnail: '/blog/how-fast-to-reply-whatsapp.png',
    trade: 'product',
    wordCount: 470,
  },
  {
    slug: 'one-memory-every-channel',
    title: 'One lead, four channels, one memory',
    dek: 'WhatsApp Monday. Instagram Thursday. Site Saturday. Call later. Same person. They should never repeat themselves.',
    date: '2026-08-11',
    thumbnail: '/blog/one-memory-every-channel.png',
    trade: 'product',
    wordCount: 490,
  },
  {
    slug: 'clinics-whatsapp-during-consult',
    title: 'They WhatsApped while you were in consult. The clinic that answered got the patient.',
    dek: 'Clinic inbound dies in the chair, at night, and on the missed call. Answer, qualify, book. Do not wait until the next gap.',
    date: '2026-08-13',
    thumbnail: '/blog/clinics-whatsapp-during-consult.png',
    trade: 'healthcare',
    wordCount: 540,
  },
  {
    slug: 'coaching-parents-at-night',
    title: 'The parent messaged at 9pm. The institute that answered got the admission.',
    dek: 'Coaching inbound dies after class and after 7pm. Answer, qualify the exam, book the counselling. Do not wait until morning.',
    date: '2026-08-18',
    thumbnail: '/blog/coaching-parents-at-night.png',
    trade: 'coaching',
    wordCount: 530,
  },
  {
    slug: 'paid-lead-no-reply',
    title: 'You paid for the lead. Then you answered tomorrow.',
    dek: 'Broker inbound dies on a personal WhatsApp. Site visit goes to whoever replied. Answer, qualify, book. Do not wait until the next listing.',
    date: '2026-08-20',
    thumbnail: '/blog/paid-lead-no-reply.png',
    trade: 'realestate',
    wordCount: 510,
  },
  {
    slug: 'wellness-after-hours',
    title: 'They wanted 7pm. You replied at 10am. The other studio got the booking.',
    dek: 'Spa, gym, yoga inbound dies after hours. Answer, qualify, book the slot. Do not wait until the next class.',
    date: '2026-08-25',
    thumbnail: '/blog/wellness-after-hours.png',
    trade: 'wellness',
    wordCount: 500,
  },
  {
    slug: 'home-services-on-a-job',
    title: 'They called while you were on a job. The crew that answered got the work.',
    dek: 'Plumber, AC, electrician inbound dies on the job and at night. Answer, qualify, book. Do not wait until you park.',
    date: '2026-08-27',
    thumbnail: '/blog/home-services-on-a-job.png',
    trade: 'home-services',
    wordCount: 520,
  },
  {
    slug: 'professional-services-with-a-client',
    title: 'They WhatsApped while you were with a client. The firm that answered got the brief.',
    dek: 'CA, lawyer, consultant inbound dies in the meeting. Answer, qualify, book the consult. Do not wait until you hang up.',
    date: '2026-09-01',
    thumbnail: '/blog/professional-services-with-a-client.png',
    trade: 'professional',
    wordCount: 485,
  },
  {
    slug: 'who-answers-the-customer',
    title: 'Who answers the customer',
    dek: 'Most teams can show you the lead. Fewer can say who is supposed to talk to them.',
    date: '2026-09-02',
    thumbnail: '/blog/who-answers-the-customer.png',
    trade: 'product',
    wordCount: 743,
    related: ['crm-wont-answer', 'what-is-proxe', 'not-a-whatsapp-bot'],
  },
  {
    slug: 'follow-up-is-a-system',
    title: 'Follow-up is a system',
    dek: 'The first reply is not the job. Most teams treat it like it is.',
    date: '2026-09-04',
    thumbnail: '/blog/follow-up-is-a-system.png',
    trade: 'product',
    wordCount: 390,
    related: ['who-answers-the-customer', 'how-fast-to-reply-whatsapp', 'what-is-proxe'],
  },
  {
    slug: 'conversation-that-books',
    title: 'A conversation that books',
    dek: 'A reply is not a booking. Most first messages are a thanks, a brochure, or a link.',
    date: '2026-09-09',
    thumbnail: '/blog/conversation-that-books.png',
    trade: 'product',
    wordCount: 511,
    related: ['who-answers-the-customer', 'follow-up-is-a-system', 'how-fast-to-reply-whatsapp'],
  },
  {
    slug: 'instagram-engagement-is-not-a-lead',
    title: 'Instagram engagement is not a lead',
    dek: 'A like is not a booking. A comment is not a booking.',
    date: '2026-09-11',
    thumbnail: '/blog/instagram-engagement-is-not-a-lead.png',
    trade: 'product',
    wordCount: 620,
    related: ['conversation-that-books', 'one-memory-every-channel', 'who-answers-the-customer'],
  },
  {
    slug: 'one-number-a-whole-team',
    title: 'One number is not a whole team',
    dek: "The business number lives on one phone. The owner.",
    date: '2026-09-16',
    thumbnail: '/blog/one-number-a-whole-team.png',
    trade: 'product',
    wordCount: 510,
    related: ['crm-wont-answer', 'home-services-on-a-job', 'one-memory-every-channel'],
  },
  {
    slug: 'what-to-measure-on-inbound',
    title: 'What to measure on inbound',
    dek: 'Most teams measure the wrong clock.',
    date: '2026-09-18',
    thumbnail: '/blog/what-to-measure-on-inbound.png',
    trade: 'product',
    wordCount: 410,
    related: ['how-fast-to-reply-whatsapp', 'people-miss-conversations', 'what-is-proxe', 'follow-up-is-a-system'],
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/**
 * Get related posts for a given slug. If the post has a `related` array,
 * returns those specific posts in order. Otherwise, returns other published
 * posts in reverse chronological order (most recent first).
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const currentPost = getBlogPost(currentSlug);
  
  // If post has custom related slugs, use those
  if (currentPost?.related && currentPost.related.length > 0) {
    return currentPost.related
      .map((slug) => getBlogPost(slug))
      .filter((p): p is BlogPost => p !== undefined)
      .slice(0, limit);
  }
  
  // Otherwise, fall back to reverse chronological
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/**
 * Get recent posts (excluding current if provided).
 */
export function getRecentPosts(currentSlug: string | null = null, limit: number = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

/**
 * Get previous and next posts in chronological order.
 */
export function getPrevNextPosts(currentSlug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const sorted = [...BLOG_POSTS].sort((a, b) => a.date.localeCompare(b.date));
  const currentIndex = sorted.findIndex((p) => p.slug === currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
  };
}

/**
 * Format a YYYY-MM-DD date string for display in blog posts.
 */
export function formatBlogDate(dateStr: string): string {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time in minutes from word count (200 words/min, ceil).
 */
export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

/**
 * Get trade display label.
 */
export function getTradeLabel(trade: Trade): string {
  const labels: Record<Trade, string> = {
    healthcare: 'Healthcare',
    coaching: 'Coaching',
    realestate: 'Real estate',
    wellness: 'Wellness',
    'home-services': 'Home services',
    professional: 'Professional',
    product: 'Product',
  };
  return labels[trade];
}

/**
 * Filter posts by trade. Returns all posts if trade is 'all'.
 */
export function filterPostsByTrade(trade: Trade | 'all'): BlogPost[] {
  if (trade === 'all') {
    return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  }
  return BLOG_POSTS.filter((p) => p.trade === trade).sort((a, b) => b.date.localeCompare(a.date));
}
