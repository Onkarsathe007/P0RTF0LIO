import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'
import { getWriteups } from '../lib/writeups'

export const metadata = {
  title: 'Blogs - Onkar Sathe',
  description: 'Articles on software engineering, learning, and building practical products.',
}

export default async function WriteupsPage() {
  const writeups = await getWriteups()

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
              <Link href="/writeups" className="home-nav-link home-nav-link-active">
                blogs
              </Link>
              <Link href="/shitposts" className="home-nav-link">
                notes
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <h1 className="home-title">Blogs</h1>
            <p className="home-lead">Notes on engineering, systems thinking, and lessons from building in public.</p>
          </div>
        </aside>

        <section className="split-main">
          <div className="writeups-list">
            {writeups.map((item) => (
              <article key={item.slug} className="writeup-item">
                <span className="writeup-date">{item.date}</span>
                <h2 className="writeup-title">
                  <Link href={`/writeups/${item.slug}`} className="writeup-link">
                    {item.title}
                  </Link>
                </h2>
                <p className="writeup-content">{item.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
