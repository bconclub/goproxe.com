'use client';
import { useEffect, useRef, useState } from 'react';

/* ── Sparkline SVG ── */
function Sparkline({ pts, color, width = 110, height = 36 }: {
  pts: number[]; color: string; width?: number; height?: number;
}) {
  const max = Math.max(...pts), min = Math.min(...pts);
  const range = max - min || 1;
  const pad = 2;
  const points = pts.map((v, i) => {
    const x = pad + (i / (pts.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  // gradient fill area
  const firstX = pad, lastX = width - pad;
  const areaPoints = `${firstX},${height} ${points} ${lastX},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Circular gauge (SVG ring) ── */
function CircleGauge({
  value, sub, label, color, pct,
}: { value: string; sub?: string; label: string; color: string; pct: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const fill = circ * Math.min(pct, 1);
  return (
    <div className="db2-gauge-wrap">
      <div className="db2-gauge">
        <svg width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
          <circle cx="48" cy="48" r={r} fill="none"
            stroke={color} strokeWidth="5"
            strokeDasharray={`${fill} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 48 48)"
            style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
          />
        </svg>
        <div className="db2-gauge-center">
          <span className="db2-gauge-val" style={{ color }}>{value}</span>
          {sub && <span className="db2-gauge-sub" style={{ color }}>{sub}</span>}
        </div>
      </div>
      <div className="db2-gauge-label">{label}</div>
    </div>
  );
}

/* ── Stat card with sparkline ── */
function StatCard({
  icon, title, titleColor, value, sub, subColor, barColor, sparkPts, trend,
}: {
  icon: string; title: string; titleColor: string;
  value: string; sub: string; subColor?: string;
  barColor: string; sparkPts: number[]; trend: string;
}) {
  return (
    <div className="db2-stat-card">
      <div className="db2-stat-header">
        <span style={{ color: titleColor }}>{icon}</span>
        <span className="db2-stat-title" style={{ color: titleColor }}>{title}</span>
        <span className="db2-stat-trend" style={{ color: titleColor, background: `${titleColor}18`, border: `1px solid ${titleColor}33` }}>
          {trend}
        </span>
      </div>
      <div className="db2-stat-val">{value}</div>
      <div className="db2-stat-sub" style={{ color: subColor ?? 'rgba(255,255,255,0.4)' }}>{sub}</div>
      <div className="db2-stat-spark">
        <Sparkline pts={sparkPts} color={barColor} />
      </div>
      <div className="db2-stat-footer">
        <span className="db2-stat-view" style={{ color: titleColor }}>View →</span>
        <div className="db2-stat-tabs">
          {['All','7D','14D','30D'].map((t, i) => (
            <span key={t} className={`db2-stat-tab${i === 0 ? ' db2-stat-tab--active' : ''}`}
              style={i === 0 ? { background: `${barColor}30`, color: barColor, borderColor: `${barColor}50` } : {}}
            >{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = secRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={secRef} className="db2-section">
      <div className="proxe-container">

        <div className={`proxe-section-label db2-label${vis ? ' db2-in' : ''}`}>The Dashboard</div>
        <h2 className={`db2-h2${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.08s' }}>
          PROXe takes care of<br />your entire pipeline.
        </h2>
        <p className={`db2-sub${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.14s' }}>
          Always on screen. Every lead, every stage, every channel, tracked in real time.
        </p>

        <div className={`db2-browser${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.22s' }}>

          {/* Chrome bar */}
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/dashboard
            </div>
          </div>

          {/* App */}
          <div className="db2-app">

            {/* Sidebar */}
            <div className="db2-sidebar">
              <div className="db2-sidebar-logo">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" stroke="#C8FF00" strokeWidth="2" />
                  <circle cx="11" cy="11" r="5" fill="#C8FF00" />
                </svg>
              </div>
              <div className="db2-sidebar-icons">
                {['⊞','⬜','👤','▤','📅','〜','↗','💬','📖','⚙'].map((ic, i) => (
                  <div key={i} className={`db2-sidebar-ico${i === 0 ? ' db2-sidebar-ico--active' : ''}`}>{ic}</div>
                ))}
              </div>
            </div>

            {/* Main */}
            <div className="db2-main">

              {/* At a Glance */}
              <div className="db2-glance">
                <div className="db2-glance-title">At a Glance</div>
                <div className="db2-gauges">
                  <CircleGauge value="27%"  label="Avg Lead Score"  color="#ef4444" pct={0.27} />
                  <CircleGauge value="99%"  label="Response Rate"   color="#22c55e" pct={0.99} />
                  <CircleGauge value="29%"  label="Key Event Rate"  color="#22c55e" pct={0.29} />
                  <CircleGauge value="9.7"  sub="sec"  label="Avg Response Time" color="#ef4444" pct={0.42} />
                </div>
              </div>

              {/* Stat cards */}
              <div className="db2-stats">
                <StatCard
                  icon="▣" title="Conversations" titleColor="#3B82F6"
                  value="103" sub="103 all time" barColor="#3B82F6" trend="+12%"
                  sparkPts={[45,52,48,61,58,70,65,78,71,88,90,103]}
                />
                <StatCard
                  icon="↑" title="Engaged Leads" titleColor="#22c55e"
                  value="68" sub="53.5%" subColor="#22c55e" barColor="#22c55e" trend="+8%"
                  sparkPts={[30,38,42,35,48,52,45,58,55,62,65,68]}
                />
                <StatCard
                  icon="🔥" title="Warm Leads" titleColor="#f97316"
                  value="30" sub="Score 40-69" subColor="#f97316" barColor="#f97316" trend="+15%"
                  sparkPts={[12,18,15,22,19,25,20,26,24,28,27,30]}
                />
                <StatCard
                  icon="👥" title="Total Leads" titleColor="rgba(255,255,255,0.75)"
                  value="127" sub="127 all time" barColor="rgba(255,255,255,0.5)" trend="+22%"
                  sparkPts={[65,72,78,82,88,94,98,105,110,118,122,127]}
                />
              </div>

              {/* Upcoming Events */}
              <div className="db2-events-card">
                <div className="db2-panel-header">
                  <div className="db2-events-left">
                    <span className="db2-panel-title">Upcoming Events</span>
                    <span className="db2-events-badge">2</span>
                  </div>
                  <span className="db2-panel-view">View All →</span>
                </div>
                <div className="db2-event-list">
                  {[
                    { dot: '#7C3AED', label: 'Follow-up call', lead: 'Rahul S.',  time: 'Today, 4:00 PM',   tag: 'Scheduled' },
                    { dot: '#0EA5E9', label: 'Demo walkthrough', lead: 'Sara J.', time: 'Tomorrow, 11:00 AM', tag: 'Confirmed' },
                  ].map(ev => (
                    <div key={ev.lead} className="db2-event-row" style={{ '--ev-color': ev.dot } as React.CSSProperties}>
                      <div className="db2-event-dot" />
                      <div className="db2-event-body">
                        <span className="db2-event-label">{ev.label} <span className="db2-event-lead">· {ev.lead}</span></span>
                        <span className="db2-event-time">{ev.time}</span>
                      </div>
                      <span className="db2-event-tag" style={{ color: ev.dot, background: `${ev.dot}18`, border: `1px solid ${ev.dot}35` }}>{ev.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom */}
              <div className="db2-bottom">
                <div className="db2-attention">
                  <div className="db2-panel-header">
                    <span className="db2-panel-title">Leads Needing Attention</span>
                    <span className="db2-panel-view">View All →</span>
                  </div>
                  {[
                    { name: 'Priya M.',  tag: 'No reply · 5 days', score: 67, color: '#F59E0B' },
                    { name: 'Amit K.',   tag: 'Missed call · 2 days', score: 45, color: '#0EA5E9' },
                    { name: 'Neha R.',   tag: 'Form drop-off · 1 day', score: 28, color: '#9CA3AF' },
                  ].map(lead => (
                    <div key={lead.name} className="db2-attn-row">
                      <div className="db2-attn-avatar">{lead.name[0]}</div>
                      <div className="db2-attn-body">
                        <span className="db2-attn-name">{lead.name}</span>
                        <span className="db2-attn-tag">{lead.tag}</span>
                      </div>
                      <span className="db2-attn-score" style={{ color: lead.color }}>{lead.score}</span>
                    </div>
                  ))}
                </div>

                <div className="db2-activity">
                  <div className="db2-panel-header">
                    <span className="db2-panel-title">Recent Activity</span>
                    <span className="db2-panel-view">View All →</span>
                  </div>
                  {[
                    { name: 'Rahul S. replied on WhatsApp',        meta: '2m ago · WhatsApp',  green: true  },
                    { name: 'Sara J. booked a demo',                meta: '14m ago · Instagram', green: true  },
                    { name: 'Md Mehran alam arrived via web',       meta: '10d ago · Web',       green: false },
                  ].map(({ name, meta, green }) => (
                    <div key={name} className="db2-activity-row">
                      <div className={`db2-activity-avatar${green ? ' db2-activity-avatar--green' : ''}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="6" r="3.5" />
                          <path d="M1 14c0-3.866 3.134-7 7-7s7 3.134 7 7" />
                        </svg>
                      </div>
                      <div className="db2-activity-body">
                        <div className="db2-activity-name">{name}</div>
                        <div className="db2-activity-meta">{meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
