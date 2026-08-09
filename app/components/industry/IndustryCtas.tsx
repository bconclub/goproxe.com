'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { useDeployModal } from '../../contexts/DeployModalContext';
import { track } from '../../lib/analytics';

/**
 * The CTA pair every industry page uses (hero + closing): "See it live" into
 * the demo, "Deploy PROXe" into the existing deploy modal → checkout flow.
 *
 * Also owns the page-view event when `fireView` is set (the hero instance),
 * so the template itself can stay a server component.
 *
 * The demo link is deliberately RELATIVE (/demo/slug): it works in dev, in
 * preview deploys, and on production before demo.goproxe.com DNS exists —
 * the subdomain is additive, not required.
 */
export default function IndustryCtas({
  slug,
  fireView = false,
}: {
  slug: string;
  fireView?: boolean;
}) {
  const { startDeploy } = useDeployModal();
  const viewFired = useRef(false);

  useEffect(() => {
    if (!fireView || viewFired.current) return;
    viewFired.current = true; // StrictMode double-invoke guard
    track('industry_page_view', { industry: slug });
  }, [fireView, slug]);

  // The demo CTA is OFF until demo.goproxe.com serves the real dashboard.
  // The first demo was a purpose-built replica; decision 2026-08-09: we do not
  // show anything that is not pixel-identical to the product. Flip this back
  // once the real-core demo deployment is live.
  const DEMO_READY = false;

  return (
    <div className="indp-cta-row">
      {DEMO_READY && (
      <Link
        href={`/demo/${slug}`}
        className="indp-cta indp-cta--demo"
        onClick={() => track('industry_cta_click', { industry: slug, target: 'demo' })}
      >
        <span className="indp-live-dot" />
        See it live
      </Link>
      )}
      <button
        type="button"
        className="indp-cta indp-cta--deploy"
        onClick={() => {
          track('industry_cta_click', { industry: slug, target: 'deploy' });
          void startDeploy(`industry_${slug}`);
        }}
      >
        Deploy PROXe <FiArrowRight size={15} />
      </button>
    </div>
  );
}
