import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'

export const metadata = {
  title: 'Shitposts - Kedar Vartak',
  description: 'Short-form posts on software, systems, and building things that matter.',
}

const shitposts = [
  {
    id: 'im-a-father',
    date: 'may 23 2026',
    title: 'im a father',
    content: (
      <>
        I have 4 kids - Codex 1, Codex 2, Claude Code, and Gemini CLI.
        <br />
        <br />
        Codexes have a special knack for development, I love them for that. Claude Code is the smartest kid I have; it
        acts as an orchestrator over all my builds and decides almost everything - my favorite child. Gemini was a
        mistake, but it does small UI tasks fine I guess.
        <br />
        <br />
        I make &quot;use&quot; of all my kids. <strong>Multi Agent Memo</strong> was built as a shared brain in between
        these kids, so that they will know and acknowledge each other&apos;s work.
      </>
    ),
  },
  {
    id: 'frustration-cleaning-garbage',
    date: 'may 22 2026',
    title: 'the frustration of cleaning garbage',
    content: (
      <>
        A couple of months ago I invested in SanDisk, Seagate, and Western Digital. Thank God I did, storage has been
        booming, and it&apos;s not gonna stop so soon.
        <br />
        <br />
        Doesn&apos;t mean I should keep screenshotting my features to visually reference what I ship to LLMs. That&apos;s a
        hassle for me to cleanup. <strong>Agent Vision</strong> is a solution exactly for this. Agent Vision connects
        your IDE to your browser via Chrome Development Protocol, not only giving your LLMs ability to view your browser
        environment, but also your network tab, console logs-it&apos;s the entire deal.
      </>
    ),
  },
  {
    id: 'easy-sanity-birth',
    date: 'apr 15 2026',
    title: 'the birth of easy sanity',
    content: (
      <>
        I take complete ownership for the code I write inside and outside of work, which means testing every single flow
        takes a lot of time. Some flows are way too easy but have manual dependency since every single flow is browser
        based.
        <br />
        <br />
        This resulted in the birth of <strong>Easy Sanity</strong>. Easy Sanity is a simple MCP tool that you setup in
        your IDE, you write down your test flows in excruciating detail in plain English and an AI agent just pulls them
        off for you.
        <br />
        <br />
        Keeping shit simple, but useful.
      </>
    ),
  },
]

export default function ShitpostsPage() {
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
              <Link href="/writeups" className="home-nav-link">
                writeups
              </Link>
              <Link href="/shitposts" className="home-nav-link home-nav-link-active">
                shitposts
              </Link>
            </div>
            <ThemeToggle />
          </header>

          <div className="home-intro-sidebar">
            <h1 className="home-title">Shitposts</h1>
            <p className="home-lead">Short-form notes on software ownership, leverage, and shipping useful things.</p>
          </div>
        </aside>

        <section className="split-main">
          <div className="writeups-list">
            {shitposts.map((item) => (
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
