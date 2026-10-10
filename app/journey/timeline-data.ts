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
      end: string // "YYYY-MM" or "present"
      title: string
      org: string
      meta?: string
      color: string
      side: Side
      lane?: number
      textAt?: 'mid' | 'end'
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
    kind: 'range',
    start: '2024-09',
    end: '2027-09',
    title: 'B.Tech',
    org: 'VIIT Pune',
    meta: 'AI and Data Science · Pune, India',
    color: '#f59e0b',
    side: 'left',
    detail:
      'Pursuing a B.Tech in AI and Data Science at VIIT Pune, Pune, India — where the diploma foundations meet degree-level depth.',
  },
  {
    kind: 'range',
    start: '2026-07',
    end: 'present',
    title: 'SDE Intern',
    org: 'Wolters Kluwer',
    color: '#0078C0',
    side: 'right',
    textAt: 'end',
    detail:
      'SDE Intern at Wolters Kluwer — building production software alongside experienced engineers.',
  },
  {
    kind: 'milestone',
    date: '2026-09',
    title: 'Kurukshetra Hackathon',
    description: 'Winner · MIT Pune',
    color: '#6366f1',
    side: 'right',
    detail:
      'Winner at Kurukshetra, the international hackathon at MIT Pune — first place on an international stage.',
  },
  {
    kind: 'range',
    start: '2025-10',
    end: '2025-12',
    title: 'Full Stack Developer',
    org: 'Sitocrats Pvt Ltd',
    color: '#a3e635',
    side: 'right',
    textAt: 'end',
    detail:
      'Full Stack Developer intern at Sitocrats Pvt Ltd — shipping features across frontend and backend.',
  },
  {
    kind: 'milestone',
    date: '2025-09',
    title: 'Infineon VIT Internal Hackathon',
    description: 'Winner',
    color: '#ec4899',
    side: 'right',
    detail:
      'Winner of the Infineon VIT Internal Hackathon — first place against strong competition from across the campus.',
  },
  {
    kind: 'milestone',
    date: '2026-08',
    title: 'Samarthya Hackathon',
    description: 'Runner-up · SKN COE, Pune',
    color: '#14b8a6',
    side: 'right',
    detail:
      'Runner-up at Samarthya, a state-level project competition at SKN COE Pune — missing the top spot by a whisker against the best projects in the state.',
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
    date: '2025-05',
    title: 'Inceptia Hackathon',
    description: 'Winner · VPCOE, Ahilyanagar',
    color: '#3aa7e0',
    side: 'right',
    detail:
      'Winner at Inceptia, a state-level hackathon hosted at VPCOE Ahilyanagar — first place against the best teams in the state.',
  },
  {
    kind: 'range',
    start: '2025-01',
    end: '2025-03',
    title: 'Backend Developer',
    org: 'Lienzo',
    meta: 'E-commerce startup',
    color: '#ef4444',
    side: 'right',
    detail:
      'Backend developer at Lienzo, an e-commerce platform startup — shipping backend features with a small team where everyone wore many hats.',
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
    title: 'Trainee',
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
