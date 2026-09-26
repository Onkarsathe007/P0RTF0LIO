import Link from 'next/link'
import { ThemeToggle } from './components/theme-toggle'
import { ProfileHeader } from './components/profile-header'
import { SocialLinks } from './components/social-links'
import { SiteFooterLogotype } from './components/site-footer-logotype'

const highlights = [
  {
    label: 'Role',
    content: 'Backend / Devops',
  },
  {
    label: 'Education',
    content: 'B-Tech in  AI and Data Science · VIIT Pune',
  },
  {
    label: 'Experience',
    content: '3.2+ years across freelancing and personal projects ',
  },
  {
    label: 'Focus',
    content: 'Build technology that solves real problems for real people.',
  },
]

const skills = ['Typescript', 'Java', 'Go', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'Git', 'and etc etc']

const projects = [
  {
    category: 'Full Stack Project',
    name: 'Fastshop',
    description: 'An e-commerce oriented project focused on end-to-end product flows, clean UX, and practical implementation.',
    points: [
      'Product-style architecture',
      'Backend + frontend flow ownership',
      'Hands-on full-stack execution',
    ],
    link: 'https://github.com/Onkarsathe007/Fastshop',
  },
  {
    category: 'Developer Experience',
    name: '.dotfiles',
    description: 'My personal environment setup to keep development fast, reproducible, and consistent across machines.',
    points: [
      'Productivity-first setup',
      'Reusable terminal/editor defaults',
      'Workflow consistency',
    ],
    link: 'https://github.com/Onkarsathe007/dotfiles',
  },
  {
    category: 'AI Project',
    name: 'CommuniAI',
    description: 'An AI-focused project exploring communication workflows, automation, and practical assistant-driven tooling.',
    points: [
      'AI-first product thinking',
      'Applied experimentation',
      'Practical automation mindset',
    ],
    link: 'https://github.com/Onkarsathe007/CommuniAI',
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
            {/* <div className="home-profile-actions" aria-label="Profile actions">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="home-profile-button home-profile-button-primary"
              >
                <span>Resume</span>
              </a>
              <a
                href="https://github.com/Onkarsathe007"
                target="_blank"
                rel="noopener noreferrer"
                className="home-profile-button"
              >
                <span>GitHub</span>
              </a>
            </div> */}
            <SocialLinks />
            <ProfileHeader />
            <p className="home-lead">hehe :)</p>
          </div>
        </aside>

        <section className="split-main">
          <section className="panel" aria-label="About">
            <header className="panel-header">
              <span className="panel-label">about</span>
            </header>
            <div className="panel-body home-intro">
              <p className="home-paragraph">
                Hello! I&apos;m{' '}
                <a href="https://github.com/onkarsathe007" target="_blank" rel="noopener noreferrer" className="inline-link">
                  Onkar Sathe
                </a>{' '}
                incoming SDE Intern at{' '}
                <a href="https://www.wolterskluwer.com/" target="_blank" rel="noopener noreferrer" className="inline-link">
                  Wolters Kluwer
                </a>
                {' '} and final-year B.Tech student at{' '}
                <a href="https://viit.ac.in/" target="_blank" rel="noopener noreferrer" className="inline-link">
                  VIIT Pune
                </a>
                {''}
                . I love building software systems that solve real problems for real people.
              </p>
              <p className="home-paragraph">
                I enjoy working across the stack, approaching cloud and DevOps with the same wide-eyed curiosity as a child discovering something new, learning fast, and shipping clean, practical experiences. I also love participating in hackathons, where I get to build, learn, and ship under pressure.            </p>
            </div>
          </section>
          <section className="panel" aria-label="Highlights">
            <header className="panel-header">
              <span className="panel-label">highlights</span>
            </header>
            <div className="panel-body">
              <ul className="home-highlights-list">
                {highlights.map((item) => (
                  <li key={item.label} className="home-highlight-item">
                    <span className="home-highlight-label">{item.label}</span>
                    <div className="home-highlight-content">{item.content}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="panel" aria-label="Technical Skills">
            <header className="panel-header">
              <span className="panel-label">technical skills</span>
            </header>
            <div className="panel-body">
              <div className="agent-meta-row">
                {skills.map((skill) => (
                  <span key={skill} className="agent-meta-item">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="panel" aria-label="Project Collection">
            <header className="panel-header">
              <span className="panel-label">project collection</span>
            </header>
            <div className="panel-body">
              <ul className="collection-list">
                {projects.map((project) => (
                  <li key={project.name} className="collection-item">
                    <span className="home-highlight-label">{project.category}</span>
                    <div className="home-highlight-content">{project.name}</div>
                    <p className="home-paragraph">{project.description}</p>
                    <ul className="collection-points">
                      {project.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-link">
                      View on GitHub →
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <footer className="home-footer">
            <div className="home-footer-links">
              <a href="mailto:onkarsathe96k@gmail.com" className="inline-link">
                email
              </a>
              <a href="https://github.com/Onkarsathe007" target="_blank" rel="noopener noreferrer" className="inline-link">
                github
              </a>
            </div>
          </footer>

          <div className="stripe-band" aria-hidden />

          <SiteFooterLogotype />
        </section>
      </div>
    </main>
  )
}
