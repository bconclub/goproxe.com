'use client';

import { useEffect, useReducer, useRef, useCallback } from 'react';
import {
  FiInbox, FiUsers, FiTrello, FiBarChart2, FiArrowRight, FiUserPlus, FiCalendar, FiMessageCircle,
} from 'react-icons/fi';
import { getIndustry, type Industry } from '../../lib/industries';
import { track } from '../../lib/analytics';
import { simReducer, type SimState, type ViewId } from './sim/store';
import { buildInitialState } from './sim/generate';
import { useSimulation } from './sim/useSimulation';
import DemoInbox from './DemoInbox';
import DemoLeads from './DemoLeads';
import DemoPipeline from './DemoPipeline';
import DemoMetrics from './DemoMetrics';
import DemoTour from './DemoTour';

/**
 * The demo dashboard — a purpose-built replica of the PROXe dashboard fed by
 * a seeded simulation. See sim/store.ts for the self-containment rule: no
 * real APIs, no real leads, nothing to leak.
 *
 * Where you land: goproxe.com/?utm...#pricing. The demo runs on another host
 * (demo.goproxe.com), so the deploy CTA is a plain absolute link in prod and
 * a relative one in dev.
 */
const NAV: Array<{ id: ViewId; label: string; Icon: React.ElementType }> = [
  { id: 'inbox', label: 'Inbox', Icon: FiInbox },
  { id: 'leads', label: 'Leads', Icon: FiUsers },
  { id: 'pipeline', label: 'Pipeline', Icon: FiTrello },
  { id: 'analytics', label: 'Analytics', Icon: FiBarChart2 },
];

export function deployHref(slug: string): string {
  const base = process.env.NODE_ENV === 'production' ? 'https://goproxe.com' : '';
  return `${base}/?utm_source=demo&utm_content=${slug}#pricing`;
}

export default function DemoApp({ slug }: { slug: string }) {
  // Resolved HERE, client-side — the server page passes only the slug because
  // the registry's Icon components are functions and cannot serialize.
  const industry = getIndustry(slug) as Industry;
  const [state, dispatch] = useReducer(simReducer, industry, buildInitialState);

  // The sim's timer callbacks need current state without re-arming on every
  // render — a ref bridged to the latest state does it.
  const stateRef = useRef<SimState>(state);
  stateRef.current = state;
  useSimulation(industry, stateRef, dispatch);

  // demo_start once per mount (StrictMode-guarded).
  const startFired = useRef(false);
  useEffect(() => {
    if (startFired.current) return;
    startFired.current = true;
    track('demo_start', { industry: industry.slug });
  }, [industry.slug]);

  // demo_interact — first occurrence of each interaction kind, per session.
  const interacted = useRef<Set<string>>(new Set());
  const interact = useCallback(
    (what: 'lead_open' | 'chat_send' | 'widget_send') => {
      if (interacted.current.has(what)) return;
      interacted.current.add(what);
      track('demo_interact', { industry: industry.slug, what });
    },
    [industry.slug]
  );

  // Toasts drain themselves — oldest goes after ~4s.
  useEffect(() => {
    if (!state.toasts.length) return;
    const oldest = state.toasts[state.toasts.length - 1];
    const t = setTimeout(() => dispatch({ type: 'DISMISS_TOAST', id: oldest.id }), 4200);
    return () => clearTimeout(t);
  }, [state.toasts]);

  const unread = state.threads.reduce((n, t) => n + t.unread, 0);
  const d = industry.demo;

  return (
    <div className="demo-shell" style={{ ['--acc' as string]: industry.color }}>
      {/* ── Topbar ── */}
      <header className="demo-top">
        <div className="demo-biz">
          <span className="demo-biz-ava">{d.business.initials}</span>
          <span>
            {d.business.name}
            <span className="demo-biz-tag"> · {d.business.tagline}</span>
          </span>
        </div>
        <span className="demo-live-badge" data-tour="badge">LIVE SIMULATION</span>
        <span className="demo-top-spacer" />
        <button
          type="button"
          className="demo-tour-btn"
          title="Restart the tour"
          onClick={() => window.dispatchEvent(new CustomEvent('demo-tour-restart'))}
        >?</button>
        <a
          className="demo-deploy"
          data-tour="deploy"
          href={deployHref(industry.slug)}
          onClick={() => track('demo_deploy_click', { industry: industry.slug, placement: 'topbar' })}
        >
          Deploy PROXe <FiArrowRight size={14} />
        </a>
      </header>

      <div className="demo-body">
        {/* ── Sidebar ── */}
        <nav className="demo-nav" data-tour="nav">
          {NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className="demo-nav-item"
              data-active={state.view === id}
              onClick={() => dispatch({ type: 'SET_VIEW', view: id })}
            >
              <Icon size={16} />
              <span>{label}</span>
              {id === 'inbox' && unread > 0 && <span className="demo-nav-unread">{unread}</span>}
            </button>
          ))}
          <p className="demo-nav-note">
            Simulated data. Every lead, chat and number here is generated — nothing is real.
          </p>
        </nav>

        {/* ── Main ── */}
        <main className="demo-main">
          {state.view === 'inbox' && (
            <DemoInbox industry={industry} state={state} dispatch={dispatch} onInteract={interact} />
          )}
          {state.view === 'leads' && (
            <DemoLeads industry={industry} state={state} dispatch={dispatch} onInteract={interact} />
          )}
          {state.view === 'pipeline' && <DemoPipeline industry={industry} state={state} />}
          {state.view === 'analytics' && <DemoMetrics industry={industry} state={state} />}
        </main>
      </div>

      {/* ── Toasts ── */}
      <div className="demo-toasts" aria-live="polite">
        {state.toasts.map((t) => (
          <div key={t.id} className="demo-toast">
            <span className="demo-toast-ico">
              {t.kind === 'lead' ? <FiUserPlus size={15} /> : t.kind === 'booking' ? <FiCalendar size={15} /> : <FiMessageCircle size={15} />}
            </span>
            {t.text}
          </div>
        ))}
      </div>

      <DemoTour industry={industry} dispatch={dispatch} />
    </div>
  );
}
