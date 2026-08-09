'use client';

import { useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import type { Industry } from '../../lib/industries';
import type { SimAction, Source } from './sim/store';
import { nextId } from './sim/generate';
import { mulberry32, hashString, pick, between } from './sim/rng';

type WMsg = { id: string; role: 'visitor' | 'proxe'; text: string };

/**
 * The aha-moment pane: a miniature of the CUSTOMER's website with the PROXe
 * widget on it. The visitor types as a customer; the reply appears here AND a
 * lead + conversation land in the dashboard they're looking at — the loop the
 * whole product is about, demonstrated in one interaction.
 */
export default function DemoWidgetPane({
  industry,
  dispatch,
  onInteract,
}: {
  industry: Industry;
  dispatch: React.Dispatch<SimAction>;
  onInteract: (what: 'lead_open' | 'chat_send' | 'widget_send') => void;
}) {
  const d = industry.demo;
  const [msgs, setMsgs] = useState<WMsg[]>([
    { id: 'w0', role: 'proxe', text: `Hi! Welcome to ${d.business.name}. How can I help today?` },
  ]);
  const [draft, setDraft] = useState('');
  const createdLead = useRef<{ leadId: string; threadId: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs.length]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    onInteract('widget_send');
    setMsgs((m) => [...m, { id: nextId('w'), role: 'visitor', text }]);

    const rng = mulberry32(hashString(text) ^ msgs.length);
    const reply = pick(rng, d.aiReplies);

    // First message creates the lead + thread in the dashboard — visibly.
    if (!createdLead.current) {
      const leadId = nextId('lead');
      const threadId = nextId('th');
      createdLead.current = { leadId, threadId };
      const name = 'You (website visitor)';
      dispatch({
        type: 'NEW_LEAD',
        lead: { id: leadId, name, source: 'Website' as Source, score: between(rng, 40, 60), stage: 0, minutesAgo: 0, threadId },
        thread: {
          id: threadId,
          leadId,
          name,
          source: 'Website',
          msgs: [{ id: nextId('m'), role: 'customer', text, at: Date.now() }],
          typing: false,
          unread: 1,
        },
        toast: { id: nextId('t'), text: 'New lead — You, via the website widget', kind: 'lead' },
      });
    } else {
      dispatch({
        type: 'USER_MESSAGE',
        threadId: createdLead.current.threadId,
        msg: { id: nextId('m'), role: 'customer', text, at: Date.now() },
      });
    }

    // PROXe answers in the widget AND in the dashboard thread.
    const threadId = createdLead.current.threadId;
    setTimeout(() => {
      setMsgs((m) => [...m, { id: nextId('w'), role: 'proxe', text: reply }]);
      dispatch({
        type: 'CHAT_MSG',
        threadId,
        msg: { id: nextId('m'), role: 'proxe', text: reply, at: Date.now() },
      });
    }, 1500);
  };

  return (
    <aside className="demo-widgetpane" data-tour="widget">
      <div className="demo-widgetpane-head">
        <div className="demo-pane-title">Try it yourself</div>
        <p className="demo-widgetpane-sub">
          This is {d.business.name}&rsquo;s website. Message the widget as a
          customer — watch yourself appear in the inbox on the left.
        </p>
      </div>
      <div className="demo-site">
        <div className="demo-site-bar">
          <span className="demo-site-dot" />
          <span className="demo-site-dot" />
          <span className="demo-site-dot" />
          {d.business.name.toLowerCase().replace(/\s+/g, '')}.com
        </div>
        <div className="demo-site-body">
          <div className="demo-site-sk demo-site-sk--hero" />
          <div className="demo-site-sk" style={{ width: '70%' }} />
          <div className="demo-site-sk" style={{ width: '52%' }} />
          <div className="demo-sitewidget">
            <div className="demo-sitewidget-head">
              <span className="demo-sitewidget-dot" /> {d.business.name}
            </div>
            <div className="demo-sitewidget-msgs" ref={scrollRef}>
              {msgs.map((m) => (
                <div key={m.id} className={`demo-sitewidget-msg demo-sitewidget-msg--${m.role}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="demo-sitewidget-input">
              <input
                value={draft}
                placeholder="Ask something…"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              />
              <button type="button" className="demo-sitewidget-send" onClick={send} aria-label="Send">
                <FiSend size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
