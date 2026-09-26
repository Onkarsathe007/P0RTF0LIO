'use client'

import { useState } from 'react'

type Position = {
  id: string
  title: string
  employmentType?: string
  start: string
  end?: string
  description?: string[]
  skills?: string[]
  expanded?: boolean
}

type Company = {
  id: string
  name: string
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
    id: 'lorem-two',
    name: 'Dolor Sit LLC',
    website: 'https://example.com/',
    location: 'Ipsum Town, Loremland',
    locationType: 'On-site',
    positions: [
      {
        id: 'lorem-position-2',
        title: 'Ipsum Developer',
        employmentType: 'Part-time',
        start: '03.2024',
        end: '12.2025',
        description: [
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
          'Duis aute irure dolor in reprehenderit in voluptate velit.',
        ],
        skills: ['Consectetur', 'Adipiscing', 'Elit', 'Eiusmod'],
        expanded: true,
      },
    ],
  },
  {
    id: 'lorem-three',
    name: 'Amet Labs',
    website: 'https://example.com/',
    location: 'Dolor City, Ipsumland',
    locationType: 'Hybrid',
    positions: [
      {
        id: 'lorem-position-3',
        title: 'Sit Amet Intern',
        employmentType: 'Internship',
        start: '06.2023',
        end: '02.2024',
        description: [
          'Excepteur sint occaecat cupidatat non proident.',
          'Sunt in culpa qui officia deserunt mollit anim id est laborum.',
        ],
        skills: ['Tempor', 'Incididunt', 'Labore'],
        expanded: false,
      },
    ],
  },
]

function monthsBetween(start: string, end?: string): string {
  const toDate = (s: string, last: boolean) => {
    if (s.includes('.')) {
      const [m, y] = s.split('.').map(Number)
      return new Date(y, last ? m : m - 1, 1)
    }
    return new Date(Number(s), last ? 11 : 0, 1)
  }
  const startDate = toDate(start, false)
  const endDate = end ? toDate(end, true) : new Date()
  if (!end && !start.includes('.')) {
    const startYear = new Date(Number(start), 0, 1)
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
        </span>
      </button>
      {position.description && open && (
        <ul className="exp-desc">
          {position.description.map((line) => (
            <li key={line}>{line}</li>
          ))}
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
              {company.location && company.locationType && (
                <span className="exp-location">
                  {company.location} ({company.locationType})
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
