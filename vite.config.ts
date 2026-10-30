import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ideal Candidate — Resume Tailoring',
        short_name: 'Ideal Candidate',
        description: 'Tailor your resume to each job listing with AI.',
        theme_color: '#1f2937',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'] },
    }),
  ],
})
