// src/honesty.ts — honesty level config + disclaimer
export type HonestyLevel = 'honest' | 'stretch' | 'distort' | 'anything'

export const HONESTY_LEVELS: Record<HonestyLevel, { name: string; description: string }> = {
  honest: { name: 'Honest', description: 'Reframe real experience only; no fabrication.' },
  stretch: { name: 'Stretching the Truth', description: 'Light embellishment of scope/impact.' },
  distort: { name: 'Distorting Facts', description: 'Significant reframing; use sparingly.' },
  anything: { name: 'Anything Goes', description: 'Aggressive tailoring; not recommended.' },
}

export const DISCLAIMER =
  'This level increases the gap between your real experience and the tailored resume. ' +
  'Honesty is the default and recommended. Inaccuracies can be detected by screening tools and background checks.'
