'use client';
import { useEffect, useRef, useState } from 'react';
import { SiWhatsapp, SiInstagram, SiMessenger } from 'react-icons/si';
import { FiGlobe, FiPhone, FiMail, FiInbox, FiBarChart2, FiUsers, FiSettings, FiBell } from 'react-icons/fi';

/* ── Score bar ── */
function ScoreBar({ score, max = 100 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color =
    score >= 80 ? '#7C3AED' :
    score >= 60 ? '#F59E0B' :
    score >= 40 ? '#0EA5E9' :
    '#9CA3AF';
  return (
    <div className="db-score-bar-wrap">
      <div className="db-score-bar-track">
        <div className="db-score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="db-score-num" style={{ color }}>{score}</span>
    </div>
  );
}

/* ── Channel icon ── */
function ChannelIcon({ ch }: { ch: string }) {
  const map: Record<string, { I: React.ElementType; color: string }> = {
    whatsapp:  { I: SiWhatsapp,  color: '#25D366' },
    instagram: { I: SiInstagram, color: '#E1306C' },
    web:       { I: FiGlobe,     color: '#0EA5E9' },
    phone:     { I: FiPhone,     color: '#F59E0B' },
    email:     { I: FiMail,      color: '#7C3AED' },
    messenger: { I: SiMessenger, color: '#0078FF' },
  };
  const { I, color } = map[ch] ?? { I: FiGlobe, color: '#9CA3AF' };
  return (
    <span className="db-ch-ico" style={{ background: `${color}22`, color }}>
      <I size={11} />
    </span>
  );
}

/* ── Stage badge ── */
function StageBadge({ stage }: { stage: string }) {
  const cls: Record<string, string> = {
    'Hot':        'db-stage--hot',
    'High Intent':'db-stage--hi',
    'Warm':       'db-stage--warm',
    'Follow-up':  'db-stage--fu',
    'New':        'db-stage--new',
  };
  return <span className={`db-stage ${cls[stage] ?? ''}`}>{stage}</span>;
}

const LEADS = [
  { name: 'Sara J.',  channel: 'instagram', score: 91, stage: 'Hot',         touch: '2m ago',  active: true  },
  { name: 'Rahul S.', channel: 'whatsapp',  score: 82, stage: 'High Intent', touch: '18m ago', active: true  },
  { name: 'Priya M.', channel: 'web',       score: 67, stage: 'Warm',        touch: '1h ago',  active: false },
  { name: 'Amit K.',  channel: 'phone',     score: 45, stage: 'Follow-up',   touch: '3h ago',  active: false },
  { name: 'Neha R.',  channel: 'email',     score: 28, stage: 'New',         touch: '5h ago',  active: false },
];

const ACTIVITY = [
  { icon: SiWhatsapp,  color: '#25D366', text: 'Rahul S. replied — "Yes still looking"',  time: '2m' },
  { icon: SiInstagram, color: '#E1306C', text: 'New lead Sara J. from Instagram DM',       time: '6m' },
  { icon: FiGlobe,     color: '#0EA5E9', text: 'Priya M. visited pricing page',            time: '22m' },
  { icon: FiPhone,     color: '#F59E0B', text: 'Missed call — Amit K. (auto follow-up sent)', time: '1h' },
];

export default function DashboardSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  const [newLeadStep, setNewLeadStep] = useState(0); // 0=hidden, 1=flash row, 2=normal

  useEffect(() => {
    const el = secRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true);
    }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Pulse the top lead row every ~5s */
  useEffect(() => {
    if (!vis) return;
    let dead = false;
    function pulse() {
      setNewLeadStep(1);
      setTimeout(() => { if (!dead) setNewLeadStep(2); }, 800);
      setTimeout(() => { if (!dead) pulse(); }, 5000);
    }
    const t = setTimeout(pulse, 1200);
    return () => { dead = true; clearTimeout(t); };
  }, [vis]);

  return (
    <section ref={secRef} className="db-section">
      <div className="proxe-container">
        {/* ── Header ── */}
        <div className={`proxe-section-label db-label${vis ? ' db-in' : ''}`}>The Dashboard</div>
        <h2 className={`db-h2${vis ? ' db-in' : ''}`} style={{ transitionDelay: '0.08s' }}>
          Your entire pipeline.<br />Always on screen.
        </h2>
        <p className={`db-sub${vis ? ' db-in' : ''}`} style={{ transitionDelay: '0.14s' }}>
          Every lead, every stage, every channel — tracked in real time. No spreadsheets. No guessing.
        </p>

        {/* ── Browser mockup ── */}
        <div className={`db-browser${vis ? ' db-in' : ''}`} style={{ transitionDelay: '0.22s' }}>
          {/* Browser chrome */}
          <div className="db-chrome">
            <div className="db-chrome-dots">
              <span /><span /><span />
            </div>
            <div className="db-chrome-bar">
              <span className="db-chrome-lock">🔒</span>
              <span className="db-chrome-url">app.proxe.ai/dashboard</span>
            </div>
            <div className="db-chrome-actions">
              <FiBell size={13} style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
          </div>

          {/* App window */}
          <div className="db-app">
            {/* Sidebar */}
            <nav className="db-sidebar">
              <div className="db-sidebar-logo">P</div>
              <div className="db-sidebar-nav">
                {[
                  { I: FiInbox,    active: true  },
                  { I: FiUsers,    active: false },
                  { I: FiBarChart2,active: false },
                  { I: FiSettings, active: false },
                ].map(({ I, active }, i) => (
                  <div key={i} className={`db-sidebar-ico${active ? ' db-sidebar-ico--active' : ''}`}>
                    <I size={16} />
                  </div>
                ))}
              </div>
            </nav>

            {/* Main */}
            <div className="db-main">
              {/* Top bar */}
              <div className="db-topbar">
                <div>
                  <div className="db-topbar-title">Dashboard</div>
                  <div className="db-topbar-sub">Monday, 12 May 2025</div>
                </div>
                <div className="db-topbar-badge">
                  <span className="db-topbar-live" />
                  Live
                </div>
              </div>

              {/* Metric cards */}
              <div className="db-metrics">
                {[
                  { label: 'Leads Today',       value: '24',    delta: '+6',    deltaPos: true  },
                  { label: 'Active Sequences',  value: '8',     delta: '3 live',deltaPos: true  },
                  { label: 'Closed Today',      value: '3',     delta: '₹2.1L', deltaPos: true  },
                  { label: 'Pipeline Value',    value: '₹12.4L',delta: '+18%',  deltaPos: true  },
                ].map(({ label, value, delta, deltaPos }) => (
                  <div key={label} className="db-metric-card">
                    <div className="db-metric-label">{label}</div>
                    <div className="db-metric-value">{value}</div>
                    <div className={`db-metric-delta${deltaPos ? ' db-metric-delta--pos' : ''}`}>{delta}</div>
                  </div>
                ))}
              </div>

              {/* Leads table */}
              <div className="db-table-wrap">
                <div className="db-table-header">
                  <span className="db-table-title">Recent Leads</span>
                  <div className="db-table-filters">
                    <span className="db-filter db-filter--active">All</span>
                    <span className="db-filter">Hot</span>
                    <span className="db-filter">Follow-up</span>
                  </div>
                </div>

                <table className="db-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Channel</th>
                      <th>Score</th>
                      <th>Stage</th>
                      <th>Last Touch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEADS.map((lead, i) => (
                      <tr
                        key={lead.name}
                        className={`db-tr${i === 0 && newLeadStep === 1 ? ' db-tr--pulse' : ''}`}
                      >
                        <td>
                          <div className="db-lead-cell">
                            {lead.active && <span className="db-live-dot" />}
                            <span className="db-lead-name">{lead.name}</span>
                          </div>
                        </td>
                        <td><ChannelIcon ch={lead.channel} /></td>
                        <td><ScoreBar score={lead.score} /></td>
                        <td><StageBadge stage={lead.stage} /></td>
                        <td><span className="db-touch">{lead.touch}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity feed */}
            <div className="db-feed">
              <div className="db-feed-title">Activity</div>
              <div className="db-feed-list">
                {ACTIVITY.map(({ icon: I, color, text, time }, i) => (
                  <div key={i} className="db-feed-row">
                    <span className="db-feed-ico" style={{ background: `${color}22`, color }}>
                      <I size={11} />
                    </span>
                    <span className="db-feed-txt">{text}</span>
                    <span className="db-feed-time">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
