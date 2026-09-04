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
    slug: 'noted-is-not-a-next-line',
    title: 'Noted is not a next line',
    dek: 'Parking the ask is not the next line.',
    date: '2026-09-04',
    thumbnail: '/blog/noted-is-not-a-next-line.png',
    trade: 'product',
    wordCount: 450,
    related: ['ill-get-back-to-you-is-not-a-reply', 'seen-is-not-a-reply', 'a-status-is-not-a-message'],
  },
  {
    slug: 'a-reschedule-needs-a-slot',
    title: 'A reschedule needs a slot',
    dek: 'Let\'s move it is not done.',
    date: '2026-09-04',
    thumbnail: '/blog/a-reschedule-needs-a-slot.png',
    trade: 'product',
    wordCount: 450,
    related: ['a-no-show-is-still-a-lead', 'the-calendar-is-not-the-desk', 'after-they-book', 'silence-is-not-a-decision'],
  },
  {
    slug: 'the-group-chat-is-not-the-desk',
    title: 'The group chat is not the desk',
    dek: 'Staff chatter is not the lead thread.',
    date: '2026-09-04',
    thumbnail: '/blog/the-group-chat-is-not-the-desk.png',
    trade: 'product',
    wordCount: 450,
    related: ['two-people-one-lead', 'when-they-ask-for-a-person', 'handoff-without-starting-over', 'seen-is-not-a-reply'],
  },
  {
    slug: 'a-no-show-is-still-a-lead',
    title: 'A no-show is still a lead',
    dek: 'Empty chair is not closed.',
    date: '2026-09-04',
    thumbnail: '/blog/a-no-show-is-still-a-lead.png',
    trade: 'product',
    wordCount: 450,
    related: ['after-they-book', 'a-reschedule-needs-a-slot', 'silence-is-not-a-decision', 'follow-up-is-a-system'],
  },
  {
    slug: 'seen-is-not-a-reply',
    title: 'Seen is not a reply',
    dek: 'Blue ticks are not the desk.',
    date: '2026-09-04',
    thumbnail: '/blog/seen-is-not-a-reply.png',
    trade: 'product',
    wordCount: 450,
    related: ['silence-is-not-a-decision', 'ill-get-back-to-you-is-not-a-reply', 'closing-the-inbox-is-not-done', 'follow-up-is-a-system'],
  },
  {
    slug: 'closing-the-inbox-is-not-done',
    title: 'Closing the inbox is not done',
    dek: 'Zero unread is not zero open leads.',
    date: '2026-09-04',
    thumbnail: '/blog/closing-the-inbox-is-not-done.png',
    trade: 'product',
    wordCount: 450,
    related: ['a-status-is-not-a-message', 'silence-is-not-a-decision', 'follow-up-is-a-system', 'ill-get-back-to-you-is-not-a-reply'],
  },
  {
    slug: 'two-people-one-lead',
    title: 'Two people, one lead',
    dek: 'Two humans on the same chat is not coverage.',
    date: '2026-09-04',
    thumbnail: '/blog/two-people-one-lead.png',
    trade: 'product',
    wordCount: 450,
    related: ['one-number-a-whole-team', 'handoff-without-starting-over', 'when-they-ask-for-a-person', 'conversation-that-books'],
  },
  {
    slug: 'a-status-is-not-a-message',
    title: 'A status is not a message',
    dek: 'The CRM moved. The lead did not hear you.',
    date: '2026-09-04',
    thumbnail: '/blog/a-status-is-not-a-message.png',
    trade: 'product',
    wordCount: 450,
    related: ['ill-get-back-to-you-is-not-a-reply', 'silence-is-not-a-decision', 'follow-up-is-a-system', 'qualify-before-you-book'],
  },
  {
    slug: 'ill-get-back-to-you-is-not-a-reply',
    title: 'I\'ll get back to you is not a reply',
    dek: 'Parking language is not the desk.',
    date: '2026-09-04',
    thumbnail: '/blog/ill-get-back-to-you-is-not-a-reply.png',
    trade: 'product',
    wordCount: 450,
    related: ['silence-is-not-a-decision', 'qualify-before-you-book', 'when-they-ask-for-a-person', 'follow-up-is-a-system'],
  },
  {
    slug: 'when-they-ask-for-a-person',
    title: 'When they ask for a person',
    dek: '"Can I talk to someone" is not a dump. The desk still asks, then hands the thread over.',
    date: '2026-09-04',
    thumbnail: '/blog/when-they-ask-for-a-person.png',
    trade: 'product',
    wordCount: 450,
    related: ['handoff-without-starting-over', 'qualify-before-you-book', 'one-memory-every-channel', 'who-answers-the-customer'],
  },
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
    date: '2026-09-01',
    thumbnail: '/blog/follow-up-is-a-system.png',
    trade: 'product',
    wordCount: 390,
    related: ['who-answers-the-customer', 'how-fast-to-reply-whatsapp', 'what-is-proxe'],
  },
  {
    slug: 'conversation-that-books',
    title: 'A conversation that books',
    dek: 'A reply is not a booking. Most first messages are a thanks, a brochure, or a link.',
    date: '2026-09-01',
    thumbnail: '/blog/conversation-that-books.png',
    trade: 'product',
    wordCount: 511,
    related: ['who-answers-the-customer', 'follow-up-is-a-system', 'how-fast-to-reply-whatsapp'],
  },
  {
    slug: 'instagram-engagement-is-not-a-lead',
    title: 'Instagram engagement is not a lead',
    dek: 'A like is not a booking. A comment is not a booking.',
    date: '2026-09-01',
    thumbnail: '/blog/instagram-engagement-is-not-a-lead.png',
    trade: 'product',
    wordCount: 620,
    related: ['conversation-that-books', 'one-memory-every-channel', 'who-answers-the-customer'],
  },
  {
    slug: 'one-number-a-whole-team',
    title: 'One number is not a whole team',
    dek: "The business number lives on one phone. The owner.",
    date: '2026-09-02',
    thumbnail: '/blog/one-number-a-whole-team.png',
    trade: 'product',
    wordCount: 510,
    related: ['crm-wont-answer', 'home-services-on-a-job', 'one-memory-every-channel'],
  },
  {
    slug: 'what-to-measure-on-inbound',
    title: 'What to measure on inbound',
    dek: 'Most teams measure the wrong clock.',
    date: '2026-09-02',
    thumbnail: '/blog/what-to-measure-on-inbound.png',
    trade: 'product',
    wordCount: 410,
    related: ['how-fast-to-reply-whatsapp', 'people-miss-conversations', 'what-is-proxe', 'follow-up-is-a-system'],
  },
  {
    slug: 'the-website-is-not-the-desk',
    title: 'The website is not the desk',
    dek: 'A form is not a booking.',
    date: '2026-09-02',
    thumbnail: '/blog/the-website-is-not-the-desk.png',
    trade: 'product',
    wordCount: 450,
    related: ['conversation-that-books', 'what-to-measure-on-inbound', 'what-is-proxe', 'who-answers-the-customer'],
  },
  {
    slug: 'a-missed-call-is-still-a-lead',
    title: 'A missed call is still a lead',
    dek: 'A ring is not a booking.',
    date: '2026-09-02',
    thumbnail: '/blog/a-missed-call-is-still-a-lead.png',
    trade: 'product',
    wordCount: 450,
    related: ['after-hours-whatsapp', 'how-fast-to-reply-whatsapp', 'who-answers-the-customer', 'conversation-that-books'],
  },
  {
    slug: 'handoff-without-starting-over',
    title: 'Handoff without starting over',
    dek: 'A handoff is not a new chat.',
    date: '2026-09-03',
    thumbnail: '/blog/handoff-without-starting-over.png',
    trade: 'product',
    wordCount: 450,
    related: ['one-memory-every-channel', 'one-number-a-whole-team', 'crm-wont-answer', 'conversation-that-books'],
  },
  {
    slug: 'after-they-book',
    title: 'After they book',
    dek: 'A booking is not the end.',
    date: '2026-09-03',
    thumbnail: '/blog/after-they-book.png',
    trade: 'product',
    wordCount: 450,
    related: ['conversation-that-books', 'follow-up-is-a-system', 'what-to-measure-on-inbound', 'handoff-without-starting-over'],
  },
  {
    slug: 'dont-invent-the-price',
    title: 'Do not invent the price',
    dek: 'A fee you made up is not a booking.',
    date: '2026-09-03',
    thumbnail: '/blog/dont-invent-the-price.png',
    trade: 'product',
    wordCount: 450,
    related: ['conversation-that-books', 'handoff-without-starting-over', 'what-is-proxe', 'the-website-is-not-the-desk'],
  },
  {
    slug: 'the-calendar-is-not-the-desk',
    title: 'The calendar is not the desk',
    dek: 'A link is not a booking.',
    date: '2026-09-03',
    thumbnail: '/blog/the-calendar-is-not-the-desk.png',
    trade: 'product',
    wordCount: 450,
    related: ['conversation-that-books', 'the-website-is-not-the-desk', 'instagram-engagement-is-not-a-lead', 'dont-invent-the-price'],
  },
  {
    slug: 'the-ad-is-not-the-desk',
    title: 'The ad is not the desk',
    dek: 'A click is not a booking.',
    date: '2026-09-03',
    thumbnail: '/blog/the-ad-is-not-the-desk.png',
    trade: 'product',
    wordCount: 450,
    related: ['paid-lead-no-reply', 'who-answers-the-customer', 'what-to-measure-on-inbound', 'the-website-is-not-the-desk'],
  },
  {
    slug: 'silence-is-not-a-decision',
    title: 'Silence is not a decision',
    dek: 'No reply is not a no.',
    date: '2026-09-03',
    thumbnail: '/blog/silence-is-not-a-decision.png',
    trade: 'product',
    wordCount: 450,
    related: ['follow-up-is-a-system', 'after-they-book', 'what-to-measure-on-inbound', 'conversation-that-books'],
  },
  {
    slug: 'qualify-before-you-book',
    title: 'Qualify before you book',
    dek: 'A reply is not a qualified lead.',
    date: '2026-09-03',
    thumbnail: '/blog/qualify-before-you-book.png',
    trade: 'product',
    wordCount: 450,
    related: ['conversation-that-books', 'dont-invent-the-price', 'the-calendar-is-not-the-desk', 'who-answers-the-customer'],
  },
  {
    slug: 'email-is-not-the-desk',
    title: 'Email is not the desk',
    dek: 'The enquiry is the thread they already opened.',
    date: '2026-09-03',
    thumbnail: '/blog/email-is-not-the-desk.png',
    trade: 'product',
    wordCount: 450,
    related: ['one-memory-every-channel', 'how-fast-to-reply-whatsapp', 'who-answers-the-customer', 'qualify-before-you-book'],
  },
  {
    slug: 'a-broadcast-is-not-a-reply',
    title: 'A broadcast is not a reply',
    dek: 'A blast is marketing. Inbound still needs a reply in their thread.',
    date: '2026-09-03',
    thumbnail: '/blog/a-broadcast-is-not-a-reply.png',
    trade: 'product',
    wordCount: 450,
    related: ['the-ad-is-not-the-desk', 'follow-up-is-a-system', 'who-answers-the-customer', 'qualify-before-you-book'],
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
