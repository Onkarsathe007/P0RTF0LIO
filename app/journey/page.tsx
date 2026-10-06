import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'
import { JourneyTimeline } from '../components/journey-timeline'

export const metadata = {
  title: 'Journey - Onkar Sathe',
  description: "Where I've been — a timeline of work, wins, and turning points.",
}

export const viewport = {
  themeColor: '#09090b',
}

export default function JourneyPage() {
  return (
    <main className="journey-page">
      <div className="journey-wrap">
        <header className="home-nav journey-topbar" aria-label="Primary">
          <div className="home-nav-links">
            <Link href="/" className="home-nav-link">
              start
            </Link>
            <Link href="/agents" className="home-nav-link">
              projects
            </Link>
            <Link href="/writeups" className="home-nav-link">
              blogs
            </Link>
            <Link href="/journey" className="home-nav-link home-nav-link-active">
              journey
            </Link>
          </div>
          <ThemeToggle />
        </header>

        <div className="journey-scope">
          <JourneyTimeline />
        </div>
      </div>
    </main>
  )
}
