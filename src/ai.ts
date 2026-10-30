// src/ai.ts — OpenAI-compatible chat client + resume tailoring prompt engine
export interface AISettings { endpoint: string; model: string; apiKey: string }

export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }

const HONESTY_INSTRUCTIONS: Record<string, string> = {
  honest: 'Stay strictly factual. Only reframe real experience with clearer wording. Never invent duties, metrics, or roles.',
  stretch: 'You may lightly embellish scope/impact with plausible language (e.g., "led" instead of "helped"). Do not invent unearned titles.',
  distort: 'You may significantly reframe experience toward the job description. Avoid outright false claims, but implied scope may expand.',
  anything: 'Tailor aggressively to match the job description. Prioritize getting past ATS and impressing the reader over strict factuality.',
}

export function buildSystemPrompt(base: string, honesty: string, jobText: string): string {
  return `${base}

Honesty level: ${honesty}
${HONESTY_INSTRUCTIONS[honesty] ?? HONESTY_INSTRUCTIONS.honest}

Job description:\n${jobText}
`
}

export async function chat(settings: AISettings, messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${settings.endpoint.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {}) },
    body: JSON.stringify({ model: settings.model, messages }),
  })
  if (!res.ok) throw new Error(`AI error ${res.status}`)
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}
