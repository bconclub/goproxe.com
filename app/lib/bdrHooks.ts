/**
 * Opening lines ("hooks") for the outbound calls, to listen to side by side
 * before one goes live (Z, 26 Oct 2026: "I want to hear the first pitches").
 * Written the way the agents say them: "Proxy" so the voice says PROXe right,
 * sample names in place of {{first_name}} / {{business_name}}.
 */
import { OPENERS } from './bdrOpeners'

export interface BdrHook { id: string; group: 'Live now' | 'New options'; label: string; text: string }

export const BDR_HOOKS: BdrHook[] = [
  ...OPENERS.noname.map((o): BdrHook => ({ id: `cold-${o.v}`, group: 'Live now', label: `Intro Cold ${o.v} · ${o.label}`, text: `Hi, is this Bright Smile Dental? ... ${o.line('')}` })),
  ...OPENERS.dm.map((o): BdrHook => ({ id: `dm-${o.v}`, group: 'Live now', label: `Intro DM ${o.v} · ${o.label}`, text: `Hi, is this Ramesh? ... ${o.line('Ramesh')}` })),
  { id: 'live-warm', group: 'Live now', label: 'Follow-up', text: 'Hi Ramesh, Proxy here, following up like I said I would. Is now okay?' },
  { id: 'live-callback', group: 'Live now', label: 'Website callback', text: 'Hi Ramesh, this is Proxy calling back from goproxe dot com. Have I caught you at an okay time?' },
  { id: 'live-pitch', group: 'Live now', label: 'Pitch page', text: 'Hey! You just finished looking at the Proxy pitch. Do you have any questions for me? And before that, can I get your name?' },
  { id: 'new-a', group: 'New options', label: 'A · Plain', text: "Hi, this is Proxy. I'm an AI, calling to introduce myself. Is this Bright Smile Dental?" },
  { id: 'new-b', group: 'New options', label: 'B · Says what it does', text: 'Hi, this is Proxy, an AI. I answer customer messages for businesses, on WhatsApp, the website and calls. Is this Bright Smile Dental?' },
  { id: 'new-c', group: 'New options', label: 'C · Asks first', text: "Hi, this is Proxy. I'm an AI, calling to introduce myself. Quick question: who looks after customer enquiries at Bright Smile Dental?" },
  { id: 'new-d', group: 'New options', label: 'D · Permission first', text: "Hi, this is Proxy. I'm an AI, and I'm calling to introduce myself. Have I caught you at an okay time?" },
  { id: 'new-e', group: 'New options', label: 'E · Shortest', text: 'Hi Ramesh, this is Proxy, an AI. I help clinics in Bangalore answer every customer and keep the team on the right leads. Is that useful for Bright Smile Dental?' },
  { id: 'new-f', group: 'New options', label: 'F · Their world', text: "Hi Ramesh, this is Proxy, an AI, calling to introduce myself. Roughly how many enquiries do you get a day, and who answers them after hours?" },
]
