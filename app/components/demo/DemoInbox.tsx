'use client';

import { useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import type { Industry } from '../../lib/industries';
import type { SimAction, SimState } from './sim/store';
import { nextId } from './sim/generate';
import { mulberry32, hashString, pick } from './sim/rng';
import DemoWidgetPane from './DemoWidgetPane';

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('');
}

function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Inbox view: thread list | active chat | the simulated customer website.
 *
 * Typing in the chat = replying AS the business (like the real dashboard's
 * manual reply). The simulated customer answers from the industry's reply
 * pool after a typing delay.
 */
export default function DemoInbox({
  industry,
  state,
  dispatch,
  onInteract,
}: {
  industry: Industry;
  state: SimState;
  dispatch: React.Dispatch<SimAction>;
  onInteract: (what: 'lead_open' | 'chat_send' | 'widget_send') => void;
}) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const active = state.threads.find((t) => t.id === state.activeThreadId) ?? state.threads[0];

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.msgs.length, active?.typing, active?.id]);

  const send = () => {
    const text = draft.trim();
    if (!text || !active) return;
    setDraft('');
    onInteract('chat_send');
    dispatch({
      type: 'USER_MESSAGE',
      threadId: active.id,
      msg: { id: nextId('m'), role: 'user', text, at: Date.now() },
    });
    // The customer replies — content seeded by thread id + message count so
    // it's stable, delay fixed.
    const rng = mulberry32(hashString(active.id) ^ active.msgs.length);
    const threadId = active.id;
    setTimeout(() => dispatch({ type: 'TYPING', threadId, on: true }), 900);
    setTimeout(() => {
      dispatch({
        type: 'CHAT_MSG',
        threadId,
        msg: { id: nextId('m'), role: 'customer', text: pick(rng, industry.demo.userReplyPool), at: Date.now() },
      });
    }, 2300);
  };

  return (
    <>
      <div className="demo-threads" data-tour="threads">
        <div className="demo-pane-title">Conversations</div>
        {state.threads.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`demo-thread${t.isNew ? ' demo-thread--new' : ''}`}
            data-active={t.id === active?.id}
            onClick={() => dispatch({ type: 'OPEN_THREAD', threadId: t.id })}
          >
            <span className="demo-thread-ava">{initials(t.name)}</span>
            <span className="demo-thread-mid">
              <span className="demo-thread-name">
                {t.name} <span className="demo-thread-src">{t.source}</span>
              </span>
              <span className="demo-thread-prev">
                {t.typing ? 'typing…' : t.msgs[t.msgs.length - 1]?.text}
              </span>
            </span>
            {t.unread > 0 && <span className="demo-thread-unread">{t.unread}</span>}
          </button>
        ))}
      </div>

      <div className="demo-chat" data-tour="chat">
        {active ? (
          <>
            <div className="demo-chat-head">
              <span className="demo-thread-ava">{initials(active.name)}</span>
              <span>
                {active.name}
                <br />
                <small>{active.source} · handled by PROXe</small>
              </span>
            </div>
            <div className="demo-chat-scroll" ref={scrollRef}>
              {active.msgs.map((m) => (
                <div key={m.id} className={`demo-bubble demo-bubble--${m.role}`}>
                  {m.text}
                  <span className="demo-bubble-meta">
                    {m.role === 'proxe' ? 'PROXe · ' : m.role === 'user' ? 'You · ' : ''}
                    {fmtTime(m.at)}
                  </span>
                </div>
              ))}
              {active.typing && (
                <div className="demo-typing"><span /><span /><span /></div>
              )}
            </div>
            <div className="demo-chat-input">
              <input
                value={draft}
                placeholder="Jump in as the owner — type a reply…"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              />
              <button type="button" className="demo-send" onClick={send} aria-label="Send">
                <FiSend size={15} />
              </button>
            </div>
          </>
        ) : null}
      </div>

      <DemoWidgetPane industry={industry} dispatch={dispatch} onInteract={onInteract} />
    </>
  );
}
