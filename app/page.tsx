import Link from 'next/link'
import { ThemeToggle } from './components/theme-toggle'
import { ProfileHeader } from './components/profile-header'
import { SocialLinks } from './components/social-links'
import { Experience, EDUCATION } from './components/experience'
import { SiteFooterLogotype } from './components/site-footer-logotype'

const skills = ['Typescript', 'Java', 'Go', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'Git', 'and etc etc']

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
            <p className="home-lead">    </p>
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
                SDE Intern at{' '}
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
          <Experience />

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

          <Experience id="education" label="education" companies={EDUCATION} />

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
