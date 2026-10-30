// src/JobTracker.tsx — job list + status + saved tailored resumes
import { useState, useEffect } from 'react'
import { db } from './db'
import type { JobRecord, ResumeVersionRecord } from './db'

export function JobTracker() {
  const [jobs, setJobs] = useState<JobRecord[]>([])
  const [resumes, setResumes] = useState<Record<number, ResumeVersionRecord[]>>({})

  async function load() {
    const all = await db.jobs.orderBy('createdAt').reverse().toArray()
    setJobs(all)
    const map: Record<number, ResumeVersionRecord[]> = {}
    await Promise.all(all.map(async (j) => {
      map[j.id!] = await db.resumeVersions.where('jobId').equals(j.id!).reverse().toArray()
    }))
    setResumes(map)
  }

  useEffect(() => { load() }, [])

  async function addJob() {
    const title = prompt('Job title?')
    if (!title) return
    const url = prompt('Job URL?') || undefined
    await db.jobs.add({ title, url, status: 'saved', createdAt: Date.now(), iv: '', ct: '' })
    await load()
  }

  async function setStatus(id: number, status: JobRecord['status']) {
    await db.jobs.update(id, { status })
    await load()
  }

  async function saveVersion(jobId: number, text: string) {
    await db.resumeVersions.add({ jobId, tailoredText: text, createdAt: Date.now(), iv: '', ct: '' })
    await load()
  }

  async function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section style={{ padding: '1rem', maxWidth: 960, margin: '0 auto' }}>
      <h2>Jobs</h2>
      <button onClick={addJob}>Add job</button>
      <ul>
        {jobs.map((j) => (
          <li key={j.id}>
            <strong>{j.title}</strong> — {j.status} {j.url && <a href={j.url} target="_blank">link</a>}
            <select value={j.status} onChange={(e) => setStatus(j.id!, e.target.value as JobRecord['status'])}>
              {(['saved', 'applied', 'interview', 'offer', 'rejected'] as JobRecord['status'][]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={() => {
              const text = prompt('Paste tailored resume to save for this job')
              if (text) saveVersion(j.id!, text)
            }}>Save tailored resume</button>
            {resumes[j.id!]?.length ? (
              <ul>
                {resumes[j.id!].map((r, i) => (
                  <li key={i}>
                    <button onClick={() => downloadText(r.tailoredText, `${j.title}-v${i+1}.txt`)}>Download v{i+1}</button>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
