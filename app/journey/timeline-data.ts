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
      image?: string
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
      image?: string
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
    image: 'https://res.cloudinary.com/dn6xis9je/image/upload/v1780645707/cld-sample-2.jpg',
    detail:
      'A quiet productivity app — waitlist first, noise never. Designed calm, built to respect attention, shipped solo end to end.',
  },
  {
    kind: 'range',
    start: '2026-01',
    end: '2026-07',
    title: 'Founding Engineer',
    org: 'HaloSafe',
    color: '#14b8a6',
    side: 'left',
    detail:
      'Founding engineer — zero-to-one ownership across product and infrastructure, shipping fast with a tiny team where every commit counts.',
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
    detail:
      'Freelance design and development for Karavali Mangalore Store — storefront experience, branding details, and a web presence that feels local.',
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
    detail:
      'An open-source utility toolkit — small, sharp tools that each do one thing well. Built in the open, free for everyone.',
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
    detail:
      'R&D intern at the Indian Council of Medical Research — where research rigour met real-world engineering and every result mattered.',
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
    detail:
      'First hackathon win — 1st place at the IndiaAI Hackathon. Proof that pressure, caffeine, and a good team produce gold.',
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
    detail:
      'Cloud architect — designing and deploying workloads on AWS, learning how the internet actually stays up, on-site in Kolkata.',
  },
  {
    kind: 'milestone',
    date: '2024-09',
    title: 'Joined Athena FOSS',
    description: 'Where everything changed.',
    link: { label: 'AthenaFOSS', href: 'https://github.com/AthenaFOSS' },
    color: '#8b5cf6',
    side: 'left',
    detail:
      'Where everything changed — the open-source community that turned curiosity into craft and strangers into collaborators.',
  },
  {
    kind: 'milestone',
    date: '2023-08',
    title: 'Switched to CS',
    description: 'Career changing point',
    color: '#ef4444',
    side: 'right',
    halo: true,
    detail:
      'The career-changing point — leaving the old path for computer science. The scariest and best decision on this whole timeline.',
  },
]
