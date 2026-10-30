import { useEffect, useState } from 'react'
import { db, SETTINGS_SALT } from './db'
import { Onboarding } from './Onboarding'

export default function App() {
  const [ready, setReady] = useState(false)
  const [onboarded, setOnboarded] = useState(false)

  useEffect(() => {
    (async () => {
      const salt = await db.settings.get(SETTINGS_SALT)
      setOnboarded(!!salt)
      setReady(true)
    })()
  }, [])

  if (!ready) return <p>Loading…</p>
  if (!onboarded) return <Onboarding onReady={() => setOnboarded(true)} />
  return (
    <main style={{ padding: '1rem' }}>
      <h1>Ideal Candidate</h1>
      <p>[profile + resume tailor coming next]</p>
    </main>
  )
}
