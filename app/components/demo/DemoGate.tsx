'use client';

/**
 * The gate between picking an industry and feeling the product:
 * watch the walkthrough, then enter the REAL dashboard.
 *
 * This intentionally replaced mounting the simulated DemoApp (Z's Aug-09 rule,
 * reaffirmed 27 Aug: nothing ships that is not pixel-identical to the
 * product). "Enter the live demo" goes to the try.goproxe.com deployment -
 * the actual dashboard, BRAND_ID=demo, seeded mock data, signed in through
 * /api/demo/enter as a shared viewer. The voice taste reuses the landing
 * hero's callback capture, with all its cooldowns and quiet-hours guards.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { getIndustry } from '../../lib/industries';
import { track } from '../../lib/analytics';
import HeroPhoneCapture from '../shared/HeroPhoneCapture';
import DemoVideo from './DemoVideo';

const DEMO_DASH = (process.env.NEXT_PUBLIC_DEMO_DASH_URL || 'https://try.goproxe.com').replace(/\/+$/, '');

export default function DemoGate({ slug }: { slug: string }) {
  const industry = getIndustry(slug);

  useEffect(() => {
    if (industry) track('demo_start', { industry: slug });
  }, [industry, slug]);

  if (!industry) return null;
  const Icon = industry.Icon;

  return (
    <main className="demo-choose demo-gate" style={{ ['--acc' as string]: industry.color }}>
      <Link href="/demo" className="demo-gate-back">← All industries</Link>

      <div className="demo-gate-head">
        <span className="demo-choose-ico"><Icon size={22} /></span>
        <h1>{industry.title}</h1>
      </div>
      <p className="demo-gate-sub">
        Watch PROXe run {industry.demo.business.name} - then step inside the real dashboard and click around yourself.
      </p>

      <DemoVideo videoId={industry.demo.videoId ?? null} accent={industry.color} title={industry.title} />

      <div className="demo-gate-actions">
        <a
          className="demo-gate-enter"
          href={`${DEMO_DASH}/api/demo/enter`}
          onClick={() => track('demo_deploy_click', { industry: slug, target: 'live_dashboard' })}
        >
          Enter the live demo →
        </a>
        <p className="demo-gate-note">
          The actual PROXe dashboard on sample data. No signup, nothing to install - and nothing you do in there messages a real person.
        </p>
      </div>

      <div className="demo-gate-voice">
        <h2>Or hear it work</h2>
        <p>Drop your number and PROXe calls you back in seconds - the same agent your customers would get.</p>
        <HeroPhoneCapture />
      </div>
    </main>
  );
}
