import { describe, it, expect } from 'vitest'
import { buildSystemPrompt } from './ai'
import { wordDiff } from './diff'

describe('ai', () => {
  it('buildSystemPrompt injects job text and honesty instructions', () => {
    const prompt = buildSystemPrompt('You are a resume editor.', 'honest', 'Job A')
    expect(prompt).toContain('Job description:\nJob A')
    expect(prompt).toContain('Stay strictly factual.')
  })
})

describe('diff', () => {
  it('flags changed words', () => {
    const d = wordDiff('hello world', 'hello earth')
    expect(d.map((x) => x.type)).toEqual(['same', 'changed'])
  })
})
