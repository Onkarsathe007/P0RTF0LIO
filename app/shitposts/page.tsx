import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'

export const metadata = {
  title: 'Notes - Onkar Sathe',
  description: 'Short notes from my learning and build journey.',
}

const notes = [
  {
    id: 'some-meaningfull-thoughts',
    date: 'jun 05 2026',
    title: 'Some meaningfull thoughts',
    content: (
      <>
        whatever my brain says, I write here
      </>
    ),
  },
]

export default function NotesPage() {
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
              <Link href="/shitposts" className="home-nav-link home-nav-link-active">
                notes
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <h1 className="home-title">Notes</h1>
            <p className="home-lead">Short thoughts from my software journey.</p>
          </div>
        </aside>

        <section className="split-main">
          <div className="writeups-list">
            {notes.map((item) => (
              <article key={item.id} className="writeup-item">
                <span className="writeup-date">{item.date}</span>
                <h2 className="writeup-title">{item.title}</h2>
                <div className="writeup-content">{item.content}</div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
