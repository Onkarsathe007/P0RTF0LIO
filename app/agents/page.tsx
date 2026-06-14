import Link from 'next/link'
import { ThemeToggle } from '../components/theme-toggle'

const projects = [
  {
    name: 'Fastshop',
    type: 'Full Stack Project',
    description:
      'An e-commerce oriented project focused on end-to-end product flows, clean UX, and practical implementation.',
    points: ['Product-style architecture', 'Backend + frontend flow ownership', 'Hands-on full-stack execution'],
    link: 'https://github.com/Onkarsathe007/Fastshop',
  },
  {
    name: '.dotfiles',
    type: 'Developer Experience',
    description:
      'My personal environment setup to keep development fast, reproducible, and consistent across machines.',
    points: ['Productivity-first setup', 'Reusable terminal/editor defaults', 'Workflow consistency'],
    link: 'https://github.com/Onkarsathe007/dotfiles',
  },
  {
    name: 'CommuniAI',
    type: 'AI Project',
    description:
      'An AI-focused project exploring communication workflows, automation, and practical assistant-driven tooling.',
    points: ['AI-first product thinking', 'Applied experimentation', 'Practical automation mindset'],
    link: 'https://github.com/Onkarsathe007/CommuniAI',
  },
]

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
              <Link href="/shitposts" className="home-nav-link">
                notes
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
          <div className="home-section">
            <h2 className="home-section-title">Project Collection</h2>
            <div className="agents-grid">
              {projects.map((project) => (
                <article key={project.name} className="agent-card">
                  <div className="agent-card-top">
                    <span className="agent-pill">{project.type}</span>
                  </div>

                  <div>
                    <h3 className="agent-title">{project.name}</h3>
                    <p className="agent-description">{project.description}</p>
                  </div>

                  <div className="agent-meta-row">
                    {project.points.map((point) => (
                      <span key={point} className="agent-meta-item">
                        {point}
                      </span>
                    ))}
                  </div>

                  <div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-link">
                      View on GitHub →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
