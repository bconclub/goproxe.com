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
interface WaCard { gradient: string; icon: string; title: string; subtitle: string; btns: Array<{ label: string; icon: string }> }
interface ConvMsg {
  from: 'lead' | 'proxe';
  text?: string;
  time?: string;
  type?: 'carousel' | 'bookdemo';
  cards?: WaCard[];
  quickReplies?: string[];
  delay?: number;
  noTyping?: boolean;
}

/* Reveals messages sequentially with typing indicator before proxe replies. Loops. */
function useConversationPlayer(msgs: ConvMsg[], isActive: boolean) {
  const [shownCount, setShownCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isActive) { setShownCount(0); setIsTyping(false); return; }

    let stopped = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function run() {
      if (stopped) return;
      setShownCount(0); setIsTyping(false);
      let t = 500;
      timers.push(setTimeout(() => { if (!stopped) setShownCount(1); }, t));

      for (let i = 0; i < msgs.length - 1; i++) {
        t += msgs[i].delay ?? 1200;
        const next = msgs[i + 1];
        if (next.from === 'proxe' && !next.noTyping) {
          const tt = t;
          timers.push(setTimeout(() => { if (!stopped) setIsTyping(true); }, tt));
          t += 950;
        }
        const tr = t; const count = i + 2;
        timers.push(setTimeout(() => { if (!stopped) { setIsTyping(false); setShownCount(count); } }, tr));
      }
      t += (msgs[msgs.length - 1].delay ?? 1200) + 4000;
      timers.push(setTimeout(() => { if (!stopped) run(); }, t));
    }

    run();
    return () => { stopped = true; timers.forEach(clearTimeout); };
  }, [isActive]);

  return { shownCount, isTyping };
}

/* ===== Industries (scrolling showcase) ===== */
const INDUSTRIES = [
  {
    name: 'Beauty',
    leftImg: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Wellness',
    leftImg: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Medspa',
    leftImg: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Health',
    leftImg: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Fitness',
    leftImg: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Self-Care',
    leftImg: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Services',
    leftImg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=360&h=500&fit=crop&q=80',
  },
];

function IndustryScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollableHeight = rect.height - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
      const idx = Math.min(INDUSTRIES.length - 1, Math.floor(progress * INDUSTRIES.length));
      setActiveIndex(idx);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ITEM_H = 88; // px — fixed row height for each name item
  const VISIBLE_H = 440; // px — height of the visible names window
  // Keep active item centered vertically in the window
  const listShift = VISIBLE_H / 2 - ITEM_H / 2 - activeIndex * ITEM_H;

  return (
    <div
      ref={sectionRef}
      className="proxe-ind-section"
      style={{ height: `calc(${INDUSTRIES.length + 1} * 80vh)` }}
    >
      <div className="proxe-ind-sticky">
        <p className="proxe-ind-eyebrow">Powering growth across</p>

        <div className="proxe-ind-layout">
          {/* ── Left photos ── */}
          <div className="proxe-ind-photos-wrap proxe-ind-photos-wrap--left">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name + '-left'}
                className="proxe-ind-photo proxe-ind-photo--left"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
              >
                <img src={ind.leftImg} alt={ind.name} />
              </div>
            ))}
          </div>

          {/* ── Center name scroll ── */}
          <div className="proxe-ind-center">
            <div
              className="proxe-ind-names"
              style={{ transform: `translateY(${listShift}px)` }}
            >
              {INDUSTRIES.map((ind, i) => {
                const dist = Math.abs(i - activeIndex);
                const isActive = dist === 0;
                const fontSize =
                  isActive ? 74 : dist === 1 ? 42 : dist === 2 ? 32 : 24;
                const opacity =
                  isActive ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.22 : 0.08;
                const color = isActive ? '#ffffff' : 'rgba(255,255,255,0.9)';

                return (
                  <div
                    key={ind.name}
                    className="proxe-ind-item"
                    style={{ height: `${ITEM_H}px`, opacity }}
                  >
                    <span
                      className="proxe-ind-item-name"
                      style={{ fontSize: `${fontSize}px`, color }}
                    >
                      {ind.name}
                      {isActive && (
                        <svg
                          className="proxe-ind-arrow"
                          width="48"
                          height="28"
                          viewBox="0 0 48 28"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 14h44M32 4l12 10-12 10"
                            stroke="#CDFC2E"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right photos ── */}
          <div className="proxe-ind-photos-wrap proxe-ind-photos-wrap--right">
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.name + '-right'}
                className="proxe-ind-photo proxe-ind-photo--right"
                style={{ opacity: i === activeIndex ? 1 : 0 }}
              >
                <img src={ind.rightImg} alt={ind.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot progress indicator */}
        <div className="proxe-ind-dots" aria-hidden="true">
          {INDUSTRIES.map((ind, i) => (
            <span
              key={ind.name}
              className="proxe-ind-dot"
              data-active={i === activeIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const CHANNELS: Array<{ name: string; icon: React.ReactNode; accent: string; messages: ConvMsg[] }> = [
  {
    name: 'WhatsApp', icon: <SiWhatsapp />, accent: '#25D366',
    messages: [
      { from: 'lead',  text: 'Hi, what services do you offer?', time: '10:13 AM' },
      { from: 'proxe', text: 'Hey! We help businesses capture every lead and never lose a follow up. Are you looking for help with your website, WhatsApp, or calls?', time: '10:13 AM' },
      { from: 'proxe', type: 'carousel', noTyping: true, time: '10:13 AM', cards: [
        { gradient: 'linear-gradient(135deg,#0a4a3a,#1a8a5a)', icon: '🎯', title: 'Lead Capture', subtitle: 'Capture and qualify leads 24/7 across every channel automatically.', btns: [{ label: 'Learn More', icon: '↗' }, { label: 'Get Started', icon: '→' }] },
        { gradient: 'linear-gradient(135deg,#0d3a6e,#1565C0)', icon: '📅', title: 'Appointment Booking', subtitle: 'Let customers self-book. Reminders sent automatically.', btns: [{ label: 'Learn More', icon: '↗' }, { label: 'Book Now', icon: '→' }] },
      ]},
      { from: 'lead',  text: 'Book Now', time: '10:14 AM' },
      { from: 'proxe', text: 'Great choice! When works for you?', time: '10:14 AM', quickReplies: ['Today 3pm', 'Today 5pm', 'Tomorrow 10am'] },
    ],
  },
  {
    name: 'Web', icon: <FiGlobe />, accent: '#A78BFA',
    messages: [
      { from: 'lead',  text: 'Hi, I visited your site at 2am. Just checking if anyone is there.' },
      { from: 'proxe', text: 'Hey, always here. What can I help you with?' },
      { from: 'lead',  text: 'We run a travel agency and lose a lot of inquiries overnight.' },
      { from: 'proxe', text: 'That is exactly the problem PROXe solves. Every overnight inquiry gets a reply in seconds. By morning your team wakes up to qualified leads. Want a quick walkthrough?' },
      { from: 'lead',  text: 'Yes please' },
      { from: 'proxe', text: 'Done. Booking link sent to your email. See you tomorrow.' },
    ],
  },
  {
    name: 'Instagram', icon: <SiInstagram />, accent: '#E1306C',
    messages: [
      { from: 'lead',  text: 'Just commented on your post. Do you work with coaching businesses?' },
      { from: 'proxe', text: 'Yes absolutely. Most coaches we work with were losing leads in their DMs. PROXe handles Instagram, WhatsApp, and website all in one. How many DMs do you get a week roughly?' },
      { from: 'lead',  text: 'Maybe 30 to 40' },
      { from: 'proxe', text: 'And how many convert right now?' },
      { from: 'lead',  text: 'Maybe 5 or 6' },
      { from: 'proxe', text: 'PROXe typically gets that to 15 plus. Want to see how?', type: 'bookdemo' },
    ],
  },
  {
    name: 'Messenger', icon: <SiMessenger />, accent: '#0084FF',
    messages: [
      { from: 'lead',  text: 'Hey I saw your Facebook ad. Is this real or just another chatbot?' },
      { from: 'proxe', text: 'Completely real. PROXe is a full AI system, not a chatbot. It captures leads, follows up for days, and books calls for you. What kind of business do you run?' },
      { from: 'lead',  text: 'Real estate. We miss leads all the time after hours.' },
      { from: 'proxe', text: 'That is exactly what PROXe fixes. Responds in under 30 seconds at 3am if needed. Want to see a quick demo?' },
      { from: 'lead',  text: 'Sure send me something' },
      { from: 'proxe', text: 'Booking link sent. Pick any slot that works and we will show you the whole thing live.' },
    ],
  },
  {
    name: 'Voice', icon: <FiPhone />, accent: 'rgba(255,255,255,0.85)',
    messages: [
      { from: 'lead',  text: 'Hi, I saw your ad online. What do you guys do exactly?', delay: 1500 },
      { from: 'proxe', text: 'Hey, thanks for calling. We help service businesses never miss a lead. Every inquiry on WhatsApp, your website, and calls gets handled instantly. Want me to walk you through how it works for your business?', delay: 1500 },
      { from: 'lead',  text: 'Yeah sure, we run a clinic.', delay: 1500 },
      { from: 'proxe', text: 'Perfect. For clinics we handle appointment bookings, patient inquiries, and follow ups automatically. How many calls do you miss on a typical day?', delay: 1500 },
      { from: 'lead',  text: 'Honestly maybe 10 to 15.', delay: 1500 },
      { from: 'proxe', text: 'That is a lot of lost patients. Want to book a quick demo? I can check availability right now.', delay: 1500 },
      { from: 'lead',  text: 'Yes please.', delay: 1500 },
      { from: 'proxe', text: 'Great. I have tomorrow 11am and 3pm open. Which works?', delay: 1500 },
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
      const section = el.closest('.proxe-problem') as HTMLElement | null;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const scrollable = section.scrollHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / scrollable));
      const next = Math.min(len - 1, Math.floor(progress * len));
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

  return (
    <div ref={containerRef} className="proxe-coverflow-wrap" aria-label={`PROXe on ${CHANNELS.map(c => c.name).join(', ')}`}>
      {/* Left: curved vertical channel list */}
      <div className="proxe-channel-list">
        {CHANNELS.map((c, i) => {
          const dist = Math.abs(i - active);
          return (
            <button
              key={c.name}
              type="button"
              className="proxe-channel-item"
              data-active={i === active}
              onClick={() => { setActive(i); lockManual(); }}
              aria-label={c.name}
              style={{
                transform: `translateX(${dist === 0 ? 0 : -dist * 14}px)`,
                opacity: Math.max(0.35, 1 - dist * 0.2),
              }}
            >
              <span className="proxe-channel-item-icon">{c.icon}</span>
              <span className="proxe-channel-item-name">{c.name}</span>
              {i === active && <span className="proxe-channel-item-dot" />}
            </button>
          );
        })}
      </div>

      {/* Right: all 5 mocks always mounted (stable keys = no remount = real CSS
          transitions). Inline styles drive the values so transition fires. */}
      <div className="proxe-mocks-stack">
        {CHANNELS.map((ch, i) => {
          const offset = (i - active + len) % len;
          const style: React.CSSProperties =
            offset === 0
              ? { opacity: 1, transform: 'translateX(-50%) translateY(0px) scale(1)', zIndex: 2, pointerEvents: 'auto', filter: 'none' }
              : { opacity: 0, transform: 'translateX(-50%) translateY(16px) scale(0.96)', zIndex: 1, pointerEvents: 'none', filter: 'blur(2px)' };
          return (
            <div
              key={ch.name}
              className="proxe-phone-frame"
              data-channel={ch.name.toLowerCase()}
              aria-hidden={offset !== 0}
              style={style}
            >
              {/* Side buttons rendered outside overflow:hidden */}
              <span className="proxe-phone-btn proxe-phone-btn--vol" aria-hidden="true" />
              <span className="proxe-phone-btn proxe-phone-btn--pwr" aria-hidden="true" />
              {/* Device body — overflow:hidden clips screen to rounded corners */}
              <div className="proxe-phone-outer">
                <div className="proxe-phone-notch">
                  <span className="proxe-phone-cam-pill" />
                </div>
                <div className="proxe-chat-shell">
                  <PlatformChat channel={ch} isActive={i === active} />
                </div>
                <div className="proxe-phone-home">
                  <span className="proxe-phone-home-bar" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============ Platform-native chat UIs ============
   Each platform mimics its real-world app chrome — WhatsApp Web, Instagram DM,
   Messenger, Voice call, web widget. Wrapped by .proxe-chat-shell which adds
   the PROXe glass-card outer chrome (electric violet shadow + frosted edge). */

function PlatformChat({ channel, isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  switch (channel.name) {
    case 'WhatsApp':  return <WhatsAppChat channel={channel} isActive={isActive} />;
    case 'Instagram': return <InstagramChat channel={channel} isActive={isActive} />;
    case 'Messenger': return <MessengerChat channel={channel} isActive={isActive} />;
    case 'Voice':     return <VoiceChat channel={channel} isActive={isActive} />;
    case 'Web':       return <WebChat channel={channel} isActive={isActive} />;
    default:          return null;
  }
}

/* ===== WhatsApp Web ===== */
function WhatsAppChat({ channel, isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  const { shownCount, isTyping } = useConversationPlayer(channel.messages, isActive);
  const visible = channel.messages.slice(0, shownCount);

  return (
    <div className="wa-chat">
      <div className="wa-header">
        <div className="wa-avatar"><SiWhatsapp /></div>
        <div className="wa-meta">
          <div className="wa-name">PROXe</div>
          <div className="wa-status">
            {isTyping
              ? <>typing<span className="wa-typing-ellipsis"><span /><span /><span /></span></>
              : 'online'}
          </div>
        </div>
      </div>
      <div className="wa-body">
        <div className="wa-day">TODAY</div>
        {visible.map((m, i) => {
          if (m.type === 'carousel' && m.cards) {
            return (
              <div key={i} className="wa-row wa-row--ai conv-msg-in">
                <div className="wa-carousel-wrap">
                  <div className="wa-carousel wa-carousel--duo">
                    {m.cards.map((card, ci) => (
                      <div key={ci} className="wa-card">
                        <div className="wa-card-img" style={{ background: card.gradient }}>
                          <span className="wa-card-img-icon">{card.icon}</span>
                        </div>
                        <div className="wa-card-body">
                          <div className="wa-card-title">{card.title}</div>
                          <div className="wa-card-sub">{card.subtitle}</div>
                        </div>
                        <div className="wa-card-actions">
                          {card.btns.map((btn, bi) => (
                            <button key={bi} className="wa-card-btn">{btn.label}</button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {m.time && <span className="wa-time wa-carousel-time">{m.time}</span>}
                </div>
              </div>
            );
          }
          const side = m.from === 'proxe' ? 'ai' : 'customer';
          return (
            <div key={i} className={`wa-row wa-row--${side} conv-msg-in`}>
              <div className="wa-bubble">
                {m.text && <span className="wa-text">{m.text}</span>}
                {m.quickReplies && (
                  <div className="wa-qr-row">
                    {m.quickReplies.map((qr, qi) => <span key={qi} className="wa-qr-btn">{qr}</span>)}
                  </div>
                )}
                <span className="wa-meta-line">
                  {m.time && <span className="wa-time">{m.time}</span>}
                  {m.from === 'lead' && (
                    <svg className="wa-ticks" viewBox="0 0 16 11" fill="none" aria-hidden="true">
                      <path d="M11.07.6 5.42 6.27 3.2 4.05l-.95.95 3.17 3.17L12.02 1.55z" fill="#53BDEB"/>
                      <path d="M15.06.6 9.41 6.27 7.18 4.04l-.95.95 3.18 3.18L16.01 1.55z" fill="#53BDEB"/>
                    </svg>
                  )}
                </span>
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="wa-row wa-row--ai conv-msg-in">
            <div className="wa-bubble wa-bubble--typing">
              <span className="wa-typing-ellipsis"><span /><span /><span /></span>
            </div>
          </div>
        )}
      </div>
      <div className="wa-input">
        <span className="wa-input-pill">Type a message</span>
      </div>
    </div>
  );
}

/* ===== Instagram DM (dark) ===== */
function InstagramChat({ channel, isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  const { shownCount, isTyping } = useConversationPlayer(channel.messages, isActive);
  const visible = channel.messages.slice(0, shownCount);
  const lastMsg = visible[visible.length - 1];

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
        {visible.map((m, i) => (
          <div key={i} className={`ig-row ig-row--${m.from === 'proxe' ? 'ai' : 'customer'} conv-msg-in`}>
            <div className="ig-bubble">{m.text}</div>
          </div>
        ))}
        {lastMsg?.type === 'bookdemo' && (
          <div className="ig-row ig-row--ai conv-msg-in">
            <button className="ig-book-btn">Book a Demo</button>
          </div>
        )}
        {isTyping && (
          <div className="ig-row ig-row--ai conv-msg-in">
            <div className="ig-bubble ig-bubble--typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      <div className="ig-input">
        <span className="ig-input-pill">Message…</span>
        <span className="ig-actions">♡  ⌃</span>
      </div>
    </div>
  );
}

/* ===== Messenger ===== */
function MessengerChat({ channel, isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  const { shownCount, isTyping } = useConversationPlayer(channel.messages, isActive);
  const visible = channel.messages.slice(0, shownCount);

  const isLastInRun = (arr: ConvMsg[], i: number) => i === arr.length - 1 || arr[i + 1].from !== arr[i].from;

  return (
    <div className="ms-chat">
      <div className="ms-header">
        <div className="ms-h-left">
          <svg className="ms-h-back" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0084FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          <div className="ms-h-avatar"><SiMessenger /><span className="ms-h-online" /></div>
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
        {visible.map((m, i) => {
          const side = m.from === 'proxe' ? 'ai' : 'customer';
          const last = isLastInRun(visible, i);
          return (
            <div key={i} className={`ms-row ms-row--${side} ${last ? 'is-last' : ''} is-first conv-msg-in`}>
              {m.from === 'proxe' && (
                <div className="ms-bubble-avatar">
                  {last && <div className="ms-h-avatar ms-h-avatar--small"><SiMessenger /></div>}
                </div>
              )}
              <div className="ms-bubble">{m.text}</div>
            </div>
          );
        })}
        {isTyping && (
          <div className="ms-row ms-row--ai is-last is-first conv-msg-in">
            <div className="ms-bubble-avatar">
              <div className="ms-h-avatar ms-h-avatar--small"><SiMessenger /></div>
            </div>
            <div className="ms-bubble ms-bubble--typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      <div className="ms-input">
        <span className="ms-plus">+</span>
        <span className="ms-input-pill">Aa</span>
        <span className="ms-thumb">👍</span>
      </div>
    </div>
  );
}

/* ===== Voice — live VapiOrb demo inside the phone frame ===== */
function VoiceChat({ channel: _channel, isActive: _isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  return (
    <div className="vc-chat vc-chat--orb">
      <VapiOrb />
    </div>
  );
}

/* ===== Web chat widget ===== */
function WebChat({ channel, isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  const { shownCount, isTyping } = useConversationPlayer(channel.messages, isActive);
  const visible = channel.messages.slice(0, shownCount);

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
        {visible.map((m, i) => (
          <div key={i} className={`web-row web-row--${m.from === 'proxe' ? 'ai' : 'customer'} conv-msg-in`}>
            <div className="web-bubble">{m.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="web-row web-row--ai conv-msg-in">
            <div className="web-bubble web-bubble--typing"><span /><span /><span /></div>
          </div>
        )}
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
              { label: '01', title: '24/7 Lead Capture', desc: 'Every channel listens all day. No form, message, or call is missed.', icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 1 0 20A10 10 0 0 1 12 2zm0 2a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a1 1 0 0 1 1 1v3.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-3-3A1 1 0 0 1 11 12V8a1 1 0 0 1 1-1z"/></svg>
              )},
              { label: '02', title: 'Unified Memory', desc: 'One thread across channels. Context travels with the customer.', icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>
              )},
              { label: '03', title: 'Auto Follow-Ups', desc: 'Sequenced nudges until they book, buy, or opt out.', icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
              )},
              { label: '04', title: 'Multi-Agents Across Channels', desc: 'Dedicated agents for web, WhatsApp, voice, email, and SMS. One brain behind them all.', icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
              )},
              { label: '05', title: 'Command Center', desc: 'One dashboard for every conversation, lead, and metric.', icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
              )},
              { label: '06', title: 'Enterprise Security', desc: 'SOC2-aligned controls, encrypted at rest and in transit.', icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              )},
            ].map((f) => (
              <article key={f.title} className="proxe-feature-card">
                <div className="proxe-feature-icon">{f.icon}</div>
                <span className="proxe-feature-label">{f.label}</span>
                <h3 className="proxe-feature-title">{f.title}</h3>
                <p className="proxe-feature-desc">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 11. Industry scroll showcase ===== */}
      <IndustryScroll />

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
