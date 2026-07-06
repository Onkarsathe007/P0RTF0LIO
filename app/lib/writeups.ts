// NO fs — Always import data!
import { writeups } from './writeups-data'

export type WriteupMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
}

export type Writeup = WriteupMeta & {
  content: string
}

function formatDisplayDate(value: string) {
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export async function getWriteups(): Promise<WriteupMeta[]> {
  return writeups.map((w) => ({ ...w, date: formatDisplayDate(w.date) }))
}

export async function getWriteupBySlug(slug: string): Promise<Writeup | null> {
  const w = writeups.find((x) => x.slug === slug)
  if (!w) return null
  return { ...w, date: formatDisplayDate(w.date) }
}
