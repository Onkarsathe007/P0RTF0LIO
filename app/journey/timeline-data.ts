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
    title: 'Intern at ProAzure Solutions',
    description: '2-month internship',
    color: '#ffffff',
    side: 'left',
    detail:
      'A 2-month internship at ProAzure Solutions — real tickets, real deadlines, and the first taste of professional software work.',
  },
  {
    kind: 'milestone',
    date: '2021-07',
    title: 'Enrolled in Polytechnic',
    description: 'Career changing point',
    color: '#a855f7',
    side: 'right',
    halo: true,
    detail:
      'The starting point — enrolling in polytechnic, the first step toward a career in technology. No looking back.',
  },
  {
    kind: 'range',
    start: '2021-07',
    end: '2024-07',
    title: 'Diploma',
    org: 'Polytechnic',
    color: '#a855f7',
    side: 'left',
    detail:
      'Three years of polytechnic — engineering foundations, labs, and the discipline that everything above this line is built on.',
  },
  {
    kind: 'milestone',
    date: '2024-05',
    title: 'Graduated as College Topper',
    description: 'First rank, three consecutive years',
    color: '#fb9234',
    side: 'right',
    detail:
      'Graduated as the college topper — first rank in all three years of polytechnic. Consistency compounded.',
  },
  {
    kind: 'milestone',
    date: '2024-01',
    title: 'Avishkar Winner',
    description: 'State-level project competition',
    color: '#f5a623',
    side: 'right',
    detail:
      'Winner at Avishkar, the state-level project competition — up against the best student projects at the state level and coming out on top.',
  },
  {
    kind: 'range',
    start: '2023-09',
    end: '2023-11',
    title: 'Intern',
    org: 'ProAzure Solutions',
    color: '#22c55e',
    side: 'right',
    detail:
      'A 2-month internship at ProAzure Solutions during the diploma years — an early taste of professional software work while still in polytechnic.',
  },
  {
    kind: 'milestone',
    date: '2021-05',
    title: 'SSC',
    description: 'Finished school as second topper',
    color: '#fb9234',
    side: 'right',
    detail:
      'Passed SSC as the second topper of the school — the result that earned the polytechnic seat and kicked off everything above this dot.',
  },
]
