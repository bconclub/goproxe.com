'use client';

import { useCallback, useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import type { Industry } from '../../lib/industries';
import { track } from '../../lib/analytics';
import type { SimAction, ViewId } from './sim/store';
import { deployHref } from './DemoApp';

/**
 * Hand-rolled spotlight tour — no library. A fixed div with a huge box-shadow
 * darkens everything except the target's rect; the tooltip card positions
 * itself beside the cutout with basic flip logic. Steps can switch the
 * dashboard view before measuring.
 *
 * Auto-starts once per session; the "?" in the topbar restarts it.
 */
type Step = {
  target: string;
  title: string;
  body: string;
  view?: ViewId;
  /** Preferred tooltip side. */
  side: 'right' | 'left' | 'bottom';
};

const STEPS: Step[] = [
  {
    target: '[data-tour="badge"]',
    title: 'A business like yours, mid-day',
    body: 'Everything here is a live simulation — leads arriving, chats being answered, bookings landing. Watch for a minute; it moves on its own.',
    side: 'bottom',
  },
  {
    target: '[data-tour="threads"]',
    title: 'Every conversation, one inbox',
    body: 'WhatsApp, website, Instagram, calls — every channel lands here, answered by PROXe in seconds. The unread badges are it working right now.',
    view: 'inbox',
    side: 'right',
  },
  {
    target: '[data-tour="chat"]',
    title: 'PROXe does the talking',
    body: 'Open any thread: instant, useful replies, in the customer’s language. Type in the box — you can jump in as the owner any time.',
    view: 'inbox',
    side: 'left',
  },
  {
    target: '[data-tour="widget"]',
    title: 'Try being the customer',
    body: 'This is the business’s own website. Send a message as a visitor and watch yourself appear in the inbox — captured, scored, answered.',
    view: 'inbox',
    side: 'left',
  },
  {
    target: '[data-tour="pipeline"]',
    title: 'Leads move themselves',
    body: 'Captured → qualified → booked. PROXe scores intent and keeps every lead moving with follow-ups nobody has to remember.',
    view: 'pipeline',
    side: 'bottom',
  },
  {
    target: '[data-tour="deploy"]',
    title: 'Now deploy it on YOUR business',
    body: 'Everything you just watched — trained on your services, your prices, your tone. Live in about a week.',
    side: 'bottom',
  },
];

const DONE_KEY = 'proxe_demo_tour_done';

export default function DemoTour({
  industry,
  dispatch,
}: {
  industry: Industry;
  dispatch: React.Dispatch<SimAction>;
}) {
  const [step, setStep] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Auto-start once per session, after the dashboard settles.
  useEffect(() => {
    if (sessionStorage.getItem(DONE_KEY)) return;
    const t = setTimeout(() => setStep(0), 1600);
    return () => clearTimeout(t);
  }, []);

  // Topbar "?" restarts.
  useEffect(() => {
    const restart = () => setStep(0);
    window.addEventListener('demo-tour-restart', restart);
    return () => window.removeEventListener('demo-tour-restart', restart);
  }, []);

  // Measure the current target (after switching view if the step asks).
  useEffect(() => {
    if (step === null) return;
    const s = STEPS[step];
    if (s.view) dispatch({ type: 'SET_VIEW', view: s.view });
    // setTimeout, NOT requestAnimationFrame: rAF never fires in a hidden or
    // non-compositing tab, which would leave the tour permanently unmeasured
    // if the page loads in the background. 50ms is enough for React to mount
    // the switched view; retry until the target exists.
    let timer: ReturnType<typeof setTimeout> | null = null;
    const measure = () => {
      const el = document.querySelector(s.target);
      const r = el?.getBoundingClientRect();
      // A 0-rect is a lie, not a position: mid-layout, display:none at this
      // breakpoint, or a tab restored from the background. Locking the
      // spotlight onto it strands the tour at the viewport corner — keep
      // polling until the target has real geometry.
      if (r && (r.width > 0 || r.height > 0)) setRect(r);
      else timer = setTimeout(measure, 200);
    };
    timer = setTimeout(measure, 50);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [step, dispatch]);

  const finish = useCallback(
    (completed: boolean) => {
      sessionStorage.setItem(DONE_KEY, '1');
      if (completed) track('demo_tour_complete', { industry: industry.slug });
      setStep(null);
      setRect(null);
    },
    [industry.slug]
  );

  const next = () => {
    if (step === null) return;
    if (step >= STEPS.length - 1) {
      finish(true);
      return;
    }
    track('demo_tour_step', { industry: industry.slug, step: step + 1 });
    setStep(step + 1);
  };

  if (step === null || !rect) return null;
  const s = STEPS[step];
  const last = step === STEPS.length - 1;

  // Tooltip placement with viewport-edge flips.
  const pad = 10;
  const cardW = 310;
  const cardH = 190;
  let top = 0;
  let left = 0;
  if (s.side === 'bottom') {
    top = rect.bottom + pad;
    left = Math.min(Math.max(rect.left, 12), window.innerWidth - cardW - 12);
    if (top + cardH > window.innerHeight) top = rect.top - cardH - pad;
  } else if (s.side === 'right') {
    left = rect.right + pad;
    top = Math.min(Math.max(rect.top, 12), window.innerHeight - cardH - 12);
    if (left + cardW > window.innerWidth) left = rect.left - cardW - pad;
  } else {
    left = rect.left - cardW - pad;
    top = Math.min(Math.max(rect.top, 12), window.innerHeight - cardH - 12);
    if (left < 0) left = rect.right + pad;
  }

  return (
    <>
      <div
        className="demo-tour-spot"
        style={{
          top: rect.top - 6,
          left: rect.left - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      />
      <div className="demo-tour-card" style={{ top, left }}>
        <div className="demo-tour-step">STEP {step + 1} OF {STEPS.length}</div>
        <h4>{s.title}</h4>
        <p>{s.body}</p>
        <div className="demo-tour-row">
          {last ? (
            <a
              className="demo-tour-next"
              href={deployHref(industry.slug)}
              onClick={() => {
                track('demo_deploy_click', { industry: industry.slug, placement: 'tour' });
                finish(true);
              }}
            >
              Deploy PROXe <FiArrowRight size={13} />
            </a>
          ) : (
            <button type="button" className="demo-tour-next" onClick={next}>
              Next <FiArrowRight size={13} />
            </button>
          )}
          <button type="button" className="demo-tour-skip" onClick={() => finish(last)}>
            {last ? 'Keep exploring' : 'Skip tour'}
          </button>
        </div>
      </div>
    </>
  );
}
