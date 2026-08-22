'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { FiGlobe, FiMail, FiMessageSquare, FiPhone, FiRefreshCw, FiDatabase, FiShield, FiZap, FiTrendingUp } from 'react-icons/fi';
import { SiInstagram, SiMessenger, SiWhatsapp } from 'react-icons/si';
import VapiOrb from './VapiOrb';
import ChannelDemo from './ChannelDemo';
import HowItWorks from './HowItWorks';
import DashboardSection from './DashboardSection';
import CapabilitiesSection from './CapabilitiesSection';
import IndustriesSection from './IndustriesSection';
import PricingSection from './PricingSection';
import HeroPhoneCapture from './shared/HeroPhoneCapture';
import WhatsAppHeaderButton from './shared/WhatsAppHeaderButton';
import { useDeployModal } from '../contexts/DeployModalContext';
import { track, initScrollDepthTracking } from '../lib/analytics';
import { captureAttribution } from '../lib/attribution';

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
      <button className="proxe-faq-trigger" onClick={() => { if (!open) track('faq_open', { question }); setOpen((o) => !o); }} aria-expanded={open}>
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
  const { openModal: openDeployModal } = useDeployModal();

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
          <button
            type="button"
            className="proxe-btn proxe-btn-primary"
            onClick={() => { setOpen(false); openDeployModal('scroll_popup'); }}
          >
            Book a Demo
          </button>
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
    name: 'Real Estate',
    leftImg:  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1582407947304-fd86f28f1cd7?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Healthcare',
    leftImg:  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Education',
    leftImg:  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Coaching',
    leftImg:  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Travel',
    leftImg:  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Weddings',
    leftImg:  'https://images.unsplash.com/photo-1519741497674-611481863552?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Car Sales',
    leftImg:  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=360&h=500&fit=crop&q=80',
  },
  {
    name: 'Immigration',
    leftImg:  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=420&h=580&fit=crop&q=80',
    rightImg: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=360&h=500&fit=crop&q=80',
  },
];

/* ===== Lazy Grainient loader (defers WebGL + OGL until visible) ===== */
const LazyGrainient = dynamic(() => import('./Grainient'), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 50%, #1E1B4B 100%)' }} />,
});

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
                <img src={ind.leftImg} alt={ind.name} loading="lazy" />
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
                <img src={ind.rightImg} alt={ind.name} loading="lazy" />
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
              onClick={() => { setActive(i); lockManual(); track('channel_demo_select', { channel: c.name.toLowerCase(), surface: 'coverflow' }); }}
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
                {/* Top region: Dynamic Island floats over the status bar */}
                <div className="proxe-phone-statusbar">
                  <span className="proxe-phone-time">9:41</span>
                  <span className="proxe-phone-island" aria-hidden="true">
                    <span className="proxe-phone-island-cam" />
                  </span>
                  <span className="proxe-phone-statusbar-right" aria-hidden="true">
                    {/* Cellular bars */}
                    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
                      <rect x="0"  y="7" width="3" height="4" rx="0.5" />
                      <rect x="4"  y="5" width="3" height="6" rx="0.5" />
                      <rect x="8"  y="3" width="3" height="8" rx="0.5" />
                      <rect x="12" y="0" width="3" height="11" rx="0.5" />
                    </svg>
                    {/* WiFi */}
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M1.5 3.8 A9 9 0 0 1 13.5 3.8" />
                      <path d="M3.6 5.9 A6 6 0 0 1 11.4 5.9" />
                      <path d="M5.7 8.0 A3 3 0 0 1 9.3 8.0" />
                      <circle cx="7.5" cy="9.5" r="0.8" fill="currentColor" />
                    </svg>
                    {/* Battery */}
                    <span className="proxe-phone-bat" aria-hidden="true">
                      <span className="proxe-phone-bat-fill" />
                    </span>
                  </span>
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
  const { openModal } = useDeployModal();

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
            <button type="button" className="ig-book-btn" onClick={() => openModal('ig_demo')}>Deploy PROXe</button>
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
/** Inline Facebook Messenger glyph. `fillRule="evenodd"` is critical so the
 *  lightning bolt is CARVED OUT of the speech bubble rather than overlaid on
 *  top of it — without it, the path paints as a solid white blob and you
 *  lose the recognizable logo shape entirely. */
const MessengerGlyph = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 .533C7.163.533 0 7.214 0 15.453c0 4.693 2.325 8.886 5.953 11.62V32l5.443-2.987c1.453.4 2.99.62 4.604.62 8.837 0 16-6.681 16-14.92C32 7.215 24.837.533 16 .533Zm1.59 20.097-4.075-4.348-7.952 4.348 8.748-9.29 4.174 4.348 7.85-4.348-8.745 9.29Z"
    />
  </svg>
);

function MessengerChat({ channel, isActive }: { channel: typeof CHANNELS[number]; isActive: boolean }) {
  const { shownCount, isTyping } = useConversationPlayer(channel.messages, isActive);
  const visible = channel.messages.slice(0, shownCount);

  const isLastInRun = (arr: ConvMsg[], i: number) => i === arr.length - 1 || arr[i + 1].from !== arr[i].from;

  return (
    <div className="ms-chat">
      <div className="ms-header">
        <div className="ms-h-left">
          <svg className="ms-h-back" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0084FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
          <div className="ms-h-avatar"><MessengerGlyph size={18} /><span className="ms-h-online" /></div>
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
                  {last && <div className="ms-h-avatar ms-h-avatar--small"><MessengerGlyph size={14} /></div>}
                </div>
              )}
              <div className="ms-bubble">{m.text}</div>
            </div>
          );
        })}
        {isTyping && (
          <div className="ms-row ms-row--ai is-last is-first conv-msg-in">
            <div className="ms-bubble-avatar">
              <div className="ms-h-avatar ms-h-avatar--small"><MessengerGlyph size={14} /></div>
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
/* ─────────────────────────────────────────────────────────────
   Testimonial carousel — single card visible at a time, centered.
   Auto-advances every 6.5s; user can click dots to jump.
───────────────────────────────────────────────────────────── */
const TESTIMONIALS: { quote: string; name: string; role: string; color: string; image?: string }[] = [
  {
    quote: 'PROXe replied to a WhatsApp lead at 2am and booked a demo before my team even woke up.',
    name: 'Ankush Verma',
    role: 'Founder, Coachly Academy',
    color: '#a78bfa',
    image: '/testimonials/Ankush.webp',
  },
  {
    quote: 'Cold leads from four months ago are closing again. Nothing else we tried moved that number.',
    name: 'Priya Sharma',
    role: 'COO, Helix Health',
    color: '#34d399',
    image: '/testimonials/Priya%20Sharma.webp',
  },
  {
    quote: 'Our SDRs stopped cold-chasing. They just close the deals PROXe hands them now.',
    name: 'Rohan Kapoor',
    role: 'CEO, Skyline Realty',
    color: '#f472b6',
    image: '/testimonials/Rohan%20Kapoor.webp',
  },
];

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="tm-stage" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="tm-card-wrap">
        {TESTIMONIALS.map((t, i) => {
          const initials = t.name.split(' ').map((n) => n[0]).slice(0, 2).join('');
          return (
            <article
              key={i}
              className={`tm-card${i === idx ? ' tm-card--active' : ''}`}
              aria-hidden={i !== idx}
            >
              <span className="tm-quote-mark" aria-hidden>&ldquo;</span>
              <p className="tm-quote">{t.quote}</p>
              <div className="tm-author">
                {t.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="tm-avatar tm-avatar--photo"
                    src={t.image}
                    alt={t.name}
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                ) : (
                  <span
                    className="tm-avatar"
                    style={{
                      background: `linear-gradient(135deg, ${t.color} 0%, #7c3aed 100%)`,
                      boxShadow: `0 6px 18px ${t.color}55`,
                    }}
                    aria-hidden
                  >
                    {initials}
                  </span>
                )}
                <div className="tm-author-meta">
                  <div className="tm-author-name">{t.name}</div>
                  <div className="tm-author-role">{t.role}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="tm-dots" role="tablist" aria-label="Testimonial navigation">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Show testimonial ${i + 1}`}
            className={`tm-dot${i === idx ? ' tm-dot--active' : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProxeLanding() {
  const pillarsRef = useRef<HTMLElement | null>(null);
  const videoIframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoFrameRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  // Load MUTED. Sound-on-load looked bolder but fought the browser: Chrome and
  // Safari refuse to autoplay unmuted video without a prior interaction, so the
  // hero opened on a frozen frame and only recovered once the mute-and-retry
  // fallback fired. Muted autoplay is always permitted, so the video just
  // plays, and the Unmute pill turns sound on for anyone who wants it.
  const [videoMuted, setVideoMuted] = useState(true);
  const videoPlayingRef = useRef(false);
  const videoMutedRef = useRef(true);
  const userSetVolumeRef = useRef(false);
  const { openModal, startDeploy } = useDeployModal();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fire scroll-depth milestones (25/50/75/90%) once per session.
  useEffect(() => initScrollDepthTracking(), []);

  // Capture first-touch traffic attribution (UTM / referrer) on landing.
  useEffect(() => { captureAttribution(); }, []);

  // Lazy-load the video iframe only after user clicks the poster.
  // This prevents the 3.1 MiB Vimeo autoplay from blocking first paint.
  useEffect(() => {
    if (!videoLoaded) return;
    const iframe = videoIframeRef.current;
    if (!iframe) return;
    const target = iframe.parentElement;
    if (!target) return;

    const send = (method: string, value?: unknown) => {
      iframe.contentWindow?.postMessage(
        JSON.stringify(value === undefined ? { method } : { method, value }),
        'https://player.vimeo.com'
      );
    };

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://player.vimeo.com') return;
      let data: { event?: string } | null = null;
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (data?.event === 'ready') {
        send('addEventListener', 'play');
        send('addEventListener', 'pause');
        send('addEventListener', 'timeupdate');
      } else if (data?.event === 'play' || data?.event === 'timeupdate') {
        videoPlayingRef.current = true;
      } else if (data?.event === 'pause') {
        videoPlayingRef.current = false;
      }
    };
    window.addEventListener('message', onMessage);

    let fallbackTimer: number | undefined;
    const playWithFallback = () => {
      send('play');
      if (userSetVolumeRef.current) return;
      if (videoMutedRef.current) return;
      window.clearTimeout(fallbackTimer);
      fallbackTimer = window.setTimeout(() => {
        if (!videoPlayingRef.current && !videoMutedRef.current && !userSetVolumeRef.current) {
          send('setMuted', true);
          videoMutedRef.current = true;
          setVideoMuted(true);
          send('play');
        }
      }, 1500);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playWithFallback();
          } else {
            window.clearTimeout(fallbackTimer);
            send('pause');
          }
        });
      },
      { threshold: 0.5 }
    );

    io.observe(target);
    return () => {
      io.disconnect();
      window.removeEventListener('message', onMessage);
      window.clearTimeout(fallbackTimer);
    };
  }, [videoLoaded]);

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
    // Their choice now wins over the autoplay fallback, permanently.
    userSetVolumeRef.current = true;
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
    videoMutedRef.current = nextMuted;
    if (!nextMuted) track('video_unmute', { video: 'hero_demo' });
  };

  return (
    <main className="proxe-main">
      {/* ===== Site-wide animated gradient backdrop ===== */}
      <div className="proxe-page-grainient" aria-hidden="true">
        <LazyGrainient
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
        <div className="proxe-float-actions">
          <WhatsAppHeaderButton location="home_header" />
          <button type="button" onClick={() => void startDeploy('floating_header')} className="proxe-float-cta">
            {/* Two labels — full on top, short when [data-scrolled='true']. */}
            <span className="proxe-float-cta-full">Deploy PROXe</span>
            <span className="proxe-float-cta-short" aria-hidden="true">Deploy</span>
          </button>
        </div>
      </div>

      {/* ===== 2. Hero ===== */}
      <section className="proxe-hero" id="product">
        <div className="proxe-container proxe-hero-inner">
          <div className="proxe-hero-eyebrow">AI Lead Conversion</div>
          {/* Two lines, and only two. The <br> alone did not hold: on a phone
              "Never Miss a Lead" was wide enough to wrap again, so the headline
              read as three ragged lines with "Lead" stranded on its own. Each
              line is now its own non-breaking block, so the break lands where
              it is written or not at all. */}
          <h1 className="proxe-hero-title">
            {/* Split into segments so the mobile break is chosen, not left to
                the browser. Inline on desktop (renders as one line, exactly as
                before); block on mobile, which gives "Never Miss / a Lead /
                Ever Again." instead of letting natural wrapping strand "Lead"
                alone on a line. Spaces between segments ensure crawlers and
                screen readers see "Never Miss a Lead Ever Again." */}
            <span className="proxe-hero-line">
              <span className="proxe-hero-seg">Never Miss</span>
              {' '}
              <span className="proxe-hero-seg">a Lead</span>
            </span>
            {' '}
            <span className="proxe-hero-line">Ever Again.</span>
          </h1>
          <p className="proxe-hero-subtitle">
            PROXe runs the full pipeline. Captures leads across channels, nurtures, scores, and keeps them warm until they&rsquo;re ready to buy.
          </p>
          {/* Quick capture — phone in, callback out. The primary hero action. */}
          <HeroPhoneCapture />
        </div>
      </section>

      {/* ===== Hero video (click-to-play lazy load) ===== */}
      <section className="proxe-hero-video" aria-label="PROXe product demo">
        <div className="proxe-hero-video-frame" ref={videoFrameRef}>
          <div className="proxe-hero-video-inner">
            {!videoLoaded ? (
              <button
                type="button"
                className="proxe-hero-video-poster"
                onClick={() => {
                  setVideoLoaded(true);
                  track('video_play_click', { video: 'hero_demo' });
                }}
                aria-label="Play demo video"
              >
                <img
                  src="/proxe/demo-poster.png"
                  alt="PROXe demo preview"
                  width="1200"
                  height="675"
                />
                <div className="proxe-hero-video-play-btn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            ) : (
              <>
                <iframe
                  ref={videoIframeRef}
                  src="https://player.vimeo.com/video/1182869056?autoplay=1&muted=1&loop=1&controls=0&byline=0&title=0&portrait=0&dnt=1&api=1&transparent=1&background=0&playsinline=1"
                  title="PROXe demo"
                  allow="autoplay; fullscreen; picture-in-picture"
                  frameBorder={0}
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== 2. How It Works — animated feature cards ===== */}
      <HowItWorks />

      {/* ===== 3. See PROXe in Action — the live voice demo is the hero ===== */}
      <ChannelDemo />

      {/* ===== 4. Industries — "it works for MY business" lands right after
             seeing it work, while the demo is still fresh ===== */}
      <IndustriesSection />

      {/* ===== 5. Pricing — ask for the sale once relevance is established ===== */}
      <PricingSection />

      {/* ===== 6. Dashboard preview — proof of what you get after buying ===== */}
      <DashboardSection />

      {/* ===== 8. Scroll-triggered popup — disabled for now ===== */}
      {/* <ScrollPopup triggerRef={pillarsRef} /> */}

      {/* ===== 9. Capabilities — depth for those still reading ===== */}
      <CapabilitiesSection />

      {/* ===== 13. Testimonials — REMOVED 2026-08-09 =====
          Ankush Verma / Priya Sharma / Rohan Kapoor were invented, with
          stock-style headshots. The buyer is an Indian SMB founder who sees
          fabricated testimonials every day; one detected fake makes every
          other claim on the page suspect, including the true ones. Zero
          testimonials beats fake testimonials.

          To restore, use ONE of:
            1. three real customers — real name, company, photo, ideally a
               WhatsApp screenshot of them saying it
            2. product receipts instead of people — a timestamped screenshot
               of a real PROXe conversation ("2:14am. Lead answered. Demo
               booked."), which is proof without needing a face
          TestimonialCarousel + TESTIMONIALS are kept below, unrendered, so
          option 1 is a data swap rather than a rebuild. */}

      {/* ===== 14. FAQ ===== */}
      <section className="proxe-section" id="faq">
        <div className="proxe-container">
          <div className="proxe-section-label" style={{ textAlign: 'center' }}>
            FAQ
          </div>
          <div className="proxe-faq">
            <FaqItem
              question="How fast is setup?"
              answer="Most businesses go live within 48 hours. Our team handles the setup, builds your custom flows, and trains the AI on your knowledge base. No technical work from your side."
            />
            <FaqItem
              question="Do you integrate with my CRM?"
              answer="PROXe replaces the need for a separate CRM by capturing, qualifying, and tracking every lead in one place. If you already use a CRM, we can sync leads, conversations, and stages into it."
            />
            <FaqItem
              question="What channels are supported?"
              answer="Website chat, WhatsApp, Instagram DM, Facebook Messenger, Email, and Voice (inbound and outbound calls). All channels share one unified memory, so customers never repeat themselves."
            />
            <FaqItem
              question="Is my data secure?"
              answer="Yes. All customer data is encrypted in transit and at rest. We are GDPR and CCPA compliant, and built to SOC 2 controls, though we are not yet SOC 2 certified. Scale includes a compliance review and private cloud deployment options."
            />
            <FaqItem
              question="Can my team take over conversations?"
              answer="Anytime. PROXe hands off to your team the moment you jump in, with full conversation context across every channel. The AI picks back up when you step away."
            />
            <FaqItem
              question="What happens if I go over 500 leads in a month?"
              answer="Nothing switches off. We keep everything running and true up at renewal, and if you are consistently above 500 we move you to Scale on volume pricing. No lead is ever dropped for hitting a limit."
            />
            <FaqItem
              question="What counts as a lead?"
              answer="One lead is one unique person, no matter how many messages they send or how many channels they use. If someone messages you on WhatsApp, then Instagram, then calls, that is still one lead because it is one person. You are counted per person, never per message or per channel."
            />
            <FaqItem
              question="What if a lead goes silent?"
              answer="PROXe automatically follows up across available channels. Smart nudges on WhatsApp, calls, email, and SMS bring cold prospects back. No opportunity dies from silence."
            />
            <FaqItem
              question="Does it speak my customers' language?"
              answer="Yes. PROXe handles English, Hindi, Tamil, Telugu, Malayalam, Kannada, and more. Voice supports Indian languages with native accents."
            />
            <FaqItem
              question="Can I cancel anytime?"
              answer="Yes. No long-term contracts on Core. Cancel anytime, keep your data export."
            />
          </div>
        </div>
      </section>

      {/* ===== 15. Footer CTA ===== */}
      {/* ===== 15. Closing CTA — glass card, eyebrow chip, split headline,
                    primary button + trust strip ===== */}
      <section className="proxe-cc" id="book-demo">
        <div className="proxe-container">
          <div className="proxe-cc-card">
            {/* Eyebrow chip */}
            <div className="proxe-cc-eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3l2.39 5.84L20 11l-5.61 2.16L12 19l-2.39-5.84L4 11l5.61-2.16L12 3z" />
              </svg>
              AI THAT CONVERTS
            </div>

            <h2 className="proxe-cc-title">
              Stop losing leads.
              <br />
              <span className="proxe-cc-title-grad">Start closing them.</span>
            </h2>
            <p className="proxe-cc-sub">
              PROXe finds, remembers, and converts across every channel. Your
              always-on revenue engine.
            </p>

            <button type="button" onClick={() => void startDeploy('closing_cta')} className="proxe-hero-big-cta proxe-cc-cta">
              Deploy PROXe
              <span className="proxe-hero-big-cta-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </button>

            <ul className="proxe-hero-trust proxe-cc-trust">
              {/* Every line here has to survive contact with the rest of the
                  page. The old three did not: "No credit card" while Deploy
                  goes straight to a paid checkout, "Setup in minutes" against
                  an FAQ that says 48 hours, and "ROI from day one" which
                  cannot be shown. These three are all verifiable. */}
              <li><span className="proxe-hero-trust-ico"><FiZap size={14} /></span> Live in 48 hours</li>
              <li><span className="proxe-hero-trust-ico"><FiShield size={14} /></span> No technical work from your side</li>
              <li><span className="proxe-hero-trust-ico"><FiTrendingUp size={14} /></span> Cancel anytime</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 16. Footer — outline wordmark + 5-col grid ===== */}
      <footer className="pf">
        {/* Giant brand wordmark, decorative — uses the actual logo asset
            (not a CSS text-stroke outline) so the letterforms are correct. */}
        <img
          src="/proxe/brand/proxe-logo-white.webp"
          alt=""
          aria-hidden="true"
          className="pf-wordmark-img"
        />

        <div className="proxe-container pf-inner">
          <div
            className="pf-grid"
            onClick={(e) => {
              const a = (e.target as HTMLElement).closest('a');
              if (a) {
                const label = a.getAttribute('aria-label') || a.textContent?.trim() || a.getAttribute('href') || 'link';
                track('nav_click', { label, location: 'footer' });
              }
            }}
          >
            {/* Brand column — tagline + newsletter signup
                (no small wordmark; the giant outline above is the brand mark) */}
            <div className="pf-brand">
              <p className="pf-tagline">
                The AI lead conversion system.<br />
                Every channel. One memory. Always on.
              </p>
              <form
                className="pf-news"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.currentTarget.elements.namedItem('email') as HTMLInputElement);
                  // TODO: wire to your real list endpoint (Mailchimp / Resend / Loops).
                  // For now, just log + clear.
                  if (input?.value) {
                    track('newsletter_subscribe', { location: 'footer' });
                    console.log('[newsletter] subscribe:', input.value);
                    input.value = '';
                    (e.currentTarget.querySelector('.pf-news-ok') as HTMLElement)?.classList.add('pf-news-ok--show');
                  }
                }}
              >
                <label className="pf-news-label">Get product updates</label>
                <div className="pf-news-row">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    className="pf-news-input"
                    autoComplete="email"
                  />
                  <button type="submit" className="pf-news-btn">Subscribe</button>
                </div>
                <div className="pf-news-ok">Thanks, you&rsquo;re on the list ✓</div>
              </form>
            </div>

            {/* Product */}
            <div className="pf-col">
              <div className="pf-col-title">Product</div>
              <ul className="pf-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#voice">Live Demo</a></li>
              </ul>
            </div>

            {/* Company — /about was a 404, so it's gone until the page exists */}
            <div className="pf-col">
              <div className="pf-col-title">Company</div>
              <ul className="pf-links">
                <li><a href="mailto:hello@bconclub.com">Contact</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            {/* Legal — only the pages that actually exist. /privacy and /terms
                both 404'd; the real route is /privacy-policy. */}
            <div className="pf-col">
              <div className="pf-col-title">Legal</div>
              <ul className="pf-links">
                <li><a href="/privacy-policy">Privacy</a></li>
                <li><a href="/data-deletion">Data deletion</a></li>
              </ul>
            </div>

            {/* Social — circular icon buttons */}
            <div className="pf-col">
              <div className="pf-col-title">Social</div>
              <div className="pf-socials">
                {/* X and LinkedIn buttons removed rather than left on href="#".
                    A social icon that goes nowhere reads as a broken site on the
                    page where we are asking for a credit card. Restore each one
                    the moment its account exists, with the real URL. */}
                <a href="https://www.instagram.com/goproxe/" target="_blank" rel="noopener noreferrer" aria-label="PROXe on Instagram" className="pf-social">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pf-bottom">
            <div className="pf-copyright">
              © 2026 PROXe by{' '}
              <a
                className="pf-copyright-link"
                href="https://bconclub.com"
                target="_blank"
                rel="noopener noreferrer"
              >BCON</a>. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
