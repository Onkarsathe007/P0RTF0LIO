import Link from 'next/link'
import { ThemeToggle } from './components/theme-toggle'

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
    name: '.dotfiles',
    description: 'Personalized Arch Linux (Hyprland) rice, built from scratch.',
    link: 'https://github.com/Onkarsathe007/dotfiles',
  },
  {
    name: 'CommuniAI',
    description: 'Helping bridge communication for the deaf community.',
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
            <h1 className="home-title">Onkar Sathe</h1>
            <p className="home-lead">I build things, break them, and watch them come alive - this process is what I love..</p>
          </div>
        </aside>

        <section className="split-main">
          <div className="home-intro">
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

          <div className="home-section">
            <h2 className="home-section-title">Technical Skills</h2>
            <div className="agent-meta-row">
              {skills.map((skill) => (
                <span key={skill} className="agent-meta-item">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="home-section">
            <h2 className="home-section-title">Featured Projects</h2>
            <ul className="home-highlights-list">
              {projects.map((project) => (
                <li key={project.name} className="home-highlight-item">
                  <span className="home-highlight-label">{project.name}</span>
                  <div className="home-highlight-content">
                    {project.description}{' '}
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-link">
                      github
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

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
        </section>
      </div>
    </main>
  )
}
