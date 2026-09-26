import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'
import { Projects } from '../components/projects'

export const metadata = {
  title: 'Projects - Onkar Sathe',
  description: 'A collection of software projects built by Onkar Sathe.',
}

export default function ProjectsPage() {
  return (
    <main className="split-shell">
      <div className="split-container">
        <aside className="split-sidebar">
          <header className="home-nav" aria-label="Primary">
            <div className="home-nav-links">
              <Link href="/" className="home-nav-link">
                start
              </Link>
              <Link href="/agents" className="home-nav-link home-nav-link-active">
                projects
              </Link>
              <Link href="/writeups" className="home-nav-link">
                blogs
              </Link>
              <Link href="/contact" className="home-nav-link">
                contact
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <img
              src="https://res.cloudinary.com/dn6xis9je/image/upload/v1780646159/onkar_v40zai.jpg"
              alt="Onkar Sathe"
              className="home-profile-img"
            />
            <h1 className="home-title">Projects</h1>
            <p className="home-lead">I build things, break them, and watch them come alive - this process is what I love..</p>

          </div>
        </aside>

        <section className="split-main">
          <Projects />
        </section>
      </div>
    </main>
  )
}
