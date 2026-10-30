// src/db.ts — Dexie schema; user data encrypted at rest (passphrase-derived key)
import Dexie, { type Table } from 'dexie'

export interface EncryptedRecord {
  id?: number
  iv: string
  ct: string
  createdAt: number
}

export interface ProfileRecord extends EncryptedRecord {}
export interface DocumentRecord extends EncryptedRecord {}
export interface JobRecord extends EncryptedRecord {}
export interface ResumeVersionRecord extends EncryptedRecord {}
export interface SettingsRecord { key: string; value: string }

export class IdealDB extends Dexie {
  profile!: Table<ProfileRecord, number>
  documents!: Table<DocumentRecord, number>
  jobs!: Table<JobRecord, number>
  resumeVersions!: Table<ResumeVersionRecord, number>
  settings!: Table<SettingsRecord, string>

  constructor() {
    super('ideal-candidate')
    this.version(1).stores({
      profile: '++id, createdAt',
      documents: '++id, createdAt',
      jobs: '++id, createdAt',
      resumeVersions: '++id, createdAt',
      settings: 'key',
    })
  }
}

export const db = new IdealDB()
export const SETTINGS_SALT = 'kdf_salt'
