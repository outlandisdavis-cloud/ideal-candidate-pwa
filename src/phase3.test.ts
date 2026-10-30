import { describe, it, expect } from 'vitest'
import { wordDiff } from './diff'
import { buildSystemPrompt } from './ai'

describe('docs parsing smoke', () => {
  it('parseFile is not implemented for plain text yet', async () => {
    const mod = await import('./docs')
    expect(typeof mod.parseFile).toBe('function')
  })
})

describe('job tracker smoke', () => {
  it('db has expected stores', async () => {
    const { db } = await import('./db')
    expect(db.jobs).toBeDefined()
    expect(db.resumeVersions).toBeDefined()
    expect(db.documents).toBeDefined()
    expect(db.profile).toBeDefined()
  })
})

describe('ai', () => {
  it('buildSystemPrompt includes job text', () => {
    const p = buildSystemPrompt('You are a resume editor.', 'stretch', 'Job X')
    expect(p).toContain('Job description:\nJob X')
  })
})

describe('diff', () => {
  it('detects changed words', () => {
    const d = wordDiff('a b c', 'a x c')
    expect(d.map((x) => x.type)).toEqual(['same', 'changed', 'same'])
  })
})
