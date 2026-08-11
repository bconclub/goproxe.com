'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDeployModal } from '../../contexts/DeployModalContext';
import { track } from '../../lib/analytics';
import WhatsAppHeaderButton from '../shared/WhatsAppHeaderButton';

/**
 * The industry pages' header, the SAME floating boxed header the homepage
 * uses: identical classes (landing.css is loaded on these pages), identical
 * logo assets and wordmark-to-icon swap, identical glass Deploy pill with the
 * full-to-short label collapse on scroll. Only differences: the logo links
 * back to the homepage, and the CTA source is tagged per industry.
 */
export default function IndustryHeader({ slug }: { slug: string }) {
  const { startDeploy } = useDeployModal();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="proxe-float-header" data-scrolled={scrolled ? 'true' : 'false'}>
      <Link href="/" className="proxe-float-logo" aria-label="PROXe home">
        <img
          src="/proxe/brand/proxe-logo-white.webp"
          alt="PROXe"
          className="proxe-nav-logo-full proxe-nav-logo--light"
        />
        <img
          src="/proxe/brand/proxe-icon-white.webp"
          alt=""
          aria-hidden="true"
          className="proxe-nav-logo-icon"
        />
      </Link>
      <div className="proxe-float-actions">
        <WhatsAppHeaderButton location={`industry_${slug}`} />
        <button
          type="button"
          className="proxe-float-cta"
          onClick={() => {
            track('industry_cta_click', { industry: slug, target: 'deploy_header' });
            void startDeploy(`industry_${slug}`);
          }}
        >
          <span className="proxe-float-cta-full">Deploy PROXe</span>
          <span className="proxe-float-cta-short" aria-hidden="true">Deploy</span>
        </button>
      </div>
    </div>
  );
}
