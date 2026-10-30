// src/diff.ts — simple word-level diff between original and tailored text
export function wordDiff(a: string, b: string): { type: 'same' | 'changed'; a: string; b: string }[] {
  const aw = a.split(/\s+/)
  const bw = b.split(/\s+/)
  const out: { type: 'same' | 'changed'; a: string; b: string }[] = []
  const max = Math.max(aw.length, bw.length)
  for (let i = 0; i < max; i++) {
    const wa = aw[i] ?? ''
    const wb = bw[i] ?? ''
    if (wa === wb) out.push({ type: 'same', a: wa, b: wb })
    else out.push({ type: 'changed', a: wa, b: wb })
  }
  return out
}
