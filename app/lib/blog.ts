/**
 * Blog posts registry - single source of truth for all published posts.
 * Drives the /blog index, sitemap, and post chrome (related/recent/prev/next).
 */

export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  date: string; // YYYY-MM-DD
  thumbnail: string; // path to image
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'people-miss-conversations',
    title: 'People miss conversations. Then they lose the lead.',
    dek: 'WhatsApp leads go cold overnight. Clinics, coaches, and brokers miss the chat. How fast to reply, what after-hours enquiries do, and how to stop the leak.',
    date: '2026-08-25',
    thumbnail: '/home/Conversations.webp',
  },
  {
    slug: 'what-is-proxe',
    title: 'What is PROXe?',
    dek: 'PROXe answers, qualifies, books and follows up on every lead, on every channel.',
    date: '2026-08-30',
    thumbnail: '/home/Leads.webp',
  },
  {
    slug: 'crm-wont-answer',
    title: 'Your CRM will not answer that WhatsApp',
    dek: 'A CRM stores the lead. It does not answer, qualify, book, or follow up. That is why the chat still sits.',
    date: '2026-08-30',
    thumbnail: '/home/Leads.webp',
  },
  {
    slug: 'not-a-whatsapp-bot',
    title: 'PROXe is not a WhatsApp chatbot',
    dek: 'A chatbot dumps FAQs on one channel. PROXe answers, qualifies, books and follows up, on every channel, with one memory.',
    date: '2026-08-30',
    thumbnail: '/home/Leads.webp',
  },
  {
    slug: 'after-hours-whatsapp',
    title: 'After-hours WhatsApp is how you lose the lead',
    dek: 'They wrote at 11pm. An away message is not an answer. Answer, qualify, book. Do not wait until morning.',
    date: '2026-08-30',
    thumbnail: '/home/Leads.webp',
  },
  {
    slug: 'how-fast-to-reply-whatsapp',
    title: 'How fast should you reply to a WhatsApp lead',
    dek: 'First useful reply gets the slot. Thanks, we will call you, is not a reply.',
    date: '2026-08-30',
    thumbnail: '/home/Conversations.webp',
  },
  {
    slug: 'one-memory-every-channel',
    title: 'One lead, four channels, one memory',
    dek: 'WhatsApp Monday. Instagram Thursday. Site Saturday. Call later. Same person. They should never repeat themselves.',
    date: '2026-08-30',
    thumbnail: '/home/Leads.webp',
  },
  {
    slug: 'clinics-whatsapp-during-consult',
    title: 'They WhatsApped while you were in consult. The clinic that answered got the patient.',
    dek: 'Clinic inbound dies in the chair, at night, and on the missed call. Answer, qualify, book. Do not wait until the next gap.',
    date: '2026-08-30',
    thumbnail: '/home/Conversations.webp',
  },
];

export const BLOG_SLUGS = BLOG_POSTS.map((p) => p.slug);

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/**
 * Get related posts for a given slug. For now, returns other published posts
 * in reverse chronological order (most recent first).
 */
export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
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
