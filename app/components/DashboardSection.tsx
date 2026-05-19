'use client';
import { useEffect, useRef, useState } from 'react';

/* ── Sparkline SVG (smooth bezier curve) ── */
function Sparkline({ pts, color, width = 110, height = 36 }: {
  pts: number[]; color: string; width?: number; height?: number;
}) {
  const max = Math.max(...pts), min = Math.min(...pts);
  const range = max - min || 1;
  const pad = 2;
  const coords = pts.map((v, i) => ({
    x: pad + (i / (pts.length - 1)) * (width - pad * 2),
    y: pad + (1 - (v - min) / range) * (height - pad * 2),
  }));

  // Build a real-data line path: straight segments with subtle smoothing only at sharp peaks
  function smooth(pts: { x: number; y: number }[]) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      d += ` L ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
    }
    return d;
  }

  const linePath = smooth(coords);
  const areaPath = `${linePath} L ${coords[coords.length-1].x.toFixed(1)},${height} L ${coords[0].x.toFixed(1)},${height} Z`;
  const gId = `sg-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={gId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gId})`} />
      <path d={linePath} fill="none" stroke={color}
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
            style={{}}
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const secRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [vis, setVis] = useState(false);
  const [revealedSlides, setRevealedSlides] = useState<Set<number>>(new Set());

  useEffect(() => {
    const el = secRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Per-slide scroll reveal — fires when each slide enters the carousel's visible area
  useEffect(() => {
    const car = carRef.current;
    if (!car) return;
    const observers: IntersectionObserver[] = [];
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setRevealedSlides(prev => new Set(prev).add(i));
            io.disconnect();
          }
        },
        { root: car, threshold: 0.15 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Scroll-driven horizontal pan: page scroll advances the carousel on desktop
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const car = carRef.current;
    if (!wrapper || !car) return;

    const onScroll = () => {
      if (window.innerWidth < 768) return;
      const rect = wrapper.getBoundingClientRect();
      const totalScrollable = wrapper.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      const maxScrollLeft = car.scrollWidth - car.clientWidth;
      car.scrollLeft = progress * maxScrollLeft;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="db2-sticky-wrapper">
    <section ref={secRef} className="db2-section">
      <div className="proxe-container">

        <div className={`proxe-section-label db2-label${vis ? ' db2-in' : ''}`}>The Dashboard</div>
        <h2 className={`db2-h2${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.08s' }}>
          PROXe takes care of<br />your entire pipeline.
        </h2>
        <p className={`db2-sub${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.14s' }}>
          Always on screen. Every lead, every stage, every channel, tracked in real time.
        </p>

        <div className={`db2-carousel-wrap${vis ? ' db2-in' : ''}`} style={{ transitionDelay: '0.22s', position: 'relative' }}>
        <button
          className="db2-carousel-arrow db2-carousel-arrow--prev"
          aria-label="Previous"
          onClick={() => carRef.current?.scrollBy({ left: -carRef.current.clientWidth, behavior: 'smooth' })}
        >‹</button>
        <button
          className="db2-carousel-arrow db2-carousel-arrow--next"
          aria-label="Next"
          onClick={() => carRef.current?.scrollBy({ left: carRef.current.clientWidth, behavior: 'smooth' })}
        >›</button>
        <div ref={carRef} className="db2-carousel">
        <div ref={el => { slideRefs.current[0] = el; }} className={`db2-browser db2-slide${revealedSlides.has(0) ? ' db2-slide--in' : ''}`}>

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
                  <CircleGauge value="46%"  label="Avg Lead Score"  color="#22c55e" pct={0.46} />
                  <CircleGauge value="99%"  label="Response Rate"   color="#22c55e" pct={0.99} />
                  <CircleGauge value="29%"  label="Key Event Rate"  color="#22c55e" pct={0.29} />
                  <CircleGauge value="3.5"  sub="sec"  label="Avg Response Time" color="#22c55e" pct={0.18} />
                </div>
              </div>

              {/* Stat cards */}
              <div className="db2-stats">
                <StatCard
                  icon="▣" title="Conversations" titleColor="#3B82F6"
                  value="103" sub="103 all time" barColor="#3B82F6" trend="+12%"
                  sparkPts={[42,58,49,71,55,38,29,51,73,62,84,69,77,91,68,82,95,79,88,103]}
                />
                <StatCard
                  icon="↑" title="Engaged Leads" titleColor="#22c55e"
                  value="68" sub="53.5%" subColor="#22c55e" barColor="#22c55e" trend="+8%"
                  sparkPts={[28,41,33,46,29,52,38,44,57,48,61,42,55,64,49,58,60,53,66,68]}
                />
                <StatCard
                  icon="🔥" title="Warm Leads" titleColor="#f97316"
                  value="30" sub="Score 40-69" subColor="#f97316" barColor="#f97316" trend="+15%"
                  sparkPts={[8,14,11,19,9,22,16,12,24,18,27,15,21,29,17,25,23,19,28,30]}
                />
                <StatCard
                  icon="👥" title="Total Leads" titleColor="rgba(255,255,255,0.75)"
                  value="127" sub="127 all time" barColor="rgba(255,255,255,0.5)" trend="+22%"
                  sparkPts={[58,62,68,71,73,78,82,85,89,94,99,103,108,112,115,119,121,124,126,127]}
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

        {/* ── Slide 2: Conversations (real screenshot) ── */}
        <div ref={el => { slideRefs.current[1] = el; }} className={`db2-browser db2-slide${revealedSlides.has(1) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/conversations
            </div>
          </div>
          <div className="db2-shot">
            <img src="/home/Conversations.webp" alt="PROXe Conversations" />
          </div>
        </div>

        {/* ── Slide 3: Leads (real screenshot) ── */}
        <div ref={el => { slideRefs.current[2] = el; }} className={`db2-browser db2-slide${revealedSlides.has(2) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/leads
            </div>
          </div>
          <div className="db2-shot">
            <img src="/home/Leads.webp" alt="PROXe Leads" />
          </div>
        </div>

        </div>{/* end db2-carousel */}
        </div>{/* end db2-carousel-wrap */}
      </div>
    </section>
    </div>
  );
}
