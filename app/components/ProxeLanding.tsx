'use client';

import { useEffect, useRef, useState } from 'react';
import { FiGlobe, FiMail, FiMessageSquare, FiPhone, FiRefreshCw, FiDatabase } from 'react-icons/fi';
import { SiInstagram, SiMessenger, SiWhatsapp } from 'react-icons/si';
import Grainient from './Grainient';
import VapiOrb from './VapiOrb';

/**
 * Voice call is now handled inline via the @vapi-ai/web SDK in <VapiOrb />.
 * The PROXe chat widget script is hidden on /proxe and /proxe-cfs (see
 * components/ProxeWidget) so the two voice surfaces don't fight for the mic.
 */

/* Icons kept tiny and inline so we don't add JS weight */
const Icon = {
  Wave: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="12" x2="4" y2="12" />
      <line x1="8" y1="8" x2="8" y2="16" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="16" y1="8" x2="16" y2="16" />
      <line x1="20" y1="12" x2="20" y2="12" />
    </svg>
  ),
  Play: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Capture: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
    </svg>
  ),
  Remember: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3a4 4 0 0 0-4 4v1a4 4 0 0 0-2 3.46A4 4 0 0 0 5 19v1a3 3 0 0 0 3 3h1V3z" />
      <path d="M15 3a4 4 0 0 1 4 4v1a4 4 0 0 1 2 3.46A4 4 0 0 1 19 19v1a3 3 0 0 1-3 3h-1V3z" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AcademicCap: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10L12 5 2 10l10 5 10-5z" />
      <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
    </svg>
  ),
  Clinic: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M12 10v6M9 13h6" />
    </svg>
  ),
  House: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </svg>
  ),
  Cart: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
      <path d="M3 4h2l2.6 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.5L21 8H6" />
    </svg>
  ),
  Dumbbell: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v16M2 8v8M10 6v12M14 6v12M18 4v16M22 8v8M10 12h4" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  ),
  Car: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14l2-6a2 2 0 0 1 2-1.5h10A2 2 0 0 1 19 8l2 6v4a1 1 0 0 1-1 1h-1a2 2 0 0 1-2-2H7a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1z" />
      <circle cx="7.5" cy="15" r="1" />
      <circle cx="16.5" cy="15" r="1" />
    </svg>
  ),
  Wrench: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a4 4 0 0 0 5 5l-8.8 8.8a2.8 2.8 0 0 1-4-4L15.7 7.3" />
    </svg>
  ),
  X: (props: { size?: number }) => (
    <svg width={props.size ?? 16} height={props.size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

/* ============ Reusable: RevealOnScroll (stagger animation) ============ */
function RevealOnScroll({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`proxe-reveal ${className}`}
      data-revealed={visible ? 'true' : 'false'}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/* ============ Reusable: FAQ Item ============ */
function FaqItem({ question, answer, placeholder }: { question: string; answer: string; placeholder?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="proxe-faq-item" data-open={open}>
      <button className="proxe-faq-trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{question}</span>
        <span className="proxe-faq-plus" aria-hidden="true" />
      </button>
      <div className="proxe-faq-body">
        <p className="proxe-faq-answer">
          {answer}
          {placeholder ? <span className="proxe-placeholder-tag">Placeholder</span> : null}
        </p>
      </div>
    </div>
  );
}

/* ============ Scroll Popup ============ */
function ScrollPopup({ triggerRef }: { triggerRef: React.RefObject<HTMLElement | null> }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('proxe-popup-shown') === '1') return;

    const target = triggerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.boundingClientRect.top < 0) {
            setOpen(true);
            sessionStorage.setItem('proxe-popup-shown', '1');
            observer.disconnect();
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -20% 0px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [triggerRef]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="proxe-popup-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proxe-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="proxe-popup-card">
        <div className="proxe-popup-label">See PROXe in Action</div>
        <h3 id="proxe-popup-title" className="proxe-popup-title">
          This is your Command Center
        </h3>
        <div className="proxe-popup-media" aria-label="Dashboard screenshot placeholder">
          DASHBOARD SCREENSHOT PLACEHOLDER
        </div>
        <div className="proxe-popup-actions">
          <a href="#book-demo" className="proxe-btn proxe-btn-primary" onClick={() => setOpen(false)}>
            Book a Demo
          </a>
          <button className="proxe-btn proxe-btn-ghost" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============ Channel Coverflow + Live Chat Preview ============ */
interface ChatMsg { from: 'customer' | 'ai'; text: string; time: string; }

const CHANNELS: Array<{ name: string; icon: React.ReactNode; accent: string; messages: ChatMsg[] }> = [
  {
    name: 'Voice', icon: <FiPhone />, accent: 'rgba(255,255,255,0.85)',
    messages: [
      { from: 'customer', text: 'I saw your product online. Curious about pricing.', time: '2:31 PM' },
      { from: 'ai',       text: 'Happy to help! Starter is $99/mo for 1,000 conversations. How many leads do you get monthly?', time: '2:31 PM' },
      { from: 'customer', text: 'Around 200 to 300 a month.', time: '2:32 PM' },
      { from: 'ai',       text: 'Starter covers that easily. Want me to set up your free trial right now? Takes 2 minutes.', time: '2:32 PM' },
    ],
  },
  {
    name: 'WhatsApp', icon: <SiWhatsapp />, accent: '#25D366',
    messages: [
      { from: 'customer', text: 'Hi, I filled a form 3 days ago but no one called me.', time: '10:14 AM' },
      { from: 'ai',       text: 'Hi! I can see your enquiry from May 6th. Are you free for a quick call today at 3pm or 5pm?', time: '10:14 AM' },
      { from: 'customer', text: '3pm works!', time: '10:15 AM' },
      { from: 'ai',       text: "Confirmed! Booked you in at 3pm. You'll get a reminder 15 min before. 🎯", time: '10:15 AM' },
    ],
  },
  {
    name: 'Messenger', icon: <SiMessenger />, accent: '#0084FF',
    messages: [
      { from: 'customer', text: 'Do you offer a free trial?', time: '4:02 PM' },
      { from: 'ai',       text: "Yes! 14-day free trial, no card needed. I can start you in 5 minutes. What's your business email?", time: '4:02 PM' },
      { from: 'customer', text: "Great. It's john@acme.com", time: '4:03 PM' },
      { from: 'ai',       text: 'Trial account created! Check your inbox. Login link and setup guide sent. 🎉', time: '4:03 PM' },
    ],
  },
  {
    name: 'Instagram', icon: <SiInstagram />, accent: '#E1306C',
    messages: [
      { from: 'customer', text: 'Saw your reel. How does this actually work?', time: '7:18 PM' },
      { from: 'ai',       text: 'PROXe catches every DM, replies in seconds, qualifies leads, and follows up until they buy. Want a live demo?', time: '7:18 PM' },
      { from: 'customer', text: 'Yes! How do I sign up?', time: '7:19 PM' },
      { from: 'ai',       text: "Drop your email here or tap the link in bio. You'll be set up in 2 minutes. 🚀", time: '7:19 PM' },
    ],
  },
  {
    name: 'Web', icon: <FiGlobe />, accent: '#A78BFA',
    messages: [
      { from: 'customer', text: 'What channels do you support?', time: '11:45 AM' },
      { from: 'ai',       text: 'WhatsApp, Instagram, Messenger, Voice, web chat, and email. All from one dashboard with shared memory.', time: '11:45 AM' },
      { from: 'customer', text: 'Does it sync with HubSpot?', time: '11:46 AM' },
      { from: 'ai',       text: 'Yes. Native HubSpot integration. Every conversation and lead score syncs automatically. Want to see it live?', time: '11:46 AM' },
    ],
  },
];

function ChannelCoverflow() {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [manualLock, setManualLock] = useState(false);
  const dragRef = useRef<{ startX: number; startActive: number; pointerId: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const len = CHANNELS.length;
  const STEP_PX = 70;

  // After a manual nav (arrow click), pause scroll-driven cycling so the user
  // can read the chat they selected.
  const lockManual = () => {
    setManualLock(true);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = setTimeout(() => setManualLock(false), 6000);
  };
  const goPrev = () => { setActive((a) => (a - 1 + len) % len); lockManual(); };
  const goNext = () => { setActive((a) => (a + 1) % len); lockManual(); };

  useEffect(() => () => { if (lockTimerRef.current) clearTimeout(lockTimerRef.current); }, []);

  useEffect(() => {
    if (dragging || manualLock) return;
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const progress = 1 - center / vh;
      const clamped = Math.max(0, Math.min(0.9999, progress));
      // 0.45 multiplier means a full pass through the section advances ~2 channels.
      // Slow enough to read each scenario without forcing manual nav.
      const next = Math.floor(clamped * len * 0.45) % len;
      setActive(next);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [dragging, manualLock, len]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setDragging(true);
    dragRef.current = { startX: e.clientX, startActive: active, pointerId: e.pointerId };
    try { containerRef.current?.setPointerCapture(e.pointerId); } catch { /* no-op */ }
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const next = ((dragRef.current.startActive + Math.round(-dx / STEP_PX)) % len + len) % len;
    if (next !== active) setActive(next);
  };
  const endDrag = (e?: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current && e) { try { containerRef.current?.releasePointerCapture(dragRef.current.pointerId); } catch { /* no-op */ } }
    dragRef.current = null;
    setDragging(false);
  };

  const channel = CHANNELS[active];

  return (
    <div ref={containerRef} className="proxe-coverflow-wrap" aria-label={`PROXe on ${CHANNELS.map(c => c.name).join(', ')}`}>
      {/* Icon picker with cycle arrows */}
      <div className="proxe-coverflow-row">
        <button type="button" className="proxe-coverflow-arrow" onClick={goPrev} aria-label="Previous channel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="proxe-coverflow" data-dragging={dragging}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
          onPointerUp={endDrag} onPointerCancel={endDrag}
        >
          <div className="proxe-coverflow-stage">
            {CHANNELS.map((c, i) => {
              let offset = i - active;
              if (offset > len / 2) offset -= len;
              if (offset < -len / 2) offset += len;
              const visible = Math.abs(offset) <= 2;
              return (
                <div key={c.name} className="proxe-coverflow-tile" data-offset={offset} data-visible={visible} aria-hidden={offset !== 0}>
                  {c.icon}
                </div>
              );
            })}
          </div>
          <div className="proxe-coverflow-label" aria-live="polite">{channel.name.toUpperCase()}</div>
        </div>
        <button type="button" className="proxe-coverflow-arrow" onClick={goNext} aria-label="Next channel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Native-looking chat preview — re-mounts on channel change to re-animate */}
      <div key={active} className="proxe-chat-shell" data-channel={channel.name.toLowerCase()}>
        <PlatformChat channel={channel} />
      </div>
    </div>
  );
}

/* ============ Platform-native chat UIs ============
   Each platform mimics its real-world app chrome — WhatsApp Web, Instagram DM,
   Messenger, Voice call, web widget. Wrapped by .proxe-chat-shell which adds
   the PROXe glass-card outer chrome (electric violet shadow + frosted edge). */

function PlatformChat({ channel }: { channel: typeof CHANNELS[number] }) {
  switch (channel.name) {
    case 'WhatsApp':  return <WhatsAppChat channel={channel} />;
    case 'Instagram': return <InstagramChat channel={channel} />;
    case 'Messenger': return <MessengerChat channel={channel} />;
    case 'Voice':     return <VoiceChat channel={channel} />;
    case 'Web':       return <WebChat channel={channel} />;
    default:          return null;
  }
}

/* ===== WhatsApp Web ===== */
function WhatsAppChat({ channel }: { channel: typeof CHANNELS[number] }) {
  return (
    <div className="wa-chat">
      <div className="wa-header">
        <div className="wa-avatar"><SiWhatsapp /></div>
        <div className="wa-meta">
          <div className="wa-name">PROXe</div>
          <div className="wa-status">typing<span className="wa-typing-ellipsis"><span /><span /><span /></span></div>
        </div>
      </div>
      <div className="wa-body">
        <div className="wa-day">TODAY</div>
        {channel.messages.map((m, i) => (
          <div key={i} className={`wa-row wa-row--${m.from}`} style={{ '--i': i } as React.CSSProperties}>
            <div className="wa-bubble">
              <span className="wa-text">{m.text}</span>
              <span className="wa-meta-line">
                <span className="wa-time">{m.time}</span>
                {m.from === 'customer' && (
                  <svg className="wa-ticks" viewBox="0 0 16 11" fill="none" aria-hidden="true">
                    <path d="M11.07.6 5.42 6.27 3.2 4.05l-.95.95 3.17 3.17L12.02 1.55z" fill="#53BDEB"/>
                    <path d="M15.06.6 9.41 6.27 7.18 4.04l-.95.95 3.18 3.18L16.01 1.55z" fill="#53BDEB"/>
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="wa-input">
        <span className="wa-input-pill">Type a message</span>
      </div>
    </div>
  );
}

/* ===== Instagram DM (dark) ===== */
function InstagramChat({ channel }: { channel: typeof CHANNELS[number] }) {
  return (
    <div className="ig-chat">
      <div className="ig-header">
        <div className="ig-avatar"><SiInstagram /></div>
        <div className="ig-meta">
          <div className="ig-name">proxe.ai <span className="ig-verified">✓</span></div>
          <div className="ig-status">Active now</div>
        </div>
      </div>
      <div className="ig-body">
        {channel.messages.map((m, i) => (
          <div key={i} className={`ig-row ig-row--${m.from}`} style={{ '--i': i } as React.CSSProperties}>
            <div className="ig-bubble">{m.text}</div>
          </div>
        ))}
        <div className="ig-row ig-row--ai" style={{ '--i': channel.messages.length } as React.CSSProperties}>
          <div className="ig-bubble ig-bubble--typing"><span /><span /><span /></div>
        </div>
      </div>
      <div className="ig-input">
        <span className="ig-input-pill">Message…</span>
        <span className="ig-actions">♡  ⌃</span>
      </div>
    </div>
  );
}

/* ===== Messenger (matches real Messenger: avatar-on-bubble + grouping) ===== */
function MessengerChat({ channel }: { channel: typeof CHANNELS[number] }) {
  // Group consecutive same-sender messages so bubble corners read as a thread,
  // and only the LAST bubble in an AI run carries the avatar.
  const isLastInRun = (i: number, from: ChatMsg['from']) =>
    i === channel.messages.length - 1 || channel.messages[i + 1].from !== from;
  const isFirstInRun = (i: number, from: ChatMsg['from']) =>
    i === 0 || channel.messages[i - 1].from !== from;

  return (
    <div className="ms-chat">
      <div className="ms-header">
        <div className="ms-h-left">
          <svg className="ms-h-back" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0084FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          <div className="ms-h-avatar">
            <SiMessenger />
            <span className="ms-h-online" />
          </div>
          <div className="ms-meta">
            <div className="ms-name">PROXe</div>
            <div className="ms-status">Active now</div>
          </div>
        </div>
        <div className="ms-icons">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0084FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </div>
      </div>
      <div className="ms-body">
        {channel.messages.map((m, i) => {
          const last = isLastInRun(i, m.from);
          const first = isFirstInRun(i, m.from);
          return (
            <div
              key={i}
              className={`ms-row ms-row--${m.from} ${last ? 'is-last' : ''} ${first ? 'is-first' : ''}`}
              style={{ '--i': i } as React.CSSProperties}
            >
              {m.from === 'ai' && (
                <div className="ms-bubble-avatar">
                  {last && <div className="ms-h-avatar ms-h-avatar--small"><SiMessenger /></div>}
                </div>
              )}
              <div className="ms-bubble">{m.text}</div>
            </div>
          );
        })}
        <div className="ms-row ms-row--ai is-last is-first" style={{ '--i': channel.messages.length } as React.CSSProperties}>
          <div className="ms-bubble-avatar">
            <div className="ms-h-avatar ms-h-avatar--small"><SiMessenger /></div>
          </div>
          <div className="ms-bubble ms-bubble--typing"><span /><span /><span /></div>
        </div>
      </div>
      <div className="ms-input">
        <span className="ms-plus">+</span>
        <span className="ms-input-pill">Aa</span>
        <span className="ms-thumb">👍</span>
      </div>
    </div>
  );
}

/* ===== Voice call ===== */
function VoiceChat({ channel }: { channel: typeof CHANNELS[number] }) {
  return (
    <div className="vc-chat">
      <div className="vc-header">
        <span className="vc-eyebrow">ON CALL</span>
        <span className="vc-timer">00:42</span>
      </div>
      <div className="vc-stage">
        <div className="vc-orb">
          <div className="vc-orb-pulse" />
          <div className="vc-orb-pulse vc-orb-pulse--2" />
          <div className="vc-orb-core">
            <FiPhone />
          </div>
        </div>
        <div className="vc-name">PROXe Voice</div>
        <div className="vc-sub">AI agent · Live transcript</div>
      </div>
      <div className="vc-transcript">
        {channel.messages.map((m, i) => (
          <div key={i} className={`vc-line vc-line--${m.from}`} style={{ '--i': i } as React.CSSProperties}>
            <span className="vc-speaker">{m.from === 'ai' ? 'PROXe' : 'Caller'}</span>
            <span className="vc-text">{m.text}</span>
          </div>
        ))}
        <div className="vc-line vc-line--ai vc-line--speaking" style={{ '--i': channel.messages.length } as React.CSSProperties}>
          <span className="vc-speaker">PROXe is speaking</span>
          <div className="vc-wave">
            {Array.from({ length: 14 }).map((_, i) => <span key={i} style={{ '--bar-i': i } as React.CSSProperties} />)}
          </div>
        </div>
      </div>
      <div className="vc-controls">
        <button className="vc-btn" aria-label="Mute"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg></button>
        <button className="vc-btn vc-btn--end" aria-label="End"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
        <button className="vc-btn" aria-label="Speaker"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg></button>
      </div>
    </div>
  );
}

/* ===== Web chat widget (matches the real PROXe deploy widget) ===== */
function WebChat({ channel }: { channel: typeof CHANNELS[number] }) {
  return (
    <div className="web-chat">
      <div className="web-header">
        <div className="web-brand">
          <img src="/proxe/brand/proxe-icon-white.webp" alt="" width={20} height={20} />
          <div className="web-name">PROXe</div>
        </div>
        <div className="web-header-actions">
          <button className="web-icon-btn" aria-label="Toggle theme">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          </button>
          <button className="web-icon-btn" aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div className="web-body">
        {channel.messages.map((m, i) => (
          <div key={i} className={`web-row web-row--${m.from}`} style={{ '--i': i } as React.CSSProperties}>
            <div className="web-bubble">{m.text}</div>
          </div>
        ))}
        <div className="web-quick">
          <button className="web-pill">Book a Demo</button>
          <button className="web-pill">Pricing</button>
        </div>
        <div className="web-row web-row--ai" style={{ '--i': channel.messages.length + 1 } as React.CSSProperties}>
          <div className="web-bubble web-bubble--typing"><span /><span /><span /></div>
        </div>
      </div>
      <div className="web-powered">Powered by <strong>PROXe</strong></div>
      <div className="web-input">
        <button className="web-circle-btn web-circle-btn--phone" aria-label="Call">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </button>
        <span className="web-input-pill">Type your message…</span>
        <button className="web-circle-btn web-circle-btn--send" aria-label="Send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ============ Integration Hub ============ */
const HUB_NODES = [
  { label: 'WhatsApp',  icon: <SiWhatsapp />,  x: 268, y: 30,  color: '#25D366' },
  { label: 'Instagram', icon: <SiInstagram />, x: 424, y: 120, color: '#E1306C' },
  { label: 'Messenger', icon: <SiMessenger />, x: 424, y: 320, color: '#0084FF' },
  { label: 'Voice',     icon: <FiPhone />,     x: 268, y: 410, color: '#A78BFA' },
  { label: 'Web Chat',  icon: <FiGlobe />,     x: 112, y: 320, color: '#7DD3FC' },
  { label: 'Email',     icon: <FiMail />,      x: 112, y: 120, color: '#FBBF24' },
];

const HUB_CHIPS = [
  { text: 'CRM Sync',       x: 386, y: 232 },
  { text: 'Auto Follow-up', x: 122, y: 256 },
  { text: '24/7 Capture',   x: 234, y: 138 },
];

function IntegrationHub() {
  const W = 600, H = 500;
  const cx = 300, cy = 250;

  return (
    <div className="proxe-hub-outer">
      <div className="proxe-hub-canvas">
        {/* SVG connection lines */}
        <svg
          className="proxe-hub-svg"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="hubCenterGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(124,58,237,0.35)" />
              <stop offset="100%" stopColor="rgba(124,58,237,0)" />
            </radialGradient>
          </defs>
          <circle cx={cx} cy={cy} r={100} fill="url(#hubCenterGlow)" />
          {HUB_NODES.map((node, i) => {
            const nx = node.x + 40;
            const ny = node.y + 40;
            const pathD = `M ${cx} ${cy} L ${nx} ${ny}`;
            return (
              <g key={i}>
                {/* Brand-tinted glow under each connecting line */}
                <line
                  x1={cx} y1={cy} x2={nx} y2={ny}
                  stroke={node.color}
                  strokeWidth={2}
                  strokeOpacity={0.18}
                  strokeLinecap="round"
                />
                {/* Crisp dashed line on top */}
                <line
                  x1={cx} y1={cy} x2={nx} y2={ny}
                  stroke="rgba(255,255,255,0.28)"
                  strokeWidth={1}
                  strokeDasharray="3 6"
                />
                <path id={`hub-path-${i}`} d={pathD} stroke="none" fill="none" />
                <circle r={4} fill={node.color} opacity={0.95}>
                  <animateMotion dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
                    <mpath href={`#hub-path-${i}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Orbit nodes — bare brand icons, no container */}
        {HUB_NODES.map((node, i) => (
          <div
            key={i}
            className="proxe-hub-node"
            style={{
              left: node.x,
              top: node.y,
              color: node.color,
              '--hub-delay': `${i * 0.5}s`,
            } as React.CSSProperties}
          >
            <div className="proxe-hub-node-icon">{node.icon}</div>
            <div className="proxe-hub-node-label">{node.label}</div>
          </div>
        ))}

        {/* Floating feature chips */}
        {HUB_CHIPS.map((chip, i) => (
          <div
            key={i}
            className="proxe-hub-chip"
            style={{
              left: chip.x,
              top: chip.y,
              '--hub-delay': `${0.25 + i * 0.35}s`,
            } as React.CSSProperties}
          >
            <span className="proxe-hub-chip-dot" aria-hidden="true" />
            {chip.text}
          </div>
        ))}

        {/* Center Proxe icon */}
        <div className="proxe-hub-center" aria-label="PROXe">
          <img src="/proxe/brand/proxe-icon-white.webp" alt="PROXe" width={46} height={46} />
        </div>
      </div>
    </div>
  );
}

/* ============ Main Landing ============ */
export default function ProxeLanding() {
  const pillarsRef = useRef<HTMLElement | null>(null);
  const videoIframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoFrameRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Play/pause the demo video based on viewport visibility.
  // Waits until >=50% of the frame is in view (i.e. the 3D fold-in has landed),
  // then sends Vimeo a `play`. Pauses again when the user scrolls away, for perf.
  useEffect(() => {
    const iframe = videoIframeRef.current;
    if (!iframe) return;
    const target = iframe.parentElement;
    if (!target) return;

    const send = (method: 'play' | 'pause') => {
      iframe.contentWindow?.postMessage(
        JSON.stringify({ method }),
        'https://player.vimeo.com'
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) send('play');
          else send('pause');
        });
      },
      { threshold: 0.5 }
    );

    io.observe(target);
    return () => io.disconnect();
  }, []);

  // 3D landing animation: tilt the video frame until it scrolls into view.
  // Skip on large screens where the frame is already visible at page load.
  useEffect(() => {
    const frame = videoFrameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    if (rect.top < window.innerHeight) return; // already in view — skip tilt
    frame.classList.add('proxe-landing-ready');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame.classList.remove('proxe-landing-ready');
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, []);

  const toggleVideoMute = () => {
    const iframe = videoIframeRef.current;
    if (!iframe?.contentWindow) return;
    const nextMuted = !videoMuted;
    // Vimeo Player API over postMessage
    iframe.contentWindow.postMessage(
      JSON.stringify({ method: 'setMuted', value: nextMuted }),
      'https://player.vimeo.com'
    );
    if (!nextMuted) {
      iframe.contentWindow.postMessage(
        JSON.stringify({ method: 'setVolume', value: 1 }),
        'https://player.vimeo.com'
      );
    }
    setVideoMuted(nextMuted);
  };

  return (
    <main className="proxe-main">
      {/* ===== Site-wide animated gradient backdrop ===== */}
      <div className="proxe-page-grainient" aria-hidden="true">
        <Grainient
          color1="#7C3AED"
          color2="#4C1D95"
          color3="#1E1B4B"
          timeSpeed={0.22}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* ===== 1. Floating boxed header (logo + CTA in a centered constrained-width row) ===== */}
      <div className="proxe-float-header" data-scrolled={scrolled ? 'true' : 'false'}>
        <a href="#" className="proxe-float-logo" aria-label="PROXe home">
          {/* Over hero: white full wordmark */}
          <img
            src="/proxe/brand/proxe-logo-white.webp"
            alt="PROXe"
            className="proxe-nav-logo-full proxe-nav-logo--light"
          />
          {/* Scrolled icon: white glyph (gradient is site-wide) */}
          <img
            src="/proxe/brand/proxe-icon-white.webp"
            alt=""
            aria-hidden="true"
            className="proxe-nav-logo-icon"
          />
        </a>
        <a href="#book-demo" className="proxe-float-cta">
          {/* Two labels — full on top, short when [data-scrolled='true']. */}
          <span className="proxe-float-cta-full">Deploy PROXe</span>
          <span className="proxe-float-cta-short" aria-hidden="true">Deploy</span>
        </a>
      </div>

      {/* ===== 2. Hero ===== */}
      <section className="proxe-hero" id="product">

        <div className="proxe-container proxe-hero-inner">
          <div className="proxe-hero-eyebrow">AI Customer Acquisition</div>
          <h1 className="proxe-hero-title">
            Never Miss a Lead
            <br />
            Ever Again.
          </h1>
          <p className="proxe-hero-subtitle">
            PROXe runs the full pipeline. Captures leads across channels, nurtures, scores, and pushes the ready-to-buy ones to you.
          </p>
          <div className="proxe-hero-ctas">
            <a href="#voice" className="proxe-hero-big-cta">
              What&rsquo;s PROXe?
              <span className="proxe-hero-big-cta-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ===== Hero video (scroll-reveal scale-up + mute toggle) ===== */}
      <section className="proxe-hero-video" aria-label="PROXe product demo">
        <div className="proxe-hero-video-frame" ref={videoFrameRef}>
          <div className="proxe-hero-video-inner">
            <iframe
              ref={videoIframeRef}
              src="https://player.vimeo.com/video/1182869056?autoplay=1&muted=1&loop=1&controls=0&byline=0&title=0&portrait=0&dnt=1&api=1&transparent=1&background=0&playsinline=1"
              title="PROXe demo"
              allow="autoplay; fullscreen; picture-in-picture"
              frameBorder={0}
              loading="lazy"
              allowFullScreen
            />
            <button
              type="button"
              className="proxe-hero-video-mute"
              onClick={toggleVideoMute}
              aria-label={videoMuted ? 'Unmute demo video' : 'Mute demo video'}
              aria-pressed={!videoMuted}
            >
              {videoMuted ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
              <span>{videoMuted ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===== 6. Channel dial ===== */}
      <section className="proxe-problem">
        <div className="proxe-container">
          <h2 className="proxe-problem-line">Leads don&rsquo;t wait. Neither does PROXe.</h2>
          <p className="proxe-problem-sub">PROXe captures, follows up, and pushes leads to close across channels. One AI brain. Full context. Always on.</p>
          <ChannelCoverflow />
        </div>
      </section>

      {/* ===== 7. Three pillars — sticky stack ===== */}
      <section className="proxe-section proxe-pillars-section" id="features" ref={pillarsRef}>
        <div className="proxe-container">
          <div className="proxe-section-label">The PROXe System</div>
          <div className="proxe-pillars-list">
            {([
              {
                icon: <Icon.Capture />,
                title: 'Capture',
                desc: 'Every inquiry, every channel, 24/7. Nothing slips through.',
                videoSrc: null as string | null,
                gradient: 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(30,10,80,0.55) 100%)',
              },
              {
                icon: <Icon.Remember />,
                title: 'Nurture',
                desc: 'Stay in every conversation. One thread across channels. Customers never repeat themselves.',
                videoSrc: null as string | null,
                gradient: 'linear-gradient(135deg, rgba(76,29,149,0.4) 0%, rgba(20,10,60,0.55) 100%)',
              },
              {
                icon: <Icon.Close />,
                title: 'Close',
                desc: 'Auto follow-ups until they book, buy, or say no.',
                videoSrc: null as string | null,
                gradient: 'linear-gradient(135deg, rgba(99,40,180,0.35) 0%, rgba(15,8,50,0.55) 100%)',
              },
            ] as const).map((pillar, i) => (
              <div
                key={pillar.title}
                className="proxe-pillar-row"
                style={{ '--pillar-index': i } as React.CSSProperties}
              >
                <div className="proxe-pillar-content">
                  <div className="proxe-pillar-icon">{pillar.icon}</div>
                  <h3 className="proxe-pillar-title">{pillar.title}</h3>
                  <p className="proxe-pillar-desc">{pillar.desc}</p>
                </div>
                <div className="proxe-pillar-video">
                  {pillar.videoSrc ? (
                    <iframe
                      src={pillar.videoSrc}
                      title={`PROXe ${pillar.title} demo`}
                      allow="autoplay; fullscreen; picture-in-picture"
                      frameBorder={0}
                      allowFullScreen
                    />
                  ) : (
                    <div className="proxe-pillar-video-placeholder" style={{ background: pillar.gradient }}>
                      <div className="proxe-pillar-video-play">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="proxe-pillar-video-caption">{pillar.title} in action</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Voice demo — gradient orb "click to talk" (moved up to sit right after pillars) ===== */}
      <section className="proxe-section" id="voice">
        <div className="proxe-container">
          <div className="proxe-section-label" style={{ textAlign: 'center' }}>
            Hear it Live
          </div>
          <div className="proxe-voice">
            <h2 className="proxe-voice-title">See PROXe in action.</h2>
            <VapiOrb />
          </div>
        </div>
      </section>

      {/* ===== 8. Scroll-triggered popup — disabled for now ===== */}
      {/* <ScrollPopup triggerRef={pillarsRef} /> */}

      {/* ===== 9. Feature grid ===== */}
      <section className="proxe-section">
        <div className="proxe-container">
          <div className="proxe-section-label">Capabilities</div>
          <div className="proxe-feature-grid">
            {[
              { label: '01', title: '24/7 Lead Capture', desc: 'Every channel listens all day. No form, message, or call is missed.' },
              { label: '02', title: 'Unified Memory', desc: 'One thread across channels. Context travels with the customer.' },
              { label: '03', title: 'Auto Follow-Ups', desc: 'Sequenced nudges until they book, buy, or opt out.' },
              { label: '04', title: 'Multi-Agents Across Channels', desc: 'Dedicated agents for web, WhatsApp, voice, email, and SMS. One brain behind them all.' },
              { label: '05', title: 'Command Center', desc: 'One dashboard for every conversation, lead, and metric.' },
              { label: '06', title: 'Enterprise Security', desc: 'SOC2-aligned controls, encrypted at rest and in transit.' },
            ].map((f) => (
              <article key={f.title} className="proxe-feature-card">
                <span className="proxe-feature-label">{f.label}</span>
                <h3 className="proxe-feature-title">{f.title}</h3>
                <p className="proxe-feature-desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. Use cases ===== */}
      <section className="proxe-section">
        <div className="proxe-container">
          <div className="proxe-section-label">Built For</div>
          <div className="proxe-usecase-grid">
            {[
              {
                icon: <Icon.AcademicCap />,
                title: 'Coaching Academies',
                desc: 'Capture student inquiries, qualify intent, book consultations automatically.',
              },
              {
                icon: <Icon.Clinic />,
                title: 'Clinics & Healthcare',
                desc: 'Handle appointment requests across WhatsApp and calls. Never miss a patient.',
              },
              {
                icon: <Icon.House />,
                title: 'Real Estate',
                desc: 'Qualify buyers, book site visits, follow up until the deal closes.',
              },
              {
                icon: <Icon.Cart />,
                title: 'D2C & E-commerce',
                desc: 'Recover abandoned carts, answer product questions, nudge hesitant buyers.',
              },
              {
                icon: <Icon.Dumbbell />,
                title: 'Fitness & Wellness',
                desc: 'Convert trial signups, reduce no-shows, re-engage lapsed members.',
              },
              {
                icon: <Icon.Briefcase />,
                title: 'Professional Services',
                desc: 'Qualify leads, book discovery calls, route hot prospects to partners.',
              },
              {
                icon: <Icon.Car />,
                title: 'Auto Dealerships',
                desc: 'Answer inventory questions around the clock, book test drives, reactivate cold leads.',
              },
              {
                icon: <Icon.Wrench />,
                title: 'Home Services',
                desc: 'Dispatch jobs fast. Capture, qualify, and schedule every service request.',
              },
            ].map((u) => (
              <article key={u.title} className="proxe-usecase-card">
                <div className="proxe-usecase-icon">{u.icon}</div>
                <h3 className="proxe-usecase-title">{u.title}</h3>
                <p className="proxe-usecase-desc">{u.desc}</p>
                <div className="proxe-usecase-stat">
                  Stat here <span className="proxe-placeholder-tag">Placeholder</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 12. Pricing ===== */}
      <section className="proxe-section" id="pricing">
        <div className="proxe-container">
          <div className="proxe-section-label" style={{ textAlign: 'center' }}>
            Pricing
          </div>
          <div className="proxe-pricing-grid">
            <div className="proxe-pricing-card">
              <h3 className="proxe-pricing-name">Starter</h3>
              <div className="proxe-pricing-price">
                $99<small>/mo</small>
              </div>
              <ul className="proxe-pricing-features">
                <li>1,000 conversations</li>
                <li>All channels</li>
                <li>Unified inbox</li>
                <li>Auto follow-ups</li>
              </ul>
              <a href="#book-demo" className="proxe-btn proxe-btn-ghost">
                Start Free Trial
              </a>
            </div>

            <div className="proxe-pricing-card popular">
              <span className="proxe-pricing-badge">Most Popular</span>
              <h3 className="proxe-pricing-name">Unlimited</h3>
              <div className="proxe-pricing-price">
                $199<small>/mo</small>
              </div>
              <ul className="proxe-pricing-features">
                <li>Unlimited conversations</li>
                <li>All channels</li>
                <li>Unified inbox</li>
                <li>Priority support</li>
              </ul>
              <a href="#book-demo" className="proxe-btn proxe-btn-primary">
                Start Free Trial
              </a>
            </div>
          </div>
          <div className="proxe-pricing-note">
            Need custom? <a href="#book-demo">Book a call.</a>
          </div>
        </div>
      </section>

      {/* ===== 13. Testimonials ===== */}
      <section className="proxe-section">
        <div className="proxe-container">
          <div className="proxe-section-label">What Founders Say</div>
          <div className="proxe-testimonials-scroll">
            {[
              {
                quote: 'PROXe replied to a WhatsApp lead at 2am and booked a demo before my team woke up.',
                author: 'Founder, Placeholder Academy',
              },
              {
                quote: 'Cold leads from four months ago are closing again. Nothing else moved that number.',
                author: 'COO, Placeholder Clinic',
              },
              {
                quote: 'Our SDR team stopped chasing. They just close the ones PROXe hands them.',
                author: 'CEO, Placeholder Realty',
              },
            ].map((t, i) => (
              <article key={i} className="proxe-testimonial-card">
                <p className="proxe-testimonial-quote">
                  &ldquo;{t.quote}&rdquo;
                  <span className="proxe-placeholder-tag">Placeholder</span>
                </p>
                <div className="proxe-testimonial-author">{t.author}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 14. FAQ ===== */}
      <section className="proxe-section" id="faq">
        <div className="proxe-container">
          <div className="proxe-section-label" style={{ textAlign: 'center' }}>
            FAQ
          </div>
          <div className="proxe-faq">
            <FaqItem
              question="How fast is setup?"
              answer="Most teams are live in under a week. We plug into your existing channels and CRM, configure the voice and flows, and go."
            />
            <FaqItem
              question="Do you integrate with my CRM?"
              answer="Yes. Native connections to the common CRMs and a generic webhook option for anything custom."
              placeholder
            />
            <FaqItem
              question="What channels are supported?"
              answer="Website chat, WhatsApp, Voice, Email, SMS, and Instagram DMs today. More on request."
            />
            <FaqItem
              question="Is my data secure?"
              answer="Encrypted at rest and in transit. Role-based access. We do not train shared models on your conversations."
              placeholder
            />
            <FaqItem
              question="Can my team take over conversations?"
              answer="Anytime. Jump into any thread from the Command Center. PROXe hands over cleanly and resumes on your signal."
            />
            <FaqItem
              question="What happens after 1000 conversations on Starter?"
              answer="You can upgrade to Unlimited anytime. If you cross the limit mid-month, we keep things running and true-up at renewal."
              placeholder
            />
          </div>
        </div>
      </section>

      {/* ===== 15. Footer CTA ===== */}
      <section className="proxe-footer-cta" id="book-demo">
        <div className="proxe-container">
          <h2 className="proxe-footer-cta-title">Stop losing leads. Start closing them.</h2>
          <a href="mailto:hello@bconclub.com?subject=PROXe%20Demo" className="proxe-btn proxe-btn-primary">
            Book a Demo
          </a>
        </div>
      </section>

      {/* ===== 16. Footer ===== */}
      <footer className="proxe-footer">
        <div className="proxe-container">
          <div className="proxe-footer-grid">
            <div>
              <img
                src="/proxe/brand/proxe-logo-white.webp"
                alt="PROXe"
                className="proxe-footer-logo"
              />
              <p className="proxe-footer-brand-tagline">
                The AI customer acquisition system. Every channel. One memory. Always on.
              </p>
            </div>
            <div>
              <div className="proxe-footer-col-title">Product</div>
              <ul className="proxe-footer-links">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#voice">Live Demo</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="proxe-footer-col-title">Company</div>
              <ul className="proxe-footer-links">
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="mailto:hello@bconclub.com">Contact</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
            <div>
              <div className="proxe-footer-col-title">Legal</div>
              <ul className="proxe-footer-links">
                <li>
                  <a href="/privacy">Privacy</a>
                </li>
                <li>
                  <a href="/privacy">Terms</a>
                </li>
              </ul>
              <div className="proxe-footer-col-title" style={{ marginTop: 20 }}>
                Social
              </div>
              <div className="proxe-footer-socials">
                <a href="#" aria-label="X / Twitter">
                  <Icon.X size={14} />
                </a>
                <a href="#" aria-label="LinkedIn">
                  in
                </a>
                <a href="#" aria-label="Instagram">
                  ig
                </a>
              </div>
            </div>
          </div>
          <div className="proxe-footer-copyright">© 2026 PROXe by BCON Club.</div>
        </div>
      </footer>
    </main>
  );
}
