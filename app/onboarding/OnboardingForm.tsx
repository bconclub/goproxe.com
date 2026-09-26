'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStoredUser, storeUserProfile } from '../lib/chatLocalStorage';
import { submitLead } from '../lib/leads';
import styles from './onboarding.module.css';

export default function OnboardingForm() {
  const [brandName, setBrandName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const profile = getStoredUser();
    setBrandName(profile?.brandName || '');
    setWebsiteUrl(profile?.websiteUrl || '');
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    let website: URL;
    try {
      website = new URL(/^https?:\/\//i.test(websiteUrl.trim()) ? websiteUrl.trim() : `https://${websiteUrl.trim()}`);
      if (!['http:', 'https:'].includes(website.protocol) || !website.hostname.includes('.')) throw new Error();
    } catch {
      setError('Enter a valid website, such as yourbrand.com.');
      return;
    }
    const profile = { ...getStoredUser(), brandName: brandName.trim(), websiteUrl: website.href };
    storeUserProfile(profile);
    setBusy(true);
    const saved = await submitLead({ type: 'lead', name: profile.name, phone: profile.phone, email: profile.email,
      brandName: profile.brandName, websiteUrl: profile.websiteUrl, source: 'onboarding' });
    setBusy(false);
    if (!saved) {
      setError('Could not save your details. Please try again.');
      return;
    }
    setDone(true);
  }

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="onboarding-title">
        <Link href="/" className={styles.back}>← PROXe</Link>
        <h1 id="onboarding-title">{done ? 'Your details are saved.' : 'Set up your brand.'}</h1>
        {done ? (
          <div role="status"><p>We have your brand name and website. No payment required.</p><Link href="/">Back to PROXe</Link></div>
        ) : (
          <>
            <p>Two details to get started. No payment required.</p>
            <form onSubmit={submit}>
              <label htmlFor="onboarding-brand">Brand name</label>
              <input id="onboarding-brand" autoComplete="organization" required value={brandName}
                onChange={event => setBrandName(event.target.value)} pattern=".*\S.*" />
              <label htmlFor="onboarding-website">Website</label>
              <input id="onboarding-website" autoComplete="url" inputMode="url" required placeholder="yourbrand.com"
                value={websiteUrl} onChange={event => setWebsiteUrl(event.target.value)} />
              {error && <p role="alert">{error}</p>}
              <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Submit details'}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
