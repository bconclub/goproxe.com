'use client';
import { useEffect, useRef, useState } from 'react';

/* ── Circular gauge (SVG ring) ── */
function CircleGauge({
  value, label, color, pct,
}: { value: string; label: string; color: string; pct: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r; // ≈ 226
  const fill = circ * Math.min(pct, 1);
  return (
    <div className="db2-gauge-wrap">
      <div className="db2-gauge">
        <svg width="90" height="90" viewBox="0 0 90 90">
          {/* track */}
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          {/* fill — starts from 12 o'clock via rotate(-90) */}
          <circle
            cx="45" cy="45" r={r} fill="none"
            stroke={color} strokeWidth="4"
            strokeDasharray={`${fill} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </svg>
        <span className="db2-gauge-val" style={{ color }}>{value}</span>
      </div>
      <div className="db2-gauge-label">{label}</div>
    </div>
  );
}

/* ── Stat card (big number + colour bar) ── */
function StatCard({
  icon, title, titleColor, value, sub, subColor, barColor, barPct = 0.7,
}: {
  icon: string; title: string; titleColor: string;
  value: string; sub: string; subColor?: string;
  barColor: string; barPct?: number;
}) {
  return (
    <div className="db2-stat-card" style={{ '--db2-bar': barColor } as React.CSSProperties}>
      <div className="db2-stat-header">
        <span style={{ color: titleColor }}>{icon}</span>
        <span className="db2-stat-title" style={{ color: titleColor }}>{title}</span>
      </div>
      <div className="db2-stat-val">{value}</div>
      <div className="db2-stat-sub" style={{ color: subColor ?? 'rgba(255,255,255,0.4)' }}>{sub}</div>
      <div className="db2-stat-bar-track">
        <div className="db2-stat-bar-fill" style={{ width: `${barPct * 100}%`, background: barColor }} />
      </div>
      <div className="db2-stat-footer">
        <span className="db2-stat-view" style={{ color: titleColor }}>View →</span>
        <div className="db2-stat-tabs">
          {['All','7D','14D','30D'].map((t,i) => (
            <span key={t} className={`db2-stat-tab${i===0?' db2-stat-tab--active':''}`}
              style={i===0?{background:`${barColor}33`,color:barColor,borderColor:`${barColor}55`}:{}}
            >{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const [vis, setVis]   = useState(false);

  useEffect(() => {
    const el = secRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={secRef} className="db2-section">
      <div className="proxe-container">

        {/* ── Heading ── */}
        <div className={`proxe-section-label db2-label${vis?' db2-in':''}`}>The Dashboard</div>
        <h2 className={`db2-h2${vis?' db2-in':''}`} style={{ transitionDelay: '0.08s' }}>
          PROXe takes care of<br />your entire pipeline.
        </h2>
        <p className={`db2-sub${vis?' db2-in':''}`} style={{ transitionDelay: '0.14s' }}>
          Always on screen. Every lead, every stage, every channel — tracked in real time.
        </p>

        {/* ── Browser shell ── */}
        <div className={`db2-browser${vis?' db2-in':''}`} style={{ transitionDelay: '0.22s' }}>

          {/* Chrome bar */}
          <div className="db2-chrome">
            <div className="db2-chrome-dots"><span/><span/><span/></div>
            <div className="db2-chrome-url">
              <span className="db2-chrome-lock">🔒</span>
              app.proxe.ai/dashboard
            </div>
          </div>

          {/* App window */}
          <div className="db2-app">

            {/* Sidebar */}
            <div className="db2-sidebar">
              <div className="db2-sidebar-logo">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" stroke="#C8FF00" strokeWidth="2"/>
                  <circle cx="11" cy="11" r="5"  fill="#C8FF00"/>
                </svg>
              </div>
              <div className="db2-sidebar-icons">
                {['⊞','⬜','👤','▤','📅','〜','↗','💬','📖','⚙'].map((ic,i)=>(
                  <div key={i} className={`db2-sidebar-ico${i===0?' db2-sidebar-ico--active':''}`}>{ic}</div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="db2-main">

              {/* At a Glance */}
              <div className="db2-glance">
                <div className="db2-glance-title">At a Glance</div>
                <div className="db2-gauges">
                  <CircleGauge value="27%"    label="Avg Lead Score"  color="#ef4444" pct={0.27} />
                  <CircleGauge value="99%"    label="Response Rate"   color="#22c55e" pct={0.99} />
                  <CircleGauge value="29%"    label="Key Event Rate"  color="#22c55e" pct={0.29} />
                  <CircleGauge value="9709ms" label="Avg Response"    color="#ef4444" pct={0.42} />
                </div>
              </div>

              {/* Stat cards */}
              <div className="db2-stats">
                <StatCard icon="▣"  title="Conversations" titleColor="#3B82F6"
                  value="103" sub="103 all time"      barColor="#3B82F6" barPct={1} />
                <StatCard icon="↑"  title="Engaged Leads" titleColor="#22c55e"
                  value="68"  sub="53.5%"             subColor="#22c55e" barColor="#22c55e" barPct={0.54} />
                <StatCard icon="🔥" title="Warm Leads"    titleColor="#f97316"
                  value="30"  sub="Score 40–69"       subColor="#f97316" barColor="#f97316" barPct={0.30} />
                <StatCard icon="👥" title="Total Leads"   titleColor="rgba(255,255,255,0.7)"
                  value="127" sub="127 all time"      barColor="rgba(255,255,255,0.35)" barPct={1} />
              </div>

              {/* Upcoming Events */}
              <div className="db2-events">
                <div className="db2-events-left">
                  <span className="db2-events-title">Upcoming Events</span>
                  <span className="db2-events-badge">0</span>
                </div>
                <span className="db2-events-view">View All →</span>
              </div>

              {/* Bottom row */}
              <div className="db2-bottom">
                {/* Leads needing attention */}
                <div className="db2-attention">
                  <div className="db2-panel-header">
                    <span className="db2-panel-title">Leads Needing Attention</span>
                    <span className="db2-panel-view">View All →</span>
                  </div>
                  <div className="db2-panel-empty">No leads need attention</div>
                </div>

                {/* Recent Activity */}
                <div className="db2-activity">
                  <div className="db2-panel-header">
                    <span className="db2-panel-title">Recent Activity</span>
                    <span className="db2-panel-view">View All →</span>
                  </div>
                  <div className="db2-activity-row">
                    <div className="db2-activity-avatar">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="6" r="3.5"/>
                        <path d="M1 14c0-3.866 3.134-7 7-7s7 3.134 7 7"/>
                      </svg>
                    </div>
                    <div className="db2-activity-body">
                      <div className="db2-activity-name">Md Mehran alam arrived via web</div>
                      <div className="db2-activity-meta">10d ago · Web</div>
                    </div>
                  </div>
                  <div className="db2-activity-row">
                    <div className="db2-activity-avatar db2-activity-avatar--green">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <circle cx="8" cy="6" r="3.5"/>
                        <path d="M1 14c0-3.866 3.134-7 7-7s7 3.134 7 7"/>
                      </svg>
                    </div>
                    <div className="db2-activity-body">
                      <div className="db2-activity-name">Rahul S. replied on WhatsApp</div>
                      <div className="db2-activity-meta">2m ago · WhatsApp</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>{/* /db2-main */}
          </div>{/* /db2-app */}
        </div>{/* /db2-browser */}
      </div>
    </section>
  );
}
