// src/docs.ts — document parsing (PDF/DOCX -> text)
import mammoth from 'mammoth'

export async function parseFile(file: File): Promise<string> {
  const type = file.type || file.name.split('.').pop()?.toLowerCase() || ''
  if (type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return parsePdf(file)
  }
  if (type.includes('word') || file.name.toLowerCase().endsWith('.docx')) {
    return parseDocx(file)
  }
  return file.text()
}

async function parsePdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`
  const buf = new Uint8Array(await file.arrayBuffer())
  const doc = await pdfjs.getDocument({ data: buf }).promise
  const pages: string[] = []
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    pages.push(content.items.map((it: any) => it.str).join(' '))
  }
  return pages.join('\n')
}

async function parseDocx(file: File): Promise<string> {
  const res = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return res.value
}
