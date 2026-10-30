import { describe, it, expect } from 'vitest'
import { sanitizeText } from './sanitize'

describe('sanitize', () => {
  it('removes script tags and template injections', () => {
    const input = '<script>alert(1)</script> {{inject}} normal text'
    expect(sanitizeText(input)).toBe('normal text')
  })
})
