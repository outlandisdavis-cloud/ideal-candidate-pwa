// src/Tailor.tsx — job input + resume tailoring + diff view
import { useState } from 'react'
import { type AISettings, type ChatMessage, buildSystemPrompt, chat } from './ai'
import { wordDiff } from './diff'

const DEFAULT_SETTINGS: AISettings = { endpoint: 'http://localhost:11434/v1', model: 'llama3.1', apiKey: '' }

export function Tailor() {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS)
  const [jobText, setJobText] = useState('')
  const [resume, setResume] = useState('')
  const [tailored, setTailored] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function tailor() {
    setBusy(true); setError('')
    try {
      const system = buildSystemPrompt('You are a resume editor.', 'honest', jobText)
      const messages: ChatMessage[] = [
        { role: 'system', content: system },
        { role: 'user', content: `Tailor this resume to the job. Output the full tailored resume only.\n\nResume:\n${resume}` },
      ]
      const out = await chat(settings, messages)
      setTailored(out)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI error')
    } finally { setBusy(false) }
  }

  const diff = wordDiff(resume, tailored)

  return (
    <section style={{ padding: '1rem', maxWidth: 960, margin: '0 auto' }}>
      <h2>AI Settings</h2>
      <label>Endpoint<br />
        <input value={settings.endpoint} onChange={(e) => setSettings({ ...settings, endpoint: e.target.value })} />
      </label>
      <label>Model<br />
        <input value={settings.model} onChange={(e) => setSettings({ ...settings, model: e.target.value })} />
      </label>
      <label>API key (optional for Ollama)<br />
        <input type="password" value={settings.apiKey} onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })} />
      </label>

      <h2>Job</h2>
      <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} placeholder="Paste job description" style={{ width: '100%', minHeight: 120 }} />

      <h2>Resume</h2>
      <textarea value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Paste your resume" style={{ width: '100%', minHeight: 200 }} />

      <button onClick={tailor} disabled={busy}>{busy ? 'Tailoring…' : 'Tailor Resume'}</button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {tailored && (
        <>
          <h2>Diff</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '1rem' }}>
            {diff.map((d, i) => (
              <span key={i} style={{ color: d.type === 'changed' ? 'crimson' : 'inherit' }}>{d.type === 'changed' ? `[${d.b}]` : d.a}{' '}</span>
            ))}
          </pre>
          <h2>Tailored</h2>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '1rem' }}>{tailored}</pre>
        </>
      )}
    </section>
  )
}
