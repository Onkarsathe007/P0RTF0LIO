import Link from 'next/link'
import { ThemeToggle } from './components/theme-toggle'
import { HoverChip } from './components/hover-chip'

const highlights = [
  {
    label: 'Current',
    content: (
      <>
        Software Engineer at{' '}
        <a href="https://www.loopr.ai" target="_blank" rel="noopener noreferrer" className="inline-link">
          Loopr.ai
        </a>
      </>
    ),
  },
  {
    label: 'Focus',
    content: 'AI systems that make my everyday work easier and faster.',
  },
  {
    label: 'Build',
    content: (
      <>
        <HoverChip text="re-usable qa testing agent for browser-based apps">
          <a
            href="https://github.com/kedarvartak/easy-sanity"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Easy Sanity
          </a>
        </HoverChip>
        ,{' '}
        <HoverChip text="connect your ide to browser via cdp — eyes for your llms">
          <a
            href="https://github.com/kedarvartak/agent-vision"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Agent Vision
          </a>
        </HoverChip>
        ,{' '}
        <HoverChip text="shared repo-memory to sync context across all your coding agents">
          <a
            href="https://github.com/kedarvartak/multi-agent-memo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-link"
          >
            Multi Agent Memo
          </a>
        </HoverChip>
        .
      </>
    ),
  },
  {
    label: 'Background',
    content: (
      <>
        AI Engineering,{' '}
        <a href="https://www.vit.edu/" target="_blank" rel="noopener noreferrer" className="inline-link">
          VIT Pune
        </a>
        .
      </>
    ),
  },
  {
    label: 'Philosophy',
    content: 'Aura FARM',
  },
]

export default function Home() {
  return (
    <main className="split-shell">
      <div className="split-container">
        <aside className="split-sidebar">
          <header className="home-nav" aria-label="Primary">
            <div className="home-nav-links">
              <Link href="/" className="home-nav-link home-nav-link-active">
                start
              </Link>
              <Link href="/agents" className="home-nav-link">
                agents
              </Link>
              <Link href="/writeups" className="home-nav-link">
                writeups
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <img src="/img.jpeg" alt="Kedar Vartak" className="home-profile-img" />
            <h1 className="home-title">Kedar Vartak</h1>
            <p className="home-lead">
              I build software with a bias toward practical systems, clean execution, and tools that compound over time.
            </p>
          </div>
        </aside>

        <section className="split-main">
          <div className="home-intro">
            <p className="home-paragraph">
              I work at{' '}
              <a href="https://www.loopr.ai" target="_blank" rel="noopener noreferrer" className="inline-link">
                Loopr.ai
              </a>{' '}
              as a software engineer, tackling complex engineering problems and keeping up with emergent technologies. My
              short term goal is to add a new skill to my{' '}
              <a href="https://github.com/kedarvartak" target="_blank" rel="noopener noreferrer" className="inline-link">
                brain.md
              </a>{' '}
              every single week, while building a side‑hustle, money‑making machine by the end of this year.
            </p>
            <p className="home-paragraph">
              I care the most about AI infrastructure, memory and tooling. I prefer to call myself a generalist and not
              specialist. I bench 210lbs, workout 365 days a year.
            </p>
          </div>

          <div className="home-section">
            <h2 className="home-section-title">Highlights</h2>
            <ul className="home-highlights-list">
              {highlights.map((item) => (
                <li key={item.label} className="home-highlight-item">
                  <span className="home-highlight-label">{item.label}</span>
                  <div className="home-highlight-content">{item.content}</div>
                </li>
              ))}
            </ul>
          </div>

          <footer className="home-footer">
            <div className="home-footer-links">
              <a href="mailto:kedarvartak01@gmail.com" className="inline-link">
                email
              </a>
              <a href="https://github.com/kedarvartak" target="_blank" rel="noopener noreferrer" className="inline-link">
                github
              </a>
              <a href="https://linkedin.com/in/kedar-vartak20" target="_blank" rel="noopener noreferrer" className="inline-link">
                linkedin
              </a>
              <a href="https://twitter.com/kedar2sexy" target="_blank" rel="noopener noreferrer" className="inline-link">
                twitter
              </a>
            </div>
          </footer>
        </section>
      </div>
    </main>
  )
}
