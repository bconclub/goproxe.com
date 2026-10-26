/**
 * Opening lines ("hooks") to listen to on the dialer, in the call voice. Only
 * what is live or being tested right now (Z, 26 Oct 2026: "only show the final
 * options"); drafts that were not picked are dropped, not kept here.
 * "Proxy" so the voice says PROXe right; sample names stand in for the real ones.
 */
import { OPENERS } from './bdrOpeners'

export const HOOK_GROUPS = ['Intro Cold · testing', 'Intro DM · testing', 'Other live calls'] as const
export type HookGroup = (typeof HOOK_GROUPS)[number]
export interface BdrHook { id: string; group: HookGroup; label: string; text: string }

export const BDR_HOOKS: BdrHook[] = [
  ...OPENERS.noname.map((o): BdrHook => ({ id: `cold-${o.v}`, group: 'Intro Cold · testing', label: `${o.v} · ${o.label}`, text: `Hi, am I speaking with the dental clinic? ... ${o.line('')}` })),
  ...OPENERS.dm.map((o): BdrHook => ({ id: `dm-${o.v}`, group: 'Intro DM · testing', label: `${o.v} · ${o.label}`, text: `Hi, is this Ramesh? ... ${o.line('Ramesh')}` })),
  { id: 'live-warm', group: 'Other live calls', label: 'Follow-up', text: 'Hi Ramesh, Proxy here, following up like I said I would. Is now okay?' },
  { id: 'live-callback', group: 'Other live calls', label: 'Website callback', text: 'Hi Ramesh, this is Proxy calling back from goproxe dot com. Have I caught you at an okay time?' },
]
