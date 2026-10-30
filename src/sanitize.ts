// src/sanitize.ts — basic untrusted-input sanitizer for job listings/prompts
export function sanitizeText(text: string): string {
  return text
    .replace(/\{\{.*?\}\}/g, '') // template injections
    .replace(/<script.*?>.*?<\/script>/gi, '') // script tags
    .replace(/on\w+=".*?"/gi, '') // inline handlers
    .replace(/javascript:/gi, '')
    .trim()
}
