import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'
import { ContactPanel } from '../components/contact-panel'

export const metadata = {
  title: 'Contact - Onkar Sathe',
  description: 'Get in touch with Onkar Sathe.',
}

export default function ContactPage() {
  return (
    <main className="split-shell">
      <div className="split-container">
        <aside className="split-sidebar">
          <header className="home-nav" aria-label="Primary">
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
              <Link href="/contact" className="home-nav-link home-nav-link-active">
                contact
              </Link>
              <Link href="/journey" className="home-nav-link">
                journey
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <h1 className="home-title">Contact</h1>
            <p className="home-lead">The fastest way to reach me is email — I usually reply within a day.</p>
          </div>
        </aside>

        <section className="split-main">
          <ContactPanel />
        </section>
      </div>
    </main>
  )
}
