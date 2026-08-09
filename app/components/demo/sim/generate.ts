import type { Industry } from '../../../lib/industries';
import { mulberry32, hashString, pick, between } from './rng';
import type { SimLead, SimThread, SimMsg, SimState, Source } from './store';

/**
 * Build the demo's opening state — a business already mid-day.
 *
 * Deterministic per industry: the rng is seeded from the slug, so two visits
 * to /demo/clinics open on the identical set of leads and threads. Timestamps
 * are relative offsets ("14m ago"), so it always reads fresh without breaking
 * that determinism.
 */

let idCounter = 0;
export function nextId(prefix: string): string {
  // Monotonic, not random — ids must be unique but need no entropy.
  idCounter += 1;
  return `${prefix}_${idCounter}`;
}

export function buildInitialState(industry: Industry): SimState {
  const rng = mulberry32(hashString(industry.slug));
  const d = industry.demo;
  const stageCount = d.stages.length;

  // ~22 leads spread across the pipeline, hottest first.
  const personas = [...d.personas];
  const leads: SimLead[] = [];
  const threads: SimThread[] = [];
  const count = 22;

  for (let i = 0; i < count; i++) {
    // Cycle personas with a numbered suffix once exhausted, so names stay
    // plausible even with more leads than names.
    const base = personas[i % personas.length];
    const name = i < personas.length ? base : `${base.split(' ')[0]} ${String.fromCharCode(65 + (i % 26))}.`;
    const source = pick(rng, d.sources) as Source;
    const lead: SimLead = {
      id: nextId('lead'),
      name,
      source,
      score: between(rng, 22, 96),
      stage: between(rng, 0, stageCount - 1),
      minutesAgo: between(rng, 2, 420),
      booked: rng() > 0.72,
    };

    // The 7 most recent leads carry live chat threads.
    if (i < 7) {
      const inquiry = d.inquiries[i % d.inquiries.length];
      const reply = d.aiReplies[i % d.aiReplies.length];
      const now = Date.now();
      const baseAt = now - lead.minutesAgo * 60_000;
      const msgs: SimMsg[] = [
        { id: nextId('m'), role: 'customer', text: inquiry, at: baseAt },
        { id: nextId('m'), role: 'proxe', text: reply, at: baseAt + 40_000 },
      ];
      // Some threads have a further customer turn, so the inbox reads alive.
      if (rng() > 0.4) {
        msgs.push({
          id: nextId('m'),
          role: 'customer',
          text: pick(rng, d.userReplyPool),
          at: baseAt + 110_000,
        });
      }
      const thread: SimThread = {
        id: nextId('th'),
        leadId: lead.id,
        name: lead.name,
        source: lead.source,
        msgs,
        typing: false,
        unread: rng() > 0.6 ? 1 : 0,
      };
      lead.threadId = thread.id;
      threads.push(thread);
    }
    leads.push(lead);
  }

  // Sort by recency — the table reads newest first.
  leads.sort((a, b) => a.minutesAgo - b.minutesAgo);

  return {
    leads,
    threads,
    toasts: [],
    metrics: {
      m1: between(rng, 9, 24),   // bookings today
      m2: between(rng, 14, 38),  // captured / prevented
      m3: between(rng, 6, 19),   // third label
      m4: `${between(rng, 4, 12)}s`, // avg response time
    },
    view: 'inbox',
    activeThreadId: threads[0]?.id ?? null,
    activeLeadId: null,
  };
}
