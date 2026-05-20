'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FiMessageCircle,
  FiUser,
  FiCalendar,
  FiCheckCircle,
  FiBell,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiShoppingCart,
  FiSend,
  FiMail,
  FiPackage,
  FiTool,
  FiTruck,
  FiActivity,
  FiZap,
  FiShield,
  FiClock,
  FiBarChart2,
  FiCpu,
  FiUsers,
  FiBriefcase,
  FiHome,
  FiAward,
  FiPhoneCall,
  FiDollarSign,
} from 'react-icons/fi';
import { LuGraduationCap, LuStethoscope, LuDumbbell, LuCar } from 'react-icons/lu';
import { SiWhatsapp } from 'react-icons/si';

type Activity = { Icon: React.ElementType; top: string; sub: string };
type Step = { Icon: React.ElementType; label: string };
type Industry = {
  id: string;
  color: string;        // primary accent (hex)
  gradient: string;     // top header gradient (fallback when no image)
  image?: string;       // optional background photo in public/industries/
  Icon: React.ElementType;
  title: string;
  desc: string;
  activities: Activity[];
  flow: Step[];
  stat: string;
  statLabel: string;
};

const INDUSTRIES: Industry[] = [
  {
    id: 'coaching',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 60%, #ec4899 110%)',
    image: '/industries/Academies.webp',
    Icon: LuGraduationCap,
    title: 'Coaching Academies',
    desc: 'Capture student inquiries, qualify intent, book consultations automatically.',
    activities: [
      { Icon: FiMessageCircle, top: 'New inquiry',  sub: 'MBA Program · via WhatsApp' },
      { Icon: FiUser,          top: 'AI Qualified', sub: 'High intent' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Inquiry'  },
      { Icon: FiUser,          label: 'Qualify'  },
      { Icon: FiCalendar,      label: 'Book'     },
      { Icon: FiCheckCircle,   label: 'Enroll'   },
    ],
    stat: '4.2×',
    statLabel: 'more enrollments',
  },
  {
    id: 'clinics',
    color: '#60a5fa',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 60%, #06b6d4 110%)',
    image: '/industries/Healthcare.webp',
    Icon: LuStethoscope,
    title: 'Clinics & Healthcare',
    desc: 'Handle appointment requests across WhatsApp and calls. Never miss a patient.',
    activities: [
      { Icon: FiCalendar,    top: 'Appointment Request', sub: 'via WhatsApp' },
      { Icon: FiClock,       top: 'Tomorrow · 10:30 AM',  sub: '' },
      { Icon: FiCheckCircle, top: 'Confirmed',            sub: '' },
    ],
    flow: [
      { Icon: FiCalendar,    label: 'Request'  },
      { Icon: FiCheckCircle, label: 'Confirm'  },
      { Icon: FiBell,        label: 'Remind'   },
      { Icon: FiHeart,       label: 'Follow-up'},
    ],
    stat: '68%',
    statLabel: 'fewer no-shows',
  },
  {
    id: 'realestate',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 60%, #34d399 110%)',
    image: '/industries/Real%20Estate.webp',
    Icon: FiHome,
    title: 'Real Estate',
    desc: 'Qualify buyers, book site visits, and follow up until the deal closes.',
    activities: [
      { Icon: FiCalendar,   top: 'Site Visit Scheduled', sub: 'via Website' },
      { Icon: FiTrendingUp, top: 'Lead Score',            sub: '92' },
    ],
    flow: [
      { Icon: FiUser,        label: 'Lead'   },
      { Icon: FiStar,        label: 'Score'  },
      { Icon: FiCalendar,    label: 'Visit'  },
      { Icon: FiCheckCircle, label: 'Close'  },
    ],
    stat: '3×',
    statLabel: 'more site visits booked',
  },
  {
    id: 'd2c',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 60%, #fbbf24 110%)',
    Icon: FiShoppingCart,
    title: 'D2C & E-commerce',
    desc: 'Recover abandoned carts, answer product questions, and nudge hesitant buyers.',
    activities: [
      { Icon: FiShoppingCart, top: 'Abandoned Cart', sub: 'via Website' },
      { Icon: FiSend,         top: 'AI Nudge Sent',  sub: '15% Off Offer' },
    ],
    flow: [
      { Icon: FiShoppingCart, label: 'Abandon' },
      { Icon: FiSend,         label: 'Nudge'   },
      { Icon: FiMail,         label: 'Engage'  },
      { Icon: FiPackage,      label: 'Recover' },
    ],
    stat: '32%',
    statLabel: 'cart recovery rate',
  },
  {
    id: 'fitness',
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, #831843 0%, #db2777 60%, #f472b6 110%)',
    image: '/industries/Wellness.webp',
    Icon: LuDumbbell,
    title: 'Fitness & Wellness',
    desc: 'Convert trial signups, reduce no-shows, and re-engage lapsed members.',
    activities: [
      { Icon: FiUser,        top: 'Free Trial Inquiry', sub: 'via Instagram' },
      { Icon: FiCheckCircle, top: 'Trial Booked',       sub: 'Session #1' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Inquiry'   },
      { Icon: FiCalendar,      label: 'Trial'     },
      { Icon: FiBell,          label: 'Follow-up' },
      { Icon: FiHeart,         label: 'Retain'    },
    ],
    stat: '55%',
    statLabel: 'reduction in no-shows',
  },
  {
    id: 'pro',
    color: '#38bdf8',
    gradient: 'linear-gradient(135deg, #075985 0%, #0284c7 60%, #38bdf8 110%)',
    Icon: FiBriefcase,
    title: 'Professional Services',
    desc: 'Qualify leads, book discovery calls, and route hot prospects to partners.',
    activities: [
      { Icon: FiPhoneCall,   top: 'Discovery Call', sub: 'via LinkedIn' },
      { Icon: FiCalendar,    top: 'Call Booked',    sub: 'Tue, 4:00 PM' },
    ],
    flow: [
      { Icon: FiUser,        label: 'Lead'    },
      { Icon: FiCheckCircle, label: 'Qualify' },
      { Icon: FiCalendar,    label: 'Book'    },
      { Icon: FiActivity,    label: 'Route'   },
    ],
    stat: '2.8×',
    statLabel: 'more discovery calls',
  },
  {
    id: 'auto',
    color: '#94a3b8',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 60%, #94a3b8 110%)',
    Icon: LuCar,
    title: 'Auto Dealerships',
    desc: 'Answer inventory questions, book test drives, and reactivate cold leads.',
    activities: [
      { Icon: FiTruck,    top: 'Inventory Inquiry', sub: 'via Website' },
      { Icon: FiCalendar, top: 'Test Drive Booked', sub: 'Sat, 11:00 AM' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Inquiry' },
      { Icon: FiZap,           label: 'Respond' },
      { Icon: FiCalendar,      label: 'Book'    },
      { Icon: LuCar,           label: 'Drive'   },
    ],
    stat: '47%',
    statLabel: 'more test drives booked',
  },
  {
    id: 'home',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 60%, #fbbf24 110%)',
    Icon: FiTool,
    title: 'Home Services',
    desc: 'Dispatch jobs fast. Capture, qualify, and schedule every service request.',
    activities: [
      { Icon: FiTool,        top: 'Service Request', sub: 'via WhatsApp' },
      { Icon: FiCalendar,    top: 'Job Scheduled',    sub: 'Wed, 2:00 PM' },
    ],
    flow: [
      { Icon: FiMessageCircle, label: 'Request'  },
      { Icon: FiCheckCircle,   label: 'Qualify'  },
      { Icon: FiCalendar,      label: 'Schedule' },
      { Icon: FiAward,         label: 'Complete' },
    ],
    stat: '5×',
    statLabel: 'faster lead response',
  },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Click-drag horizontal scrolling. Listeners attach to `window` so child
  // elements inside the cards (images, activity pills, SVG icons) can't
  // eat the events. Once a drag starts, we add `.ind-grid--dragging` so
  // CSS can null out child pointer-events for the duration of the drag.
  useEffect(() => {
    const car = trackRef.current;
    if (!car) return;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let dragged = false;

    const onDown = (e: PointerEvent) => {
      // Touch / pen: let the browser's native overflow-x scroll handle the
      // swipe. Only intercept mouse drags so desktop click-and-drag works.
      if (e.pointerType !== 'mouse') return;
      if (!car.contains(e.target as Node)) return;
      if ((e.target as HTMLElement).closest('.ind-arrow')) return;
      if (e.button !== 0) return;
      startX = e.clientX;
      startScroll = car.scrollLeft;
      dragging = true;
      dragged = false;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) < 3) return;
      if (!dragged) {
        dragged = true;
        car.classList.add('ind-grid--dragging');
      }
      car.scrollLeft = startScroll - dx;
      e.preventDefault();
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      // Defer class removal one tick so a click on a card right after the
      // drag (when dragged===false) still fires normally.
      requestAnimationFrame(() => car.classList.remove('ind-grid--dragging'));
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const car = trackRef.current;
    if (!car) return;
    const cardW = (car.firstElementChild as HTMLElement | null)?.offsetWidth ?? 320;
    car.scrollBy({ left: dir * (cardW + 16), behavior: 'smooth' });
  };

  return (
    <section ref={ref} className={`ind-section${vis ? ' ind-in' : ''}`}>
      <div className="proxe-container">
        {/* Header */}
        <div className="ind-label">
          <span className="ind-label-dot" /> INDUSTRIES WE POWER
        </div>
        <div className="ind-header">
          <h2 className="ind-h2">
            Built for every industry.<br />
            Trained for <span className="ind-h2-grad">every outcome.</span>
          </h2>
          <p className="ind-sub">
            PROXe adapts to the way your industry works.<br />
            From lead capture to follow-ups and conversions,<br />
            we handle the conversations that drive real results.
          </p>
        </div>

        {/* Horizontal carousel — ~3.5 cards visible, drag to scroll */}
        <div className="ind-track-wrap">
        <div ref={trackRef} className="ind-grid">
          {INDUSTRIES.map((u) => (
            <article
              key={u.id}
              className={`ind-card ind-card--${u.id}`}
              style={{ ['--acc' as keyof React.CSSProperties as string]: u.color }}
            >
              {/* Top: image-style header with floating activity cards.
                  When `image` is present, render the photo with a tinted
                  overlay; otherwise fall back to the accent gradient. */}
              <div
                className={`ind-top${u.image ? ' ind-top--photo' : ''}`}
                style={u.image
                  ? { backgroundImage: `url(${u.image})` }
                  : { background: u.gradient }}
              >
                {u.image && <span className="ind-top-tint" aria-hidden />}
                <span className="ind-top-ico"><u.Icon size={22} /></span>
                <div className="ind-top-cards">
                  {u.activities.map((a, i) => (
                    <div key={i} className="ind-act" style={{ animationDelay: `${0.18 + i * 0.08}s` }}>
                      <span className="ind-act-ico"><a.Icon size={11} /></span>
                      <div className="ind-act-txt">
                        <div className="ind-act-top">{a.top}</div>
                        {a.sub && <div className="ind-act-sub">{a.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="ind-body">
                <h3 className="ind-title">{u.title}</h3>
                <p className="ind-desc">{u.desc}</p>

                {/* 4-step flow */}
                <div className="ind-flow">
                  {u.flow.map((s, i) => (
                    <span key={i} className="ind-flow-cell">
                      <span className="ind-flow-ico"><s.Icon size={14} /></span>
                      <span className="ind-flow-label">{s.label}</span>
                      {i < u.flow.length - 1 && <span className="ind-flow-arrow" aria-hidden>›</span>}
                    </span>
                  ))}
                </div>

                {/* Stat */}
                <div className="ind-stat">
                  <span className="ind-stat-num">{u.stat}</span>
                  <span className="ind-stat-label">{u.statLabel}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        </div>

        {/* Arrows outside the carousel frame */}
        <div className="ind-arrows">
          <button className="ind-arrow" aria-label="Previous industries" onClick={() => scrollBy(-1)}>‹</button>
          <button className="ind-arrow" aria-label="Next industries"     onClick={() => scrollBy(1)}>›</button>
        </div>
      </div>
    </section>
  );
}
