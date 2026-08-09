'use client';

import { useEffect, useRef } from 'react';
import type { Industry } from '../../../lib/industries';
import type { SimAction, SimState, Source } from './store';
import { mulberry32, hashString, pick, between } from './rng';
import { nextId } from './generate';

/**
 * The heartbeat: every 3.5–9s (seeded jitter) one event lands — a new lead, a
 * chat message ticking in behind a typing indicator, a score climbing, a
 * booking, a pipeline move. Weighted toward the visible, chatty events.
 *
 * A single setTimeout chain (not setInterval): each tick schedules the next,
 * cleanup cancels exactly one pending timer, and StrictMode's double-mount in
 * dev is handled by the cleanup — the first mount's chain dies before the
 * second starts. Pauses while the tab is hidden.
 */
export function useSimulation(
  industry: Industry,
  stateRef: React.MutableRefObject<SimState>,
  dispatch: React.Dispatch<SimAction>
) {
  const started = useRef(false);

  useEffect(() => {
    // Event ORDER is seeded (offset so it doesn't mirror the initial state);
    // only the inter-event delays vary run to run.
    const rng = mulberry32(hashString(industry.slug) ^ 0x9e3779b9);
    const d = industry.demo;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let dead = false;
    let personaCursor = d.personas.length - 1; // walk backwards → fresh names first

    const schedule = (ms: number, fn: () => void) => {
      timer = setTimeout(() => {
        if (dead) return;
        if (document.visibilityState === 'hidden') {
          // Hidden tab: check back later rather than piling up events.
          schedule(3000, fn);
          return;
        }
        fn();
      }, ms);
    };

    const tick = () => {
      const s = stateRef.current;
      const roll = rng();

      if (roll < 0.28) {
        // ── NEW LEAD ──
        personaCursor = (personaCursor + 1) % d.personas.length;
        const name = d.personas[personaCursor];
        const source = pick(rng, d.sources) as Source;
        const leadId = nextId('lead');
        const inquiry = pick(rng, d.inquiries);
        const threadId = nextId('th');
        dispatch({
          type: 'NEW_LEAD',
          lead: { id: leadId, name, source, score: between(rng, 30, 55), stage: 0, minutesAgo: 0, threadId },
          thread: {
            id: threadId,
            leadId,
            name,
            source,
            msgs: [{ id: nextId('m'), role: 'customer', text: inquiry, at: Date.now() }],
            typing: false,
            unread: 1,
          },
          toast: { id: nextId('t'), text: `New lead — ${name} · ${source}`, kind: 'lead' },
        });
        // PROXe answers it a beat later, typing first.
        schedule(1400, () => {
          dispatch({ type: 'TYPING', threadId, on: true });
          schedule(1600, () => {
            dispatch({
              type: 'CHAT_MSG',
              threadId,
              msg: { id: nextId('m'), role: 'proxe', text: pick(rng, d.aiReplies), at: Date.now() },
            });
            dispatch({ type: 'METRIC_BUMP', key: 'm3' });
            queueNext();
          });
        });
        return; // queueNext happens after the reply lands
      } else if (roll < 0.55 && s.threads.length > 0) {
        // ── CHAT MESSAGE in an existing thread ──
        const th = pick(rng, s.threads.slice(0, 5));
        const customerTurn = th.msgs[th.msgs.length - 1]?.role !== 'customer';
        dispatch({ type: 'TYPING', threadId: th.id, on: true });
        schedule(1300, () => {
          dispatch({
            type: 'CHAT_MSG',
            threadId: th.id,
            msg: {
              id: nextId('m'),
              role: customerTurn ? 'customer' : 'proxe',
              text: customerTurn ? pick(rng, d.userReplyPool) : pick(rng, d.aiReplies),
              at: Date.now(),
            },
          });
          queueNext();
        });
        return;
      } else if (roll < 0.75 && s.leads.length > 0) {
        // ── SCORE CLIMB on a visible lead ──
        const lead = pick(rng, s.leads.slice(0, 8));
        dispatch({ type: 'SCORE_TICK', leadId: lead.id, delta: between(rng, 3, 8) });
      } else if (roll < 0.88 && s.leads.length > 0) {
        // ── BOOKING LANDS ──
        const candidates = s.leads.filter((l) => !l.booked).slice(0, 10);
        if (candidates.length) {
          const lead = pick(rng, candidates);
          dispatch({
            type: 'BOOKING',
            leadId: lead.id,
            toast: { id: nextId('t'), text: `${d.bookingNoun} booked — ${lead.name}`, kind: 'booking' },
          });
        }
      } else if (s.leads.length > 0) {
        // ── PIPELINE MOVE ──
        const movable = s.leads.filter((l) => l.stage < d.stages.length - 1);
        if (movable.length) dispatch({ type: 'STAGE_MOVE', leadId: pick(rng, movable).id });
      }
      queueNext();
    };

    const queueNext = () => schedule(3500 + rng() * 5500, tick);

    // First event arrives quickly so the "it's alive" moment is early.
    started.current = true;
    schedule(2200, tick);

    // Dev-only escape hatch: hidden tabs clamp chained timers to ~1/min, so
    // automated checks can't watch the heartbeat. window.__simTick() fires one
    // event on demand. Stripped from production bundles by the env check.
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { __simTick?: () => void }).__simTick = () => tick();
    }

    return () => {
      dead = true;
      if (timer) clearTimeout(timer);
    };
  }, [industry, dispatch, stateRef]);
}
