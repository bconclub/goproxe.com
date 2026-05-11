'use client';
import { useEffect, useRef, useState } from 'react';
import { SiWhatsapp, SiInstagram, SiMessenger } from 'react-icons/si';
import { FiPhone, FiGlobe, FiCheck, FiCalendar, FiChevronLeft } from 'react-icons/fi';
import VapiOrb from './VapiOrb';

/* ═══════════════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════════════ */
type MsgFrom = 'lead' | 'agent';
type MsgType = 'text' | 'qr' | 'carousel' | 'conf-card' | 'cta-card' | 'pill-btn';

interface ConvMsg {
  from: MsgFrom;
  text?: string;
  delay?: number;       // ms before this item shows (default 1200)
  noTyping?: boolean;   // skip typing indicator
  type?: MsgType;
  qr?: string[];
  carousel?: Array<{ title: string; sub: string; btn: string }>;
  confCard?: { title: string; lines: string[]; btn: string; color: string };
  ctaCard?: { btn: string; color?: string };
  pillBtn?: string;
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
    { from: 'lead',  text: 'Hi I saw your 4BHK listing in Whitefield. Still available?' },
    { from: 'agent', text: 'Yes, available. 2400 sqft, fully furnished. 1.35 Cr negotiable.' },
    { from: 'agent', type: 'carousel', noTyping: true, delay: 400,
      carousel: [{ title: 'Whitefield 4BHK', sub: '1.35 Cr', btn: 'View Details' }, { title: 'Marathahalli 3BHK', sub: '98L', btn: 'View Details' }] },
    { from: 'lead',  text: 'Can I visit Saturday?', delay: 900 },
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
  { from: 'agent', text: 'Yes, fully online. 12-week program. Workouts, diet, weekly calls. Where are you based?' },
  { from: 'lead',  text: 'Bangalore', delay: 800 },
  { from: 'agent', text: 'Perfect. We have 3 clients from Bangalore right now. Want to jump on a free call this week?' },
  { from: 'lead',  text: 'How much does it cost?', delay: 900 },
  { from: 'agent', text: 'Starts at 8,000 a month. First call is free. No commitment.' },
  { from: 'agent', type: 'pill-btn', noTyping: true, delay: 400, pillBtn: 'Book Free Call' },
];

/* ═══════════════════════════════════════════════════════════════
   MESSENGER CONVERSATION
═══════════════════════════════════════════════════════════════ */
const MSN: ConvMsg[] = [
  { from: 'lead',  text: 'Hi, does your clinic take walk-ins or only appointments?' },
  { from: 'agent', text: 'We recommend appointments to avoid waiting. Dr. Sharma has slots tomorrow. Want to book?' },
  { from: 'lead',  text: 'Yes for 2 people', delay: 900 },
  { from: 'agent', text: 'Done. Two slots confirmed tomorrow 10am and 10:30am. Confirmation sent to your inbox.' },
  { from: 'agent', type: 'cta-card', noTyping: true, delay: 400,
    ctaCard: { btn: 'View Appointment Details', color: '#0084FF' } },
];

/* ═══════════════════════════════════════════════════════════════
   WEB CHAT CONVERSATION
═══════════════════════════════════════════════════════════════ */
const WEB: ConvMsg[] = [
  { from: 'lead',  text: 'I am looking for a 3BHK under 80L in North Bangalore.' },
  { from: 'agent', text: 'We have 4 options right now. Hebbal, Yelahanka, Thanisandra, and Kogilu. Want me to send the shortlist?' },
  { from: 'lead',  text: 'Yes please', delay: 800 },
  { from: 'agent', text: 'Sent to your email. Want a callback from our agent today?' },
  { from: 'lead',  text: 'Tomorrow morning', delay: 900 },
  { from: 'agent', text: 'Callback scheduled for tomorrow 10am. See you then.' },
  { from: 'agent', type: 'qr', noTyping: true, delay: 400, qr: ['Book a Demo', 'Pricing'] },
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
      let t = 400;
      ts.push(setTimeout(() => { if (!stopped) setShown(1); }, t));
      for (let i = 0; i < msgs.length - 1; i++) {
        t += msgs[i].delay ?? 1200;
        const next = msgs[i + 1];
        if (next.from === 'agent' && !next.noTyping) {
          ts.push(setTimeout(() => { if (!stopped) setTyping(true); }, t));
          t += 900;
        }
        const cnt = i + 2;
        ts.push(setTimeout(() => { if (!stopped) { setTyping(false); setShown(cnt); } }, t));
      }
      t += (msgs[msgs.length - 1].delay ?? 1200) + 4000;
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

  const visible = msgs.slice(0, shown);

  return (
    <div className="cd-wa">
      {/* Header */}
      <div className="cd-wa-hdr">
        <span className="cd-wa-hdr-back"><FiChevronLeft size={18} /></span>
        <span className="cd-wa-hdr-av">P</span>
        <div className="cd-wa-hdr-info">
          <span className="cd-wa-hdr-name">PROXe</span>
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
                    <div className="cd-wa-caro-title">{c.title}</div>
                    <div className="cd-wa-caro-sub">{c.sub}</div>
                    <button className="cd-wa-caro-btn">{c.btn}</button>
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><defs><linearGradient id="ig-g" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f9ce34"/><stop offset="25%" stopColor="#ee2a7b"/><stop offset="100%" stopColor="#6228d7"/></linearGradient></defs><rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-g)"/><rect x="7" y="7" width="10" height="10" rx="3" fill="none" stroke="#fff" strokeWidth="1.5"/><circle cx="17" cy="7" r="1" fill="#fff"/></svg>
        </div>
        <div className="cd-ig-hdr-info">
          <span className="cd-ig-hdr-name">PROXe</span>
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
          <span className="cd-msn-hdr-name">PROXe</span>
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
          <div className="cd-web-hdr-av">P</div>
          <span className="cd-web-hdr-name">PROXe</span>
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
      <div className="cd-web-input">
        <input className="cd-web-input-field" placeholder="Type a message..." readOnly />
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

  return (
    <section className="cd-section" id="voice">
      <div className="proxe-container">
        <div className="proxe-section-label" style={{ textAlign: 'center' }}>PROXe in Action</div>
        <h2 className="cd-headline">See PROXe in action.</h2>
        <p className="cd-sub">
          One AI brain. Every channel. Try the voice agent live, then see how it handles WhatsApp conversations.
        </p>

        {/* ── Voice — full-width orb stage ── */}
        <div className="cd-channel-block">
          <div className="cd-channel-label">
            <span className="cd-channel-icon"><FiPhone size={14} /></span>
            <span>Voice</span>
          </div>
          <div className="cd-voice-stage">
            <VapiOrb />
          </div>
        </div>

        {/* ── WhatsApp — single mockup ── */}
        <div className="cd-channel-block">
          <div className="cd-channel-label">
            <span className="cd-channel-icon"><SiWhatsapp size={14} /></span>
            <span>WhatsApp</span>
          </div>
          <div className="cd-whatsapp-stage">
            <PhoneFrame>
              <WaChat msgs={currentMsgs} isActive industry={industry} />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
