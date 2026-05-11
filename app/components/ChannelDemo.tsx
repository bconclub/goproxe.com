'use client';
import { useEffect, useRef, useState } from 'react';
import { SiWhatsapp, SiInstagram, SiMessenger } from 'react-icons/si';
import { FiPhone, FiGlobe, FiCheck, FiCalendar, FiChevronLeft } from 'react-icons/fi';
import VapiOrb from './VapiOrb';

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type MsgFrom = 'lead' | 'agent';
type MsgType = 'text' | 'qr' | 'carousel' | 'conf-card' | 'cta-card' | 'pill-btn' | 'calendar' | 'form';

interface ConvMsg {
  from: MsgFrom;
  text?: string;
  delay?: number;       // ms before this item shows (default 1200)
  noTyping?: boolean;   // skip typing indicator
  type?: MsgType;
  qr?: string[];
  carousel?: Array<{ title: string; sub: string; btn: string; img?: string; imgBg?: string; imgIcon?: string }>;
  confCard?: { title: string; lines: string[]; btn: string; color: string };
  ctaCard?: { btn: string; color?: string };
  pillBtn?: string;
  calendar?: { month: string; days: number[]; selected: number; times: string[]; selectedTime: string };
  form?: { title: string; fields: Array<{ label: string; value: string; placeholder?: string }>; btn: string };
}

interface VoiceLine {
  from: 'caller' | 'proxe';
  text: string;
}

/* ═══════════════════════════════════════════════════════════════
   CONVERSATION DATA — WhatsApp (10 industry sub-tabs)
═══════════════════════════════════════════════════════════════ */
const WA: Record<string, ConvMsg[]> = {

  'Healthcare': [
    { from: 'lead',  text: 'Hi, I want to book an appointment with Dr. Sharma.' },
    { from: 'agent', text: 'Hi! Dr. Sharma is available tomorrow. Morning 10am or afternoon 3pm?' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['10am', '3pm', 'Another day'] },
    { from: 'lead',  text: '10am please', delay: 900 },
    { from: 'agent', text: 'Done. Confirmed for tomorrow 10am with Dr. Sharma.' },
    { from: 'agent', type: 'conf-card', noTyping: true, delay: 500,
      confCard: { title: 'Appointment Confirmed', lines: ['Tomorrow, 10:00 AM with Dr. Sharma', 'Reminder 1 hour before'], btn: 'Add to Calendar', color: '#22c55e' } },
  ],

  'Real Estate': [
    { from: 'lead',  text: 'Hi, looking for a 3 or 4 BHK in Whitefield.' },
    { from: 'agent', text: 'Got a few good options. Which budget are you looking at?' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 300,
      carousel: [
        { title: 'Whitefield 4BHK',  sub: '2400 sqft · 1.35 Cr · Furnished',      btn: 'View Details', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=240&fit=crop&q=80' },
        { title: 'Whitefield 3BHK',  sub: '1850 sqft · 98L · Semi-furnished',     btn: 'View Details', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=240&fit=crop&q=80' },
        { title: 'Whitefield Villa', sub: '3600 sqft · 2.4 Cr · Premium gated',   btn: 'View Details', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=240&fit=crop&q=80' },
      ] },
    { from: 'lead',  text: 'The 3BHK looks great. Can I visit Saturday?', delay: 800 },
    { from: 'agent', text: 'Site visit confirmed. Saturday 11am. Our agent calls 30 mins before.' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Confirm Saturday', 'Pick Another Day', 'Call Me Now'] },
  ],

  'Coaching': [
    { from: 'lead',  text: 'Tell me about your weight loss program' },
    { from: 'agent', text: '12 weeks. Daily workouts, diet plan, weekly check-ins. 200 plus clients lost 8 to 12kg.' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 400,
      carousel: [{ title: 'Transformation Program', sub: '12 Weeks', btn: 'Enroll Now' }, { title: 'Free Discovery Call', sub: '15 Minutes', btn: 'Book Now' }] },
    { from: 'lead',  text: 'Book Now', delay: 900 },
    { from: 'agent', text: 'When works for you?' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['This Week', 'Next Week', 'Send Details'] },
  ],

  'Education': [
    { from: 'lead',  text: 'What courses do you offer in digital marketing?' },
    { from: 'agent', text: 'We have a 3-month bootcamp, weekend batch, and a 6-month diploma. All include placement support.' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 400,
      carousel: [{ title: 'Digital Marketing Bootcamp', sub: '3 Months', btn: 'Enroll Now' }, { title: 'Weekend Batch', sub: '6 Months', btn: 'View Details' }] },
    { from: 'lead',  text: 'What is the fee?', delay: 900 },
    { from: 'agent', text: 'Bootcamp starts at 28,000. Free demo class every Saturday. Want to join this week?' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Book Demo Class', 'Download Brochure', 'Talk to Advisor'] },
  ],

  'Travel': [
    { from: 'lead',  text: 'I want to plan a family trip to Europe in December' },
    { from: 'agent', text: '10 days covering Paris, Rome, and Amsterdam starts at 85,000 per person including flights.' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 400,
      carousel: [{ title: 'Europe Explorer 10D', sub: 'From 85,000', btn: 'View Itinerary' }, { title: 'Winter Special 7D', sub: 'From 65,000', btn: 'View Itinerary' }] },
    { from: 'lead',  text: 'Is it a group tour?', delay: 900 },
    { from: 'agent', text: 'Both options available. Group departs Dec 15. Private trips on your chosen dates.' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Group Tour', 'Private Trip', 'Send Itinerary'] },
  ],

  'Immigration': [
    { from: 'lead',  text: 'I want to apply for Canada PR. Where do I start?' },
    { from: 'agent', text: 'First step is a free eligibility check. Takes 10 minutes. CRS score 450 plus has 80 percent success rate.' },
    { from: 'lead',  text: 'Yes I want to check', delay: 900 },
    { from: 'agent', text: 'Booking a free assessment with our RCIC consultant. Available tomorrow or day after.' },
    { from: 'agent', type: 'conf-card', noTyping: true, delay: 500,
      confCard: { title: 'Assessment Booked', lines: ['Tomorrow 2:00 PM with RCIC Consultant', 'Bring your documents'], btn: 'Add to Calendar', color: '#0EA5E9' } },
  ],

  'Interior': [
    { from: 'lead',  text: 'I need help designing my 2BHK in HSR Layout' },
    { from: 'agent', text: 'We handle full interior from concept to handover. 2BHK packages start at 3.5L. When do you want to start?' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 400,
      carousel: [{ title: 'Classic Package', sub: 'From 3.5L', btn: 'View Package' }, { title: 'Premium Package', sub: 'From 6L', btn: 'View Package' }] },
    { from: 'lead',  text: 'Can I see past work?', delay: 900 },
    { from: 'agent', text: 'Portfolio sent to your WhatsApp. Want a free home visit this week to discuss your vision?' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Book Home Visit', 'View Portfolio', 'Get Quote'] },
  ],

  'Weddings': [
    { from: 'lead',  text: 'I am getting married in March. Looking for a planner in Bangalore' },
    { from: 'agent', text: 'Congratulations! We specialize in 200 to 500 guest weddings. Which weekend in March?' },
    { from: 'lead',  text: 'First weekend of March', delay: 900 },
    { from: 'agent', text: 'We have availability that weekend. Want to book a free consultation to discuss themes and budget?' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Book Consultation', 'View Portfolio', 'Send Packages'] },
  ],

  'Events': [
    { from: 'lead',  text: 'Need to organize a corporate event for 150 people in February' },
    { from: 'agent', text: 'We handle venue, catering, AV, and full coordination. What is the date and city?' },
    { from: 'lead',  text: 'First week of February, Bangalore', delay: 900 },
    { from: 'agent', text: 'Two premium venues available that week. Package starts at 85,000. Want me to send options?' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Send Options', 'Book Site Visit', 'Talk to Team'] },
  ],

  'Car Sales': [
    { from: 'lead',  text: 'I am interested in the Creta. What is the current offer?' },
    { from: 'agent', text: 'Creta petrol starts at 11.11L. December offer includes 50,000 cashback plus free accessories.' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 400,
      carousel: [{ title: 'Creta Petrol S', sub: '11.11L', btn: 'View Details' }, { title: 'Creta Diesel SX', sub: '14.9L', btn: 'View Details' }] },
    { from: 'lead',  text: 'Can I book a test drive?', delay: 900 },
    { from: 'agent', text: 'Test drive booked for Saturday 10am at our HSR showroom. Team will call you tomorrow.' },
    { from: 'agent', type: 'qr', noTyping: true, qr: ['Confirm Saturday', 'Different Time', 'Ask About Finance'] },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   VOICE TRANSCRIPT
═══════════════════════════════════════════════════════════════ */
const VOICE: VoiceLine[] = [
  { from: 'caller', text: 'I saw your listing online. Is the 4BHK still available?' },
  { from: 'proxe',  text: 'Yes it is. 2400 sqft, furnished, 1.35 Cr. Want to schedule a site visit?' },
  { from: 'caller', text: 'Any flexibility on price?' },
  { from: 'proxe',  text: 'There is room to negotiate. The owner is open. Want me to book a visit so you can see it first?' },
  { from: 'caller', text: 'Saturday morning works.' },
  { from: 'proxe',  text: 'Done. Site visit Saturday 11am. Sending confirmation to your number now.' },
];

/* ═══════════════════════════════════════════════════════════════
   INSTAGRAM CONVERSATION
═══════════════════════════════════════════════════════════════ */
const IG: ConvMsg[] = [
  { from: 'lead',  text: 'Saw your reel. Do you do online coaching?' },
  { from: 'agent', text: 'Yes, fully online. 12-week program. Workouts, diet, weekly calls.' },
  { from: 'agent', type: 'qr', noTyping: true, delay: 300, qr: ['Tell me more', 'See success stories', 'Pricing'] },
  { from: 'lead',  text: 'Pricing', delay: 800 },
  { from: 'agent', text: 'Starts at ₹8,000/month. First call is free. No commitment.' },
  { from: 'agent', type: 'pill-btn', noTyping: true, delay: 300, pillBtn: '📅 Book Free Call' },
];

/* ═══════════════════════════════════════════════════════════════
   MESSENGER CONVERSATION
═══════════════════════════════════════════════════════════════ */
const MSN: ConvMsg[] = [
  { from: 'lead',  text: 'Hi, does your clinic take walk-ins or only appointments?' },
  { from: 'agent', text: 'Appointments work best. Dr. Sharma has a slot tomorrow 10am. Want to book it?' },
  { from: 'lead',  text: 'Yes please', delay: 800 },
  { from: 'agent', text: 'Confirmed. Tomorrow 10am with Dr. Sharma. Reminder sent to your inbox.' },
  { from: 'agent', type: 'cta-card', noTyping: true, delay: 400,
    ctaCard: { btn: 'View Appointment Details', color: '#0084FF' } },
];

/* ═══════════════════════════════════════════════════════════════
   WEB CHAT CONVERSATION
═══════════════════════════════════════════════════════════════ */
const WEB: ConvMsg[] = [
  { from: 'lead',  text: 'Looking for JEE coaching for my son in Class 11.' },
  { from: 'agent', text: 'Got it. Here are 3 programs that fit:' },
  { from: 'agent', type: 'carousel', noTyping: true, delay: 300,
    carousel: [
      { title: '2-Year Foundation', sub: 'Class 11+12 · ₹95K/yr · Hybrid', btn: 'View',
        img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=240&fit=crop&q=80' },
      { title: 'JEE Crash Course',  sub: '6 months · ₹65K · Online',       btn: 'View',
        img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=240&fit=crop&q=80' },
      { title: 'Weekend Mentorship',sub: 'Saturdays · ₹40K/yr · Hybrid',   btn: 'View',
        img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=240&fit=crop&q=80' },
    ] },
  { from: 'lead',  text: 'Foundation looks great. Can we visit?', delay: 1200 },
  { from: 'agent', text: 'Of course. Pick a date for a campus tour.' },
  { from: 'agent', type: 'calendar', noTyping: true, delay: 300,
    calendar: {
      month: 'November 2026',
      days: [3, 4, 5, 6, 7, 8, 9],
      selected: 7,
      times: ['10:00', '11:00', '14:00', '16:00'],
      selectedTime: '11:00',
    } },
  { from: 'lead',  text: 'Saturday 11am works', delay: 1000 },
  { from: 'agent', text: 'Locked in. Quick details to confirm:' },
  { from: 'agent', type: 'form', noTyping: true, delay: 300,
    form: {
      title: 'Booking Details',
      fields: [
        { label: 'Name',  value: 'Anil Sharma' },
        { label: 'Email', value: 'anil@example.com' },
        { label: 'Phone', value: '+91 98765 43210' },
      ],
      btn: 'Book Now',
    } },
];

/* ═══════════════════════════════════════════════════════════════
   CONVERSATION PLAYER HOOK
═══════════════════════════════════════════════════════════════ */
function useConvPlayer(msgs: ConvMsg[], isActive: boolean) {
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!isActive) { setShown(0); setTyping(false); return; }
    let stopped = false;
    const ts: ReturnType<typeof setTimeout>[] = [];

    function run() {
      setShown(0); setTyping(false);
      let t = 200;
      ts.push(setTimeout(() => { if (!stopped) setShown(1); }, t));
      for (let i = 0; i < msgs.length - 1; i++) {
        t += (msgs[i].delay ?? 1200) / 2;
        const next = msgs[i + 1];
        if (next.from === 'agent' && !next.noTyping) {
          ts.push(setTimeout(() => { if (!stopped) setTyping(true); }, t));
          t += 450;
        }
        const cnt = i + 2;
        ts.push(setTimeout(() => { if (!stopped) { setTyping(false); setShown(cnt); } }, t));
      }
      t += ((msgs[msgs.length - 1].delay ?? 1200) / 2) + 2000;
      ts.push(setTimeout(() => { if (!stopped) run(); }, t));
    }
    run();
    return () => { stopped = true; ts.forEach(clearTimeout); };
  }, [isActive, msgs]);

  return { shown, typing };
}

/* ═══════════════════════════════════════════════════════════════
   TYPING DOTS
═══════════════════════════════════════════════════════════════ */
function TypingDots() {
  return (
    <div className="cd-typing">
      <span className="cd-typing-dot" />
      <span className="cd-typing-dot" />
      <span className="cd-typing-dot" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WHATSAPP CHAT
═══════════════════════════════════════════════════════════════ */
function WaChat({ msgs, isActive, industry }: { msgs: ConvMsg[]; isActive: boolean; industry: string }) {
  const { shown, typing } = useConvPlayer(msgs, isActive);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [shown, typing]);

  // Preload carousel images once so they stay in cache across loop restarts (no flicker)
  useEffect(() => {
    const urls = new Set<string>();
    msgs.forEach(m => m.carousel?.forEach(c => c.img && urls.add(c.img)));
    urls.forEach(u => { const img = new Image(); img.src = u; });
  }, [msgs]);

  const visible = msgs.slice(0, shown);

  return (
    <div className="cd-wa">
      {/* Header */}
      <div className="cd-wa-hdr">
        <span className="cd-wa-hdr-back"><FiChevronLeft size={18} /></span>
        <span className="cd-wa-hdr-av">P</span>
        <div className="cd-wa-hdr-info">
          <span className="cd-wa-hdr-name">Real Estate PROXe</span>
          <span className="cd-wa-hdr-status">
            <span className="cd-wa-hdr-dot" />online
          </span>
        </div>
        <div className="cd-wa-hdr-actions">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </div>
      </div>
      {/* Body */}
      <div className="cd-wa-body" ref={bodyRef}>
        {visible.map((m, i) => {
          if (m.type === 'qr') {
            return (
              <div key={i} className="cd-wa-qr conv-msg-in">
                {(m.qr ?? []).map((q) => (
                  <button key={q} className="cd-wa-qr-btn">{q}</button>
                ))}
              </div>
            );
          }
          if (m.type === 'carousel') {
            return (
              <div key={i} className="cd-wa-carousel conv-msg-in">
                {(m.carousel ?? []).map((c, ci) => (
                  <div key={ci} className="cd-wa-caro-card">
                    {c.img ? (
                      <div className="cd-wa-caro-img cd-wa-caro-img--photo">
                        <img src={c.img} alt={c.title} loading="lazy" />
                      </div>
                    ) : (
                      <div className="cd-wa-caro-img" style={{ background: c.imgBg ?? 'linear-gradient(135deg, #4338ca, #7c3aed)' }}>
                        <span className="cd-wa-caro-img-icon">{c.imgIcon ?? '🏠'}</span>
                      </div>
                    )}
                    <div className="cd-wa-caro-body">
                      <div className="cd-wa-caro-title">{c.title}</div>
                      <div className="cd-wa-caro-sub">{c.sub}</div>
                    </div>
                    <div className="cd-wa-caro-actions">
                      <button className="cd-wa-caro-btn">{c.btn}</button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }
          if (m.type === 'conf-card' && m.confCard) {
            const cc = m.confCard;
            return (
              <div key={i} className="cd-wa-conf conv-msg-in">
                <div className="cd-wa-conf-hdr" style={{ background: cc.color }}>
                  <FiCheck size={16} color="#fff" />
                  <span>{cc.title}</span>
                </div>
                <div className="cd-wa-conf-body">
                  {cc.lines.map((l, li) => <div key={li} className="cd-wa-conf-line">{l}</div>)}
                  <button className="cd-wa-conf-btn" style={{ background: cc.color }}><FiCalendar size={12} /> {cc.btn}</button>
                </div>
              </div>
            );
          }
          const isLead = m.from === 'lead';
          return (
            <div key={i} className={`cd-wa-row cd-wa-row--${isLead ? 'lead' : 'agent'} conv-msg-in`}>
              <div className={`cd-wa-bub cd-wa-bub--${isLead ? 'lead' : 'agent'}`}>{m.text}</div>
            </div>
          );
        })}
        {typing && (
          <div className="cd-wa-row cd-wa-row--agent conv-msg-in">
            <div className="cd-wa-bub cd-wa-bub--agent"><TypingDots /></div>
          </div>
        )}
      </div>
      {/* Input bar */}
      <div className="cd-wa-input">
        <span className="cd-wa-input-emoji">😊</span>
        <span className="cd-wa-input-txt">Message</span>
        <span className="cd-wa-input-mic">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VOICE DEMO — transcript + waveform
═══════════════════════════════════════════════════════════════ */
function VoiceDemo({ isActive }: { isActive: boolean }) {
  const [shown, setShown] = useState(0);
  const [secs, setSecs] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) { setShown(0); setSecs(0); setSpeaking(false); return; }
    const tick = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(tick);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;
    let stopped = false;
    const ts: ReturnType<typeof setTimeout>[] = [];
    function run() {
      setShown(0); setSpeaking(false);
      let t = 600;
      for (let i = 0; i < VOICE.length; i++) {
        ts.push(setTimeout(() => {
          if (stopped) return;
          setShown(i + 1);
          setSpeaking(VOICE[i].from === 'proxe');
        }, t));
        t += 2000;
        if (VOICE[i].from === 'proxe') {
          ts.push(setTimeout(() => { if (!stopped) setSpeaking(false); }, t - 300));
        }
      }
      ts.push(setTimeout(() => { if (!stopped) { setSecs(0); run(); } }, t + 4000));
    }
    run();
    return () => { stopped = true; ts.forEach(clearTimeout); };
  }, [isActive]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [shown]);

  const fmt = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <div className="cd-voice">
      {/* Top bar */}
      <div className="cd-voice-topbar">
        <span className="cd-voice-live"><span className="cd-voice-live-dot" />ON CALL</span>
        <span className="cd-voice-timer">{fmt}</span>
      </div>
      {/* Title */}
      <div className="cd-voice-title">
        <div className="cd-voice-phone-icon"><FiPhone size={22} /></div>
        <div className="cd-voice-name">PROXe Voice</div>
        <div className="cd-voice-subtitle">AI Agent — Live Transcript</div>
      </div>
      {/* Transcript */}
      <div className="cd-voice-transcript" ref={bodyRef}>
        {VOICE.slice(0, shown).map((l, i) => (
          <div key={i} className={`cd-voice-line cd-voice-line--${l.from} conv-msg-in`}>
            <span className="cd-voice-who">{l.from === 'caller' ? 'CALLER' : 'PROXE'}</span>
            <span className="cd-voice-text">{l.text}</span>
          </div>
        ))}
      </div>
      {/* Waveform */}
      <div className={`cd-voice-wave-wrap${speaking ? ' cd-voice-wave-wrap--on' : ''}`}>
        <div className="cd-voice-wave">
          {[...Array(8)].map((_, i) => (
            <span key={i} className="cd-voice-bar" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <span className="cd-voice-wave-lbl">PROXE IS SPEAKING</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INSTAGRAM DM
═══════════════════════════════════════════════════════════════ */
function IgChat({ isActive }: { isActive: boolean }) {
  const { shown, typing } = useConvPlayer(IG, isActive);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [shown, typing]);
  const visible = IG.slice(0, shown);

  return (
    <div className="cd-ig">
      <div className="cd-ig-hdr">
        <span className="cd-ig-back"><FiChevronLeft size={16} /></span>
        <div className="cd-ig-hdr-av">
          <img src="/proxe/brand/proxe-icon-white.webp" alt="PROXe" width={28} height={28} />
        </div>
        <div className="cd-ig-hdr-info">
          <span className="cd-ig-hdr-name">Coaching PROXe</span>
          <span className="cd-ig-hdr-active">Active now</span>
        </div>
        <svg className="cd-ig-hdr-call" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
      </div>
      <div className="cd-ig-body" ref={bodyRef}>
        {visible.map((m, i) => {
          if (m.type === 'pill-btn') return (
            <div key={i} className="cd-ig-row cd-ig-row--agent conv-msg-in">
              <button className="cd-ig-pill">{m.pillBtn}</button>
            </div>
          );
          if (m.type === 'qr') return (
            <div key={i} className="cd-ig-row cd-ig-row--agent conv-msg-in">
              <div className="cd-ig-qr">
                {(m.qr ?? []).map(q => <button key={q} className="cd-ig-qr-btn">{q}</button>)}
              </div>
            </div>
          );
          const isLead = m.from === 'lead';
          return (
            <div key={i} className={`cd-ig-row cd-ig-row--${isLead ? 'lead' : 'agent'} conv-msg-in`}>
              <div className={`cd-ig-bub cd-ig-bub--${isLead ? 'lead' : 'agent'}`}>{m.text}</div>
            </div>
          );
        })}
        {typing && (
          <div className="cd-ig-row cd-ig-row--agent conv-msg-in">
            <div className="cd-ig-bub cd-ig-bub--agent"><TypingDots /></div>
          </div>
        )}
      </div>
      <div className="cd-ig-input">
        <input className="cd-ig-input-field" placeholder="Message..." readOnly />
        <button className="cd-ig-input-send">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MESSENGER CHAT
═══════════════════════════════════════════════════════════════ */
function MsnChat({ isActive }: { isActive: boolean }) {
  const { shown, typing } = useConvPlayer(MSN, isActive);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [shown, typing]);
  const visible = MSN.slice(0, shown);

  return (
    <div className="cd-msn">
      <div className="cd-msn-hdr">
        <span className="cd-msn-back"><FiChevronLeft size={16} /></span>
        <div className="cd-msn-hdr-av">
          <svg width="14" height="14" viewBox="0 0 24 24"><defs><linearGradient id="msn-g" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0695FF"/><stop offset="100%" stopColor="#A033FF"/></linearGradient></defs><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.94 1.32 5.57 3.4 7.37L5 22l3.5-1.9A10.83 10.83 0 0012 20.486c5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2z" fill="url(#msn-g)"/><path d="M7 13l2.5-3.5L12 11l2.5-3.5L17 11" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
        </div>
        <div className="cd-msn-hdr-info">
          <span className="cd-msn-hdr-name">Clinic PROXe</span>
          <span className="cd-msn-hdr-active">Active now</span>
        </div>
      </div>
      <div className="cd-msn-body" ref={bodyRef}>
        {visible.map((m, i) => {
          if (m.type === 'cta-card' && m.ctaCard) return (
            <div key={i} className="cd-msn-row cd-msn-row--agent conv-msg-in">
              <div className="cd-msn-card">
                <button className="cd-msn-card-btn" style={{ background: m.ctaCard.color ?? '#0084FF' }}>{m.ctaCard.btn}</button>
              </div>
            </div>
          );
          const isLead = m.from === 'lead';
          return (
            <div key={i} className={`cd-msn-row cd-msn-row--${isLead ? 'lead' : 'agent'} conv-msg-in`}>
              <div className={`cd-msn-bub cd-msn-bub--${isLead ? 'lead' : 'agent'}`}>{m.text}</div>
            </div>
          );
        })}
        {typing && (
          <div className="cd-msn-row cd-msn-row--agent conv-msg-in">
            <div className="cd-msn-bub cd-msn-bub--agent"><TypingDots /></div>
          </div>
        )}
      </div>
      <div className="cd-msn-input">
        <input className="cd-msn-input-field" placeholder="Aa" readOnly />
        <button className="cd-msn-input-like">👍</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WEB CHAT WIDGET
═══════════════════════════════════════════════════════════════ */
function WebWidget({ isActive }: { isActive: boolean }) {
  const { shown, typing } = useConvPlayer(WEB, isActive);
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [shown, typing]);
  const visible = WEB.slice(0, shown);

  return (
    <div className="cd-web">
      <div className="cd-web-hdr">
        <div className="cd-web-hdr-brand">
          <div className="cd-web-hdr-av">
            <img src="/proxe/brand/proxe-icon-white.webp" alt="PROXe" width={20} height={20} />
          </div>
          <span className="cd-web-hdr-name">Education PROXe</span>
        </div>
        <div className="cd-web-hdr-icons">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </div>
      </div>
      <div className="cd-web-body" ref={bodyRef}>
        {visible.map((m, i) => {
          if (m.type === 'qr') return (
            <div key={i} className="cd-web-links conv-msg-in">
              {(m.qr ?? []).map(q => <button key={q} className="cd-web-link-btn">{q}</button>)}
            </div>
          );
          if (m.type === 'carousel' && m.carousel) return (
            <div key={i} className="cd-web-carousel conv-msg-in">
              {m.carousel.map((c, ci) => (
                <div key={ci} className="cd-web-caro-card">
                  {c.img && (
                    <div className="cd-web-caro-img"><img src={c.img} alt={c.title} loading="lazy" /></div>
                  )}
                  <div className="cd-web-caro-body">
                    <div className="cd-web-caro-title">{c.title}</div>
                    <div className="cd-web-caro-sub">{c.sub}</div>
                    <button className="cd-web-caro-btn">{c.btn} →</button>
                  </div>
                </div>
              ))}
            </div>
          );
          if (m.type === 'calendar' && m.calendar) {
            const cal = m.calendar;
            // Build a full 35-cell month grid for Nov 2026 (starts on a Sunday: Nov 1 = Sun)
            const dows = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
            const prevMonthDays = [26, 27, 28, 29, 30, 31];      // Oct trailing days (last week)
            const monthDays = Array.from({ length: 30 }, (_, k) => k + 1); // Nov 1-30
            const nextMonthDays = [1, 2, 3, 4, 5];                // Dec leading days
            return (
              <div key={i} className="cd-web-cal conv-msg-in">
                <div className="cd-web-cal-close">×</div>
                <div className="cd-web-cal-hdr-row">
                  <span className="cd-web-cal-arr">‹</span>
                  <span className="cd-web-cal-month">{cal.month}</span>
                  <span className="cd-web-cal-arr">›</span>
                </div>
                <div className="cd-web-cal-grid">
                  {dows.map(d => <span key={d} className="cd-web-cal-dow">{d}</span>)}
                  {prevMonthDays.map(d => <span key={`p${d}`} className="cd-web-cal-day cd-web-cal-day--muted">{d}</span>)}
                  {monthDays.map(d => (
                    <button
                      key={d}
                      className={`cd-web-cal-day${d === cal.selected ? ' cd-web-cal-day--active' : ''}`}
                    >{d}</button>
                  ))}
                  {nextMonthDays.map(d => <span key={`n${d}`} className="cd-web-cal-day cd-web-cal-day--muted">{d}</span>)}
                </div>
                <div className="cd-web-cal-times">
                  {cal.times.map(t => (
                    <button
                      key={t}
                      className={`cd-web-cal-time${t === cal.selectedTime ? ' cd-web-cal-time--active' : ''}`}
                    >{t}</button>
                  ))}
                </div>
              </div>
            );
          }
          if (m.type === 'form' && m.form) {
            const fm = m.form;
            return (
              <div key={i} className="cd-web-form conv-msg-in">
                <div className="cd-web-form-close">×</div>
                <div className="cd-web-form-hdr">{fm.title}</div>
                <div className="cd-web-form-sub">Saturday, Nov 7 · 11:00 AM</div>
                {fm.fields.map(f => (
                  <input key={f.label} className="cd-web-form-input" defaultValue={f.value} readOnly />
                ))}
                <div className="cd-web-form-row">
                  <button className="cd-web-form-back">Back</button>
                  <button className="cd-web-form-btn">{fm.btn}</button>
                </div>
              </div>
            );
          }
          const isLead = m.from === 'lead';
          return (
            <div key={i} className={`cd-web-row cd-web-row--${isLead ? 'lead' : 'agent'} conv-msg-in`}>
              <div className={`cd-web-bub cd-web-bub--${isLead ? 'lead' : 'agent'}`}>{m.text}</div>
            </div>
          );
        })}
        {typing && (
          <div className="cd-web-row cd-web-row--agent conv-msg-in">
            <div className="cd-web-bub cd-web-bub--agent"><TypingDots /></div>
          </div>
        )}
      </div>
      <div className="cd-web-powered">
        <img src="/proxe/brand/proxe-icon-white.webp" alt="" width={11} height={11} />
        <span>Powered by <strong>PROXe</strong></span>
      </div>
      <div className="cd-web-input">
        <button className="cd-web-input-call" aria-label="Call">
          <FiPhone size={14} />
        </button>
        <input className="cd-web-input-field" placeholder="Type your message..." readOnly />
        <button className="cd-web-input-send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PHONE FRAME
═══════════════════════════════════════════════════════════════ */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="cd-phone-wrap">
      <span className="cd-phone-vol" />
      <span className="cd-phone-pwr" />
      <div className="cd-phone">
        <div className="cd-phone-notch"><div className="cd-phone-pill"><div className="cd-phone-cam" /></div></div>
        <div className="cd-phone-screen">{children}</div>
        <div className="cd-phone-home"><span className="cd-phone-bar" /></div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CHANNEL TABS
═══════════════════════════════════════════════════════════════ */
const TABS = [
  { id: 'voice',    label: 'Voice',    Icon: FiPhone },
  { id: 'whatsapp', label: 'WhatsApp', Icon: SiWhatsapp },
];

const WA_SUBS = Object.keys(WA);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function ChannelDemo() {
  const industry = 'Real Estate';
  const currentMsgs = WA[industry];

  const CHANNELS = [
    { id: 'voice',     label: 'Voice',     Icon: FiPhone },
    { id: 'whatsapp',  label: 'WhatsApp',  Icon: SiWhatsapp },
    { id: 'web',       label: 'Web Chat',  Icon: FiGlobe },
    { id: 'instagram', label: 'Instagram', Icon: SiInstagram },
    { id: 'messenger', label: 'Messenger', Icon: SiMessenger },
  ];

  const [active, setActive] = useState('voice');
  const [paused, setPaused] = useState(false);
  const SLIDE_MS = 7000;

  // Auto-advance through channels with a timer
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => {
      const idx = CHANNELS.findIndex(c => c.id === active);
      const next = CHANNELS[(idx + 1) % CHANNELS.length];
      setActive(next.id);
    }, SLIDE_MS);
    return () => clearTimeout(t);
  }, [active, paused]);

  return (
    <section className="cd-section" id="voice">
      <div className="proxe-container">
        <div className="proxe-section-label" style={{ textAlign: 'center' }}>PROXe in Action</div>
        <h2 className="cd-headline">See PROXe in action.</h2>
        <p className="cd-sub">
          One AI brain. Every channel. Pick a channel to see it live.
        </p>

        <div className="cd-stage">
          {/* ── Left: curved channel nav ── */}
          <nav className="cd-nav" aria-label="Channels" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {CHANNELS.map(({ id, label, Icon }, idx) => {
              // Fixed semicircle by INDEX (does not change when active changes)
              const total = CHANNELS.length;
              const mid = (total - 1) / 2;            // 2 for 5 items
              const distFromMid = Math.abs(idx - mid); // 2,1,0,1,2
              const offsetX = distFromMid === 0 ? 60 : distFromMid === 1 ? 30 : -10;
              const scale = distFromMid === 0 ? 1.08 : distFromMid === 1 ? 0.96 : 0.88;
              const opacity = distFromMid === 0 ? 1 : distFromMid === 1 ? 0.78 : 0.5;
              const isActive = active === id;
              return (
                <button
                  key={id}
                  className={`cd-nav-item${isActive ? ' cd-nav-item--active' : ''}`}
                  onClick={() => { setActive(id); setPaused(false); }}
                  style={{
                    transform: `translateX(${offsetX}px) scale(${scale})`,
                    opacity,
                  }}
                >
                  <span className="cd-nav-icon"><Icon size={20} /></span>
                  <span className="cd-nav-label">{label}</span>
                  {active === id && (
                    <span
                      className="cd-nav-progress"
                      key={`${id}-${Date.now()}`}
                      style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right: active channel preview ── */}
          <div
            className="cd-preview"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onClick={() => setPaused(true)}
          >
            {active === 'voice' && (
              <div className="cd-voice-stage" key="voice">
                <VapiOrb />
              </div>
            )}
            {active === 'whatsapp' && (
              <div className="cd-whatsapp-stage" key="whatsapp">
                <PhoneFrame>
                  <WaChat msgs={currentMsgs} isActive industry={industry} />
                </PhoneFrame>
              </div>
            )}
            {active === 'instagram' && (
              <div className="cd-whatsapp-stage" key="instagram">
                <PhoneFrame>
                  <IgChat isActive />
                </PhoneFrame>
              </div>
            )}
            {active === 'messenger' && (
              <div className="cd-whatsapp-stage" key="messenger">
                <PhoneFrame>
                  <MsnChat isActive />
                </PhoneFrame>
              </div>
            )}
            {active === 'web' && (
              <div className="cd-whatsapp-stage" key="web">
                <PhoneFrame>
                  <WebWidget isActive />
                </PhoneFrame>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
