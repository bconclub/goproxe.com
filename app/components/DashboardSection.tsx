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

  // Per-slide scroll reveal — each dashboard browser slides in when it enters viewport
  useEffect(() => {
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
        { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Convert vertical wheel into horizontal scroll while pointer is over the carousel
  useEffect(() => {
    const el = carRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // horizontal trackpad — let native scroll
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      // Only intercept if we have room to scroll in the wheel direction
      const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = el.scrollLeft >= maxScroll - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
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

        {/* ── Slide 2: Conversation inbox view ── */}
        <div ref={el => { slideRefs.current[1] = el; }} className={`db2-browser db2-slide${revealedSlides.has(1) ? ' db2-slide--in' : ''}`}>
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span /><span /><span /></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/inbox
            </div>
          </div>
          <div className="db2-app db2-app--inbox">
            <div className="db2-sidebar">
              <div className="db2-sidebar-logo">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" stroke="#C8FF00" strokeWidth="2" />
                  <circle cx="11" cy="11" r="5" fill="#C8FF00" />
                </svg>
              </div>
              <div className="db2-sidebar-icons">
                {['⊞','💬','👤','▤','📅','✓','〜','💬','📖','⚙'].map((ic, i) => (
                  <div key={i} className={`db2-sidebar-ico${i === 1 ? ' db2-sidebar-ico--active' : ''}`}>{ic}</div>
                ))}
              </div>
            </div>

            {/* Conversation list */}
            <div className="db2-inbox-list">
              <div className="db2-inbox-search">🔍 <span>Search conversations...</span></div>
              <div className="db2-inbox-srctabs">
                <span className="db2-inbox-srctab db2-inbox-srctab--active">All</span>
                <span className="db2-inbox-srctab">Web</span>
                <span className="db2-inbox-srctab">WhatsApp</span>
              </div>
              {[
                { name: 'Prityush',          sub: 'PROXe Platform',          ago: '27d ago', score: 46, src: 'web', evt: null, active: true },
                { name: 'Rachna Agarwal',    sub: 'Rachna! I think you might have sent this to the wrong...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Gopal',             sub: 'Hi Gopal, you reached out to us recently about Huma...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Angel Fire Service',sub: 'Hi Angel Fire Service, you reached out to us recently...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Research',          sub: 'Hi Research, you reached out to us recently about H...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Ramesh Babu',       sub: 'Hi Ramesh Babu, you reached out to us rece...', ago: '30d ago', src: 'wa', evt: 'EVENT' },
                { name: 'Kushal Begur',      sub: 'Hi kushal begur, you reached out to us recently abou...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Vijay Chavan',      sub: 'Hi Vijay Chavan, you reached out to us recently abou...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'B Srikanth Reddy',  sub: 'Hi B Srikanth Reddy, you reached out to us recently a...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'ESKelectric',       sub: 'Hi Esk Electric Vehicles, you reached out to us recen...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Uma',               sub: 'Hi Uma, you reached out to us recently about Human...', ago: '30d ago', src: 'wa', evt: null },
                { name: 'Sri Lakshmi Sai',   sub: 'Hi Sri Lakshmi Sai, you reached out to us re...', ago: '30d ago', src: 'wa', evt: 'EVENT' },
              ].map((c, i) => (
                <div key={i} className={`db2-inbox-item${c.active ? ' db2-inbox-item--active' : ''}`}>
                  <div className="db2-inbox-avatar" style={{ background: c.src === 'wa' ? '#25D366' : '#7C3AED' }}>
                    {c.active && <span className="db2-inbox-score">{c.score}</span>}
                  </div>
                  <div className="db2-inbox-body">
                    <div className="db2-inbox-name-row">
                      <span className="db2-inbox-name">{c.name}</span>
                      <span className="db2-inbox-ago">{c.ago}</span>
                    </div>
                    <div className="db2-inbox-sub">{c.sub}</div>
                  </div>
                  {c.evt && <span className="db2-inbox-evt">{c.evt}</span>}
                </div>
              ))}
            </div>

            {/* Chat thread */}
            <div className="db2-inbox-thread">
              <div className="db2-inbox-thread-hdr">
                <span className="db2-inbox-thread-tab db2-inbox-thread-tab--active">All (11)</span>
                <span className="db2-inbox-thread-tab">Web (11)</span>
              </div>
              <div className="db2-inbox-thread-body">
                <div className="db2-inbox-date">Apr 11, 2026</div>
                <div className="db2-inbox-msg db2-inbox-msg--lead">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name">PRITYUSH</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:32 AM</span></div>
                  <div className="db2-inbox-msg-text">quality leads</div>
                </div>
                <div className="db2-inbox-msg db2-inbox-msg--agent">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name db2-inbox-msg-name--ai">PROXE AI</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:32 AM</span></div>
                  <div className="db2-inbox-msg-text">So you&apos;re getting leads but they&apos;re not converting? <b>Let&apos;s set up an AI Brand Audit</b> — we&apos;ll map out a lead qualification system built for your painting business.</div>
                </div>
                <div className="db2-inbox-msg db2-inbox-msg--lead">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name">PRITYUSH</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:32 AM</span></div>
                  <div className="db2-inbox-msg-text">wahsta up</div>
                </div>
                <div className="db2-inbox-msg db2-inbox-msg--lead">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name">PRITYUSH</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:33 AM</span></div>
                  <div className="db2-inbox-msg-text">Explore AI Solutions</div>
                </div>
                <div className="db2-inbox-msg db2-inbox-msg--agent">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name db2-inbox-msg-name--ai">PROXE AI</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:33 AM</span></div>
                  <div className="db2-inbox-msg-text">Perfect! <b>What&apos;s your name?</b> I&apos;ll show you exactly how AI can transform your painting business. Are you looking to automate lead qualification, booking, or something else?</div>
                </div>
                <div className="db2-inbox-date">Apr 12, 2026</div>
                <div className="db2-inbox-msg db2-inbox-msg--lead">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name">PRITYUSH</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:52 PM</span></div>
                  <div className="db2-inbox-msg-text">About BCON</div>
                </div>
                <div className="db2-inbox-msg db2-inbox-msg--agent">
                  <div className="db2-inbox-msg-meta"><span className="db2-inbox-msg-name db2-inbox-msg-name--ai">PROXE AI</span> <span className="db2-inbox-msg-src">Web</span> <span className="db2-inbox-msg-time">1:52 PM</span></div>
                  <div className="db2-inbox-msg-text">Hey Kanishk! We help businesses integrate AI and maximize their potential. What&apos;s your business?</div>
                </div>
              </div>
              <div className="db2-inbox-thread-input">
                <span className="db2-inbox-thread-input-ai">✨</span>
                <span className="db2-inbox-thread-input-placeholder">Type a reply...</span>
                <span className="db2-inbox-thread-input-send">▶</span>
              </div>
            </div>

            {/* Right details panel */}
            <div className="db2-inbox-details">
              <div className="db2-inbox-details-hdr">
                <div className="db2-inbox-details-av" style={{ background: '#7C3AED' }}>P</div>
                <div className="db2-inbox-details-info">
                  <div className="db2-inbox-details-name">Prityush <span className="db2-inbox-details-ago">27d ago</span></div>
                  <div className="db2-inbox-details-tags">
                    <span className="db2-inbox-details-qual">Qualified</span>
                    <span className="db2-inbox-details-cal">📅</span>
                  </div>
                </div>
              </div>
              <div className="db2-inbox-details-score">
                <div className="db2-inbox-details-score-row">
                  <span>Lead Score</span>
                  <span className="db2-inbox-details-score-num">46 <span className="db2-inbox-details-cold">Cold</span></span>
                </div>
                <div className="db2-inbox-details-score-bar">
                  <div className="db2-inbox-details-score-fill" style={{ width: '46%' }} />
                </div>
              </div>
              <div className="db2-inbox-details-actions">
                <span className="db2-inbox-details-act db2-inbox-details-act--call">📞 Call</span>
                <span className="db2-inbox-details-act db2-inbox-details-act--wa">💬 WhatsApp</span>
                <span className="db2-inbox-details-act db2-inbox-details-act--email">✉ Email</span>
              </div>
              <div className="db2-inbox-details-block">
                <div className="db2-inbox-details-label">CONTACT</div>
                <div className="db2-inbox-details-line">✉ prat@yush.com</div>
                <div className="db2-inbox-details-line">📞 9876549875</div>
              </div>
              <div className="db2-inbox-details-stats">
                <div className="db2-inbox-details-stat"><div className="db2-inbox-details-stat-v">6</div><div className="db2-inbox-details-stat-l">MESSAGES</div></div>
                <div className="db2-inbox-details-stat"><div className="db2-inbox-details-stat-v">83%</div><div className="db2-inbox-details-stat-l">RESPONSE</div></div>
                <div className="db2-inbox-details-stat"><div className="db2-inbox-details-stat-v">30d</div><div className="db2-inbox-details-stat-l">PIPELINE</div></div>
              </div>
              <div className="db2-inbox-details-block">
                <div className="db2-inbox-details-label">PROFILE</div>
                <div className="db2-inbox-details-line db2-inbox-details-row"><span>Source</span><span className="db2-inbox-details-val">Web</span></div>
              </div>
              <div className="db2-inbox-details-block">
                <div className="db2-inbox-details-label">UPCOMING</div>
                <div className="db2-inbox-details-line db2-inbox-details-muted">No upcoming events</div>
              </div>
              <div className="db2-inbox-details-cta">View Full Details</div>
            </div>
          </div>
        </div>

        </div>{/* end db2-carousel */}
        </div>{/* end db2-carousel-wrap */}
      </div>
    </section>
  );
}
