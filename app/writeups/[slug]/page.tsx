import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ThemeToggle } from '../../components/theme-toggle'
import { MarkdownRenderer } from '../../components/markdown-renderer'
import { getWriteupBySlug, getWriteups } from '../../lib/writeups'

export async function generateStaticParams() {
  const writeups = await getWriteups()

  return writeups.map((writeup) => ({
    slug: writeup.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const writeup = await getWriteupBySlug(params.slug)

  if (!writeup) {
    return {
      title: 'Writeup Not Found - Kedar Vartak',
    }
  }

  return {
    title: `${writeup.title} - Kedar Vartak`,
    description: writeup.excerpt,
  }
}

export default async function WriteupDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const writeup = await getWriteupBySlug(params.slug)

  if (!writeup) {
    notFound()
  }

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
                agents
              </Link>
              <Link href="/writeups" className="home-nav-link home-nav-link-active">
                writeups
              </Link>
              <Link href="/shitposts" className="home-nav-link">
                shitposts
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <span className="writeup-date">{writeup.date}</span>
            <h1 className="home-title">{writeup.title}</h1>
            <p className="home-lead">{writeup.excerpt}</p>
          </div>
        </aside>

        <section className="split-main">
          <article className="writeup-detail">
            <MarkdownRenderer content={writeup.content} omitFirstH1 />
          </article>

          <footer className="home-footer">
            <div className="home-footer-links">
              <Link href="/writeups" className="inline-link">
                all writeups
              </Link>
            </div>
          </footer>
        </section>
      </div>
    </main>
  )
}
