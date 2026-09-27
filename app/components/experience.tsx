'use client'

import { useState } from 'react'

type Bullet = string | { title: string; points: string[] }

type Position = {
  id: string
  title: string
  employmentType?: string
  extra?: string
  start: string
  end?: string
  description?: Bullet[]
  skills?: string[]
  expanded?: boolean
}

type Company = {
  id: string
  name: React.ReactNode
  website?: string
  logoUrl?: string
  location?: string
  locationType?: string
  current?: boolean
  positions: Position[]
}

const COMPANIES: Company[] = [
  {
    id: 'wolters-kluwer',
    name: 'Wolters Kluwer',
    website: 'https://www.wolterskluwer.com/',
    logoUrl: 'https://res.cloudinary.com/dn6xis9je/image/upload/v1790452580/WKL.AS_dg2oy6.svg',
    location: 'Pune, India',
    current: true,
    positions: [
      {
        id: 'sde-intern',
        title: 'SDE Intern',
        employmentType: 'Internship',
        start: '2026',
        description: [
          'Worked on spec-driven development.',
          'Worked on optimizing token usage and refining outputs.',
        ],
        skills: ['AI', 'SDD', '.NET', 'Azure DevOps'],
        expanded: true,
      },
    ],
  },
  {
    id: 'sitocrats',
    name: 'Sitocrats',
    location: 'Remote',
    positions: [
      {
        id: 'full-stack-dev',
        title: 'Full Stack Developer',
        start: '09.2025',
        end: '11.2025',
        description: [
          'Worked on DevOps initiatives across the stack.',
          'Optimized Dockerfiles for leaner, faster builds.',
          'Wrote YAML pipelines for continuous integration.',
        ],
        skills: ['AWS ECS', 'AWS EKS', 'GitHub', 'Node.js', 'Kubernetes'],
        expanded: true,
      },
    ],
  },
]

function monthsBetween(start: string, end?: string): string {
  const norm = (s: string) => s.replace('-', '.')
  const toDate = (s: string, last: boolean) => {
    const n = norm(s)
    if (n.includes('.')) {
      const [m, y] = n.split('.').map(Number)
      return new Date(y, last ? m : m - 1, 1)
    }
    return new Date(Number(n), last ? 11 : 0, 1)
  }
  const startDate = toDate(start, false)
  const endDate = end ? toDate(end, true) : new Date()
  if (!end && !norm(start).includes('.')) {
    const startYear = new Date(Number(norm(start)), 0, 1)
    const total = (endDate.getFullYear() - startYear.getFullYear()) * 12 + (endDate.getMonth() - 0) + 1
    if (total <= 0) return ''
    return total < 12 ? `${total}m` : `${Math.floor(total / 12)}y${total % 12 ? ` ${total % 12}m` : ''}`
  }
  const total =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1
  if (total <= 0) return ''
  if (total < 12) return `${total}m`
  const y = Math.floor(total / 12)
  const m = total % 12
  return m === 0 ? `${y}y` : `${y}y ${m}m`
}

function ChevronGlyph({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`exp-chevron${open ? ' exp-chevron-open' : ''}`}
    >
      <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
    </svg>
  )
}

function PositionItem({ position }: { position: Position }) {
  const [open, setOpen] = useState(position.expanded ?? false)
  const duration = monthsBetween(position.start, position.end)
  const ongoing = !position.end

  return (
    <div className="exp-position">
      <button
        type="button"
        className="exp-trigger"
        onClick={() => position.description && setOpen((v) => !v)}
        aria-expanded={position.description ? open : undefined}
        disabled={!position.description}
      >
        <span className="exp-pos-head">
          <span className="exp-pos-title">{position.title}</span>
          {position.description && <ChevronGlyph open={open} />}
        </span>
        <span className="exp-meta">
          {position.employmentType && <span>{position.employmentType}</span>}
          {position.employmentType && <span className="exp-sep" aria-hidden />}
          <span className="exp-period">
            <span>{position.start}</span>
            <span className="exp-dash">—</span>
            {ongoing ? <span className="exp-infinity" aria-label="Present">∞</span> : <span>{position.end}</span>}
          </span>
          {duration && (
            <>
              <span className="exp-sep" aria-hidden />
              <span>{duration}</span>
            </>
          )}
          {position.extra && (
            <>
              <span className="exp-sep" aria-hidden />
              <span>{position.extra}</span>
            </>
          )}
        </span>
      </button>
      {position.description && open && (
        <ul className="exp-desc">
          {position.description.map((line) =>
            typeof line === 'string' ? (
              <li key={line}>{line}</li>
            ) : (
              <li key={line.title}>
                {line.title}
                <ul className="exp-sub">
                  {line.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            )
          )}
        </ul>
      )}
      {position.skills && position.skills.length > 0 && (
        <ul className="exp-skills">
          {position.skills.map((skill) => (
            <li key={skill} className="agent-meta-item">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const EDUCATION: Company[] = [
  {
    id: 'viit',
    name: (
      <>
        VI<sup>2</sup>I
      </>
    ),
    website: 'https://viit.ac.in/',
    logoUrl: 'https://res.cloudinary.com/dn6xis9je/image/upload/v1790486617/idc4pOzohP_logos_1_sj3rnt.jpg',
    current: true,
    positions: [
      {
        id: 'btech',
        title: 'B.Tech Student',
        employmentType: 'B.Tech',
        extra: 'AIDS',
        start: '6-2024',
        description: [
          {
            title: 'Won several Hackathons, including:',
            points: [
              'Infineon VIT internal hackathon — First prize',
              'MIT Kurukshetra national level hackathon — First prize',
              'Utopia state level hackathon — First prize',
              'Samarthya SKN COE — Runner-up',
            ],
          },
        ],
        skills: ['Machine Learning', 'Deep Learning', 'NLP', 'Cloud and DevOps'],
        expanded: true,
      },
    ],
  },
  {
    id: 'njpit',
    name: 'NJPIT Ahilyanagar',
    logoUrl: 'https://res.cloudinary.com/dn6xis9je/image/upload/v1790486723/paulbudhe_si3362.jpg',
    current: false,
    positions: [
      {
        id: 'diploma',
        title: 'Diploma Student',
        employmentType: 'Diploma in Polytechnic',
        extra: 'CS',
        start: '2021',
        end: '2024',
        description: [
          'College topper for 3 years consecutively.',
          'Won Avishkar state level project competition.',
          'Actively participated in multiple sports events.',
          'Served as class representative.',
        ],
        skills: ['Operating Systems', 'Computer Networks', 'DBMS', 'PHP', 'Java'],
        expanded: false,
      },
    ],
  },
  {
    id: 'scvn',
    name: 'SCVN Narayandoho',
    logoUrl: 'https://res.cloudinary.com/dn6xis9je/image/upload/v1790486957/ajmvps-Sanstha-Logo-295x300_r99d62.jpg',
    current: false,
    positions: [
      {
        id: 'ssc',
        title: 'Secondary School Student',
        employmentType: 'Secondary Education',
        extra: 'SSC',
        start: '2020',
        end: '2021',
        description: [
          'School second topper.',
          'Participated in several sports events.',
        ],
        expanded: false,
      },
    ],
  },
]

export function Experience({
  id = 'experience',
  label = 'experience',
  companies = COMPANIES,
}: {
  id?: string
  label?: string
  companies?: Company[]
} = {}) {
  return (
    <section className="panel" aria-label={label} id={id}>
      <header className="panel-header">
        <span className="panel-label">{label}</span>
      </header>
      <div className="panel-body">
        {companies.map((company) => (
          <div key={company.id} id={`${id}-${company.id}`} className="exp-company">
            <div className="exp-company-head">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  width={24}
                  height={24}
                  className="exp-logo"
                  aria-hidden
                />
              ) : (
                <span className="exp-dot" aria-hidden />
              )}
              <h3 className="exp-company-name">
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="exp-company-link">
                    {company.name}
                  </a>
                ) : (
                  company.name
                )}
              </h3>
              {company.location && (
                <span className="exp-location">
                  {company.location}
                  {company.locationType && ` (${company.locationType})`}
                </span>
              )}
              {company.current && (
                <span className="exp-pulse" aria-label="Current employer">
                  <span className="exp-pulse-ring" aria-hidden />
                  <span className="exp-pulse-dot" aria-hidden />
                </span>
              )}
            </div>
            <div className="exp-rail">
              {company.positions.map((position) => (
                <PositionItem key={position.id} position={position} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
