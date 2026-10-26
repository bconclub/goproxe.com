/**
 * The line an outbound agent says once they confirm who picked up, in three
 * versions per agent so they can be tested against each other (Z, 26 Oct
 * 2026: "three different versions of cold and three of DM"). The dialer picks
 * one; the dial route passes it to the agent as {{intro_line}} and records
 * {{opener_variant}} on the call. Variant 1 is the default for anything that
 * doesn't choose (the bots), so {{intro_line}} is never empty.
 */
export type OpenerAgent = 'noname' | 'dm'

export interface Opener { v: 1 | 2 | 3 | 4; label: string; line: (first: string) => string }

export const OPENERS: Record<OpenerAgent, Opener[]> = {
  noname: [
    { v: 1, label: 'Thirty seconds', line: () => "Hi, I'm Proxy, and I'm an AI. I'm calling to introduce myself. Can I have thirty seconds?" },
    { v: 2, label: 'Good time', line: () => "Hi, I'm Proxy, and I'm an AI. I'm calling to introduce myself. Is this a good time?" },
    { v: 3, label: 'Straight in', line: () => "Hi, I'm Proxy, an AI that helps businesses manage their enquiries. Do you have a quick minute?" },
    // For prospects pulled from their Meta ads (Z, 26 Oct 2026). Only pick it when they really run ads.
    { v: 4, label: 'Saw your ads', line: () => "Hi, I'm Proxy, and I'm an AI. I saw your ads on Facebook, and I'm calling to introduce myself. Is this a good time, or do you have thirty seconds?" },
  ],
  dm: [
    { v: 1, label: 'Thirty seconds', line: (f) => `Hi ${f}, I'm Proxy, an AI. I'm calling to introduce myself. Can I have thirty seconds?` },
    { v: 2, label: 'Good time', line: (f) => `Hi ${f}, I'm Proxy, an AI. I'm calling to introduce myself. Is this a good time?` },
    { v: 3, label: 'Straight in', line: (f) => `Hi ${f}, I'm Proxy, an AI that helps businesses manage their enquiries. Do you have a quick minute?` },
    { v: 4, label: 'Saw your ads', line: (f) => `Hi ${f}, I'm Proxy, an AI. I saw your ads on Facebook, and I'm calling to introduce myself. Is this a good time, or do you have thirty seconds?` },
  ],
}

export function introLine(agent: string, variant: unknown, first: string): { variant: 1 | 2 | 3 | 4; line: string } {
  const list = OPENERS[agent as OpenerAgent]
  if (!list) return { variant: 1, line: '' }
  const o = list.find((x) => x.v === Number(variant)) || list[0]
  return { variant: o.v, line: o.line(first) }
}
