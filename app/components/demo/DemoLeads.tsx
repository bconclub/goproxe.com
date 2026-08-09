'use client';

import { FiX } from 'react-icons/fi';
import type { Industry } from '../../lib/industries';
import type { SimAction, SimState } from './sim/store';
import { mulberry32, hashString, between, pick } from './sim/rng';

function ago(minutes: number): string {
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

/** Leads table + detail drawer. The drawer's timeline is generated on demand
    from the lead id, so 22 histories don't need pre-building. */
export default function DemoLeads({
  industry,
  state,
  dispatch,
  onInteract,
}: {
  industry: Industry;
  state: SimState;
  dispatch: React.Dispatch<SimAction>;
  onInteract: (what: 'lead_open' | 'chat_send' | 'widget_send') => void;
}) {
  const d = industry.demo;
  const active = state.leads.find((l) => l.id === state.activeLeadId) ?? null;

  const timeline = active
    ? (() => {
        const rng = mulberry32(hashString(active.id));
        const noun = d.bookingNoun.toLowerCase();
        const items = [
          { text: `Lead captured from ${active.source} — PROXe replied in ${between(rng, 3, 14)}s`, when: `${active.minutesAgo || 1}m ago` },
          { text: pick(rng, [`Asked: “${pick(rng, d.inquiries)}”`, `Qualified — intent detected in conversation`, `Details captured: name, phone, requirement`]), when: `${Math.max(1, (active.minutesAgo || 2) - between(rng, 0, 30))}m ago` },
        ];
        if (active.booked) items.push({ text: `${d.bookingNoun} confirmed — reminder sequence armed`, when: 'today' });
        else items.push({ text: `Follow-up scheduled — next nudge in ${between(rng, 2, 20)}h`, when: 'today' });
        if (rng() > 0.5) items.push({ text: `Score updated to ${active.score} — ${active.score > 70 ? 'high intent' : 'warming up'}`, when: 'today' });
        return items.map((it) => ({ ...it, noun }));
      })()
    : [];

  return (
    <>
      <div className="demo-leads" data-tour="leads">
        <div className="demo-pane-title">All leads — captured, scored, followed up</div>
        <table className="demo-table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Source</th>
              <th>Score</th>
              <th>Stage</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {state.leads.map((l) => (
              <tr
                key={l.id}
                className={l.isNew ? 'demo-tr--new' : undefined}
                onClick={() => {
                  onInteract('lead_open');
                  dispatch({ type: 'OPEN_LEAD', leadId: l.id });
                }}
              >
                <td className="demo-lead-name">{l.name}</td>
                <td><span className="demo-src-chip">{l.source}</span></td>
                <td>
                  <span className="demo-score">
                    <span className="demo-score-bar"><span className="demo-score-fill" style={{ width: `${l.score}%` }} /></span>
                    {l.score}
                  </span>
                </td>
                <td><span className="demo-stage-chip">{d.stages[Math.min(l.stage, d.stages.length - 1)]}</span></td>
                <td className="demo-ago">{ago(l.minutesAgo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {active && (
        <>
          <div className="demo-drawer-scrim" onClick={() => dispatch({ type: 'OPEN_LEAD', leadId: null })} />
          <div className="demo-drawer">
            <button
              type="button"
              className="demo-drawer-close"
              aria-label="Close"
              onClick={() => dispatch({ type: 'OPEN_LEAD', leadId: null })}
            ><FiX size={15} /></button>
            <h3>{active.name}</h3>
            <p className="demo-drawer-sub">{active.source} · first seen {ago(active.minutesAgo)}</p>
            <div className="demo-drawer-stats">
              <div className="demo-drawer-stat"><b>{active.score}</b><span>Lead score</span></div>
              <div className="demo-drawer-stat"><b>{d.stages[Math.min(active.stage, d.stages.length - 1)]}</b><span>Stage</span></div>
            </div>
            <div className="demo-pane-title">Timeline</div>
            <div className="demo-timeline">
              {timeline.map((t, i) => (
                <div key={i} className="demo-timeline-item">
                  {t.text}
                  <small>{t.when}</small>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
