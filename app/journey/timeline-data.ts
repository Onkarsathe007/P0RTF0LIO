export type Side = 'left' | 'right'

export type TimelineItem =
  | {
      kind: 'milestone'
      date: string // "YYYY-MM"
      title: string
      description: string
      color: string
      side?: Side
      halo?: boolean
      link?: { label: string; href: string }
      detail?: string
    }
  | {
      kind: 'range'
      start: string // "YYYY-MM"
      end: string // "YYYY-MM"
      title: string
      org: string
      meta?: string
      color: string
      side: Side
      link?: { label: string; href: string }
      detail?: string
    }

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "2026-08" -> absolute month index (year * 12 + month0). */
export function monthIndex(date: string): number {
  const [y, m] = date.split('-').map(Number)
  return y * 12 + (m - 1)
}

/** absolute month index -> "Aug 2026". */
export function formatMonthIdx(idx: number): string {
  const year = Math.floor(idx / 12)
  const month = ((idx % 12) + 12) % 12
  return `${MONTH_NAMES[month]} ${year}`
}

export const TIMELINE_ITEMS: TimelineItem[] = [
  {
    kind: 'milestone',
    date: '2026-08',
    title: 'Focus waitlist & launch',
    description: 'Quiet productivity app',
    link: { label: 'getfocus.fun', href: 'https://getfocus.fun' },
    color: '#3aa7e0',
    side: 'right',
  },
  {
    kind: 'range',
    start: '2026-01',
    end: '2026-07',
    title: 'Founding Engineer',
    org: 'HaloSafe',
    color: '#14b8a6',
    side: 'left',
  },
  {
    kind: 'range',
    start: '2026-03',
    end: '2026-05',
    title: 'design & development',
    org: 'Karavali Mangalore Store',
    meta: 'Freelance',
    color: '#f97316',
    side: 'right',
    link: { label: 'karavalimangalorestore.com', href: 'https://karavalimangalorestore.com' },
  },
  {
    kind: 'milestone',
    date: '2026-01',
    title: 'Launched astraa.tech',
    description: 'Open-source utility toolkit',
    link: { label: 'astraa.tech', href: 'https://astraa.tech' },
    color: '#ec4899',
    side: 'right',
    halo: true,
  },
  {
    kind: 'range',
    start: '2025-06',
    end: '2025-12',
    title: 'Research And Development Intern',
    org: 'Indian Council of Medical Research (ICMR)',
    meta: 'Barasat · Hybrid',
    color: '#10b981',
    side: 'left',
  },
  {
    kind: 'milestone',
    date: '2025-10',
    title: '1st Place, IndiaAI Hackathon',
    description: 'First hackathon win',
    link: { label: 'results', href: 'https://indiaai.gov.in' },
    color: '#f5a623',
    side: 'right',
    halo: true,
  },
  {
    kind: 'range',
    start: '2025-05',
    end: '2025-09',
    title: 'Software Engineer Intern',
    org: 'FarAlpha Technologies',
    meta: 'Kolkata · Remote',
    color: '#6366f1',
    side: 'right',
    detail:
      'Worked on file upload optimization and video processing with AWS Step Functions, built RAG systems with LangChain and Redis caching, and set up monitoring with Sentry, CloudWatch, and RUM.',
  },
  {
    kind: 'range',
    start: '2024-11',
    end: '2025-02',
    title: 'Cloud Architect',
    org: 'WebGuru Infosystems Pvt. Ltd.',
    meta: 'Kolkata · On-site',
    color: '#f59e0b',
    side: 'left',
  },
  {
    kind: 'milestone',
    date: '2024-09',
    title: 'Joined Athena FOSS',
    description: 'Where everything changed.',
    link: { label: 'AthenaFOSS', href: 'https://github.com/AthenaFOSS' },
    color: '#8b5cf6',
    side: 'left',
  },
  {
    kind: 'milestone',
    date: '2023-08',
    title: 'Switched to CS',
    description: 'Career changing point',
    color: '#ef4444',
    side: 'right',
    halo: true,
  },
]
