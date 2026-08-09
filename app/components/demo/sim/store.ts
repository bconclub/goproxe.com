/**
 * The demo's entire state — one reducer, no store library.
 *
 * SELF-CONTAINMENT RULE: nothing in app/components/demo/ or app/demo/ may
 * import supabase.ts, leads*.ts, dodo.ts, or fetch('/api/*'). The demo is a
 * closed loop by construction — there is no code path from here to a real
 * lead row or a real conversation.
 */

export type Source = 'WhatsApp' | 'Website' | 'Instagram' | 'Call';
export type ViewId = 'inbox' | 'leads' | 'pipeline' | 'analytics';

export type SimMsg = {
  id: string;
  /** customer = the simulated lead; proxe = the AI agent; user = the visitor
      typing as the business owner. */
  role: 'customer' | 'proxe' | 'user';
  text: string;
  /** ms epoch — display only. */
  at: number;
};

export type SimThread = {
  id: string;
  leadId: string;
  name: string;
  source: Source;
  msgs: SimMsg[];
  typing: boolean;
  unread: number;
  isNew?: boolean;
};

export type SimLead = {
  id: string;
  name: string;
  source: Source;
  score: number;
  /** Index into industry.demo.stages. */
  stage: number;
  /** Minutes ago (display); fixed at generation so ordering is deterministic. */
  minutesAgo: number;
  threadId?: string;
  isNew?: boolean;
  booked?: boolean;
};

export type SimToast = { id: string; text: string; kind: 'lead' | 'booking' | 'reply' };

export type SimMetrics = { m1: number; m2: number; m3: number; m4: string };

export type SimState = {
  leads: SimLead[];
  threads: SimThread[];
  toasts: SimToast[];
  metrics: SimMetrics;
  view: ViewId;
  activeThreadId: string | null;
  activeLeadId: string | null;
};

export type SimAction =
  | { type: 'NEW_LEAD'; lead: SimLead; thread?: SimThread; toast: SimToast }
  | { type: 'TYPING'; threadId: string; on: boolean }
  | { type: 'CHAT_MSG'; threadId: string; msg: SimMsg }
  | { type: 'SCORE_TICK'; leadId: string; delta: number }
  | { type: 'BOOKING'; leadId: string; toast: SimToast }
  | { type: 'STAGE_MOVE'; leadId: string }
  | { type: 'USER_MESSAGE'; threadId: string; msg: SimMsg }
  | { type: 'SET_VIEW'; view: ViewId }
  | { type: 'OPEN_THREAD'; threadId: string }
  | { type: 'OPEN_LEAD'; leadId: string | null }
  | { type: 'DISMISS_TOAST'; id: string }
  | { type: 'METRIC_BUMP'; key: 'm1' | 'm2' | 'm3' };

const MAX_TOASTS = 3;

export function simReducer(state: SimState, action: SimAction): SimState {
  switch (action.type) {
    case 'NEW_LEAD': {
      const leads = [{ ...action.lead, isNew: true }, ...state.leads.map((l) => ({ ...l, isNew: false }))];
      const threads = action.thread
        ? [{ ...action.thread, isNew: true }, ...state.threads.map((t) => ({ ...t, isNew: false }))]
        : state.threads;
      return {
        ...state,
        leads,
        threads,
        toasts: [action.toast, ...state.toasts].slice(0, MAX_TOASTS),
        metrics: { ...state.metrics, m2: state.metrics.m2 + (action.lead.source === 'WhatsApp' ? 1 : 0) },
      };
    }
    case 'TYPING':
      return {
        ...state,
        threads: state.threads.map((t) => (t.id === action.threadId ? { ...t, typing: action.on } : t)),
      };
    case 'CHAT_MSG':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId
            ? {
                ...t,
                typing: false,
                msgs: [...t.msgs, action.msg],
                unread: state.activeThreadId === t.id && state.view === 'inbox' ? 0 : t.unread + 1,
              }
            : t
        ),
      };
    case 'SCORE_TICK':
      return {
        ...state,
        leads: state.leads.map((l) =>
          l.id === action.leadId ? { ...l, score: Math.min(99, l.score + action.delta) } : l
        ),
      };
    case 'BOOKING':
      return {
        ...state,
        leads: state.leads.map((l) =>
          l.id === action.leadId
            ? { ...l, booked: true, stage: Math.min(l.stage + 1, 99) }
            : l
        ),
        toasts: [action.toast, ...state.toasts].slice(0, MAX_TOASTS),
        metrics: { ...state.metrics, m1: state.metrics.m1 + 1 },
      };
    case 'STAGE_MOVE':
      return {
        ...state,
        leads: state.leads.map((l) => (l.id === action.leadId ? { ...l, stage: l.stage + 1 } : l)),
      };
    case 'USER_MESSAGE':
      return {
        ...state,
        threads: state.threads.map((t) =>
          t.id === action.threadId ? { ...t, msgs: [...t.msgs, action.msg] } : t
        ),
      };
    case 'SET_VIEW':
      return { ...state, view: action.view };
    case 'OPEN_THREAD':
      return {
        ...state,
        activeThreadId: action.threadId,
        threads: state.threads.map((t) => (t.id === action.threadId ? { ...t, unread: 0 } : t)),
      };
    case 'OPEN_LEAD':
      return { ...state, activeLeadId: action.leadId };
    case 'DISMISS_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    case 'METRIC_BUMP':
      return { ...state, metrics: { ...state.metrics, [action.key]: state.metrics[action.key] + 1 } };
    default:
      return state;
  }
}
