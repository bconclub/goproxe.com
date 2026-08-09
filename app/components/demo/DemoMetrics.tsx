'use client';

import { useEffect, useRef, useState } from 'react';
import type { Industry } from '../../lib/industries';
import type { SimState } from './sim/store';
import { mulberry32, hashString, between } from './sim/rng';

/** rAF count-up — numbers tween to their new value instead of snapping. */
function useCountUp(target: number): number {
  const [shown, setShown] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    const start = performance.now();
    const dur = 600;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setShown(Math.round(from + (target - from) * p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

function Tile({ value, label }: { value: number; label: string }) {
  const shown = useCountUp(value);
  return (
    <div className="demo-tile">
      <b>{shown}</b>
      <span>{label}</span>
    </div>
  );
}

/** Analytics view — stat tiles + a seeded inline-SVG week sparkline. */
export default function DemoMetrics({ industry, state }: { industry: Industry; state: SimState }) {
  const d = industry.demo;
  const m = state.metrics;

  // Seeded 14-point series, rising — the demo business is doing well.
  const rng = mulberry32(hashString(industry.slug) ^ 0x51ca);
  const points: number[] = [];
  let v = between(rng, 20, 34);
  for (let i = 0; i < 14; i++) {
    v = Math.max(8, v + between(rng, -4, 7));
    points.push(v);
  }
  const max = Math.max(...points);
  const W = 600;
  const H = 110;
  const path = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * W},${H - (p / max) * (H - 12)}`)
    .join(' ');

  return (
    <div className="demo-metrics">
      <div className="demo-pane-title">Today, so far</div>
      <div className="demo-tiles">
        <Tile value={m.m1} label={d.metricLabels.m1} />
        <Tile value={m.m2} label={d.metricLabels.m2} />
        <Tile value={m.m3} label={d.metricLabels.m3} />
        <div className="demo-tile">
          <b>{m.m4}</b>
          <span>{d.metricLabels.m4}</span>
        </div>
      </div>
      <div className="demo-spark">
        <h4>Leads captured — last 14 days</h4>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="demoSparkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={industry.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={industry.color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${path} L${W},${H} L0,${H} Z`} fill="url(#demoSparkFill)" stroke="none" />
          <path d={path} fill="none" stroke={industry.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
