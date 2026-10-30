// src/Onboarding.tsx — passphrase + honesty level selection
import { useState } from 'react'
import { newSalt, deriveKey, toBase64 } from './crypto'
import { db, SETTINGS_SALT } from './db'
import { HONESTY_LEVELS, DISCLAIMER, type HonestyLevel } from './honesty'

interface Props { onReady: (key: CryptoKey, honesty: HonestyLevel) => void }

export function Onboarding({ onReady }: Props) {
  const [pass, setPass] = useState('')
  const [confirm, setConfirm] = useState('')
  const [honesty, setHonesty] = useState<HonestyLevel>('honest')
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (pass.length < 12) { setError('Passphrase must be at least 12 characters.'); return }
    if (pass !== confirm) { setError('Passphrases do not match.'); return }
    if (honesty !== 'honest' && !accepted) { setError('Accept the disclaimer to continue.'); return }
    try {
      const salt = await newSalt()
      const key = await deriveKey(pass, salt)
      await db.settings.put({ key: SETTINGS_SALT, value: toBase64(salt) })
      onReady(key, honesty)
    } catch {
      setError('Failed to initialize secure storage.')
    }
  }

  const isNonDefault = honesty !== 'honest'
  return (
    <section style={{ padding: '1rem', maxWidth: 520, margin: '0 auto' }}>
      <h1>Ideal Candidate</h1>
      <p>Create a passphrase to encrypt your data on this device. Forgetting it cannot be undone.</p>
      <form onSubmit={submit}>
        <label>Passphrase (min 12 chars)<br />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" />
        </label>
        <br />
        <label>Confirm<br />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </label>
        <br />
        <label>Honesty level<br />
          <select value={honesty} onChange={(e) => setHonesty(e.target.value as HonestyLevel)}>
            {(Object.keys(HONESTY_LEVELS) as HonestyLevel[]).map((h) => (
              <option key={h} value={h}>{HONESTY_LEVELS[h].name}</option>
            ))}
          </select>
        </label>
        {isNonDefault && (
          <>
            <p style={{ color: 'crimson', fontSize: '0.9rem' }}>{DISCLAIMER}</p>
            <label>
              <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /> I accept the disclaimer
            </label>
          </>
        )}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <button type="submit">Create</button>
      </form>
    </section>
  )
}
