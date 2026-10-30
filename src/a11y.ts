// src/a11y.ts — accessibility helpers
export function skipToMain(): void {
  const el = document.querySelector('main')
  if (el) el.focus()
}
