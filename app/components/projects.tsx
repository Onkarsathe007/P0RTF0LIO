'use client'

import { useState } from 'react'

type Project = {
  id: string
  title: string
  period?: { start: string; end?: string }
  link: string
  description: string
  points: string[]
  expanded?: boolean
}

const PROJECTS: Project[] = [
  {
    id: 'fastshop',
    title: 'Fastshop',
    link: 'https://github.com/Onkarsathe007/Fastshop',
    description: 'An e-commerce oriented project focused on end-to-end product flows, clean UX, and practical implementation.',
    points: [
      'Product-style architecture',
      'Backend + frontend flow ownership',
      'Hands-on full-stack execution',
    ],
    expanded: true,
  },
  {
    id: 'dotfiles',
    title: '.dotfiles',
    link: 'https://github.com/Onkarsathe007/dotfiles',
    description: 'My personal environment setup to keep development fast, reproducible, and consistent across machines.',
    points: [
      'Productivity-first setup',
      'Reusable terminal/editor defaults',
      'Workflow consistency',
    ],
  },
  {
    id: 'communiai',
    title: 'CommuniAI',
    link: 'https://github.com/Onkarsathe007/CommuniAI',
    description: 'An AI-focused project exploring communication workflows, automation, and practical assistant-driven tooling.',
    points: [
      'AI-first product thinking',
      'Applied experimentation',
      'Practical automation mindset',
    ],
  },
]

function BoxGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="proj-tile-glyph">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  )
}

function LinkGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="proj-link-glyph">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function ChevronsGlyph({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`proj-chev${open ? ' proj-chev-open' : ''}`}
    >
      <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
    </svg>
  )
}

function ProjectItem({ project }: { project: Project }) {
  const [open, setOpen] = useState(project.expanded ?? false)
  const end = project.period?.end
  const ongoing = project.period && !end

  return (
    <div className="proj-item">
      <div className="proj-row">
        <span className="proj-tile" aria-hidden>
          <BoxGlyph />
        </span>
        <div className="proj-main">
          <div className="proj-title-row">
            <h3 className="proj-title">
              <button
                type="button"
                className="proj-trigger"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
              >
                {project.title}
              </button>
            </h3>
            {project.period && (
              <p className="proj-period">
                <span>{project.period.start}</span>
                {end !== project.period.start && (
                  <>
                    <span className="exp-dash">—</span>
                    {ongoing ? <span aria-label="Present">∞</span> : <span>{end}</span>}
                  </>
                )}
              </p>
            )}
          </div>
          <div className="proj-actions">
            <a
              className="proj-link"
              href={project.link}
              target="_blank"
              rel="noopener"
              aria-label={`Open ${project.title}`}
              title="Open project"
            >
              <LinkGlyph />
            </a>
            <span className="proj-chev-wrap" aria-hidden>
              <ChevronsGlyph open={open} />
            </span>
          </div>
        </div>
      </div>
      {open && (
        <div className="proj-detail">
          <p className="home-paragraph">{project.description}</p>
          <ul className="exp-desc">
            {project.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function Projects() {
  return (
    <section className="panel" aria-label="Projects" id="projects">
      <header className="panel-header">
        <span className="panel-label">
          projects <sup className="panel-sup">({PROJECTS.length})</sup>
        </span>
      </header>
      <div>
        {PROJECTS.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
