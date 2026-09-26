'use client'

import { useEffect, useState } from 'react'
import { SocialLinks } from './social-links'

const EMAIL = 'onkarsathe96k@gmail.com'

function TileIcon({ children }: { children: React.ReactNode }) {
  return <span className="contact-tile">{children}</span>
}

function BriefcaseGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="contact-glyph">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

function PinGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="contact-glyph">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="contact-glyph">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="contact-glyph">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="contact-glyph-sm">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CopyGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="contact-glyph-sm">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function usePuneTime() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(now)
  const kolkataWall = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getTime()
  const localWall = new Date(now.toLocaleString('en-US')).getTime()
  const diffMins = Math.round((kolkataWall - localWall) / 60000)
  const abs = Math.abs(diffMins)
  const hrs = Math.floor(abs / 60)
  const mins = abs % 60
  const parts = [
    hrs > 0 ? `${hrs}h` : null,
    mins > 0 ? `${mins}m` : null,
  ].filter(Boolean)
  const relation =
    diffMins === 0
      ? 'same time as you'
      : `${parts.join(' ')} ${diffMins > 0 ? 'ahead' : 'behind'}`
  return `${time} // ${relation}`
}

export function ContactPanel() {
  const [copied, setCopied] = useState(false)
  const puneTime = usePuneTime()

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="panel" aria-label="Contact">
      <header className="panel-header">
        <span className="panel-label">contact</span>
      </header>
      <div className="panel-body">
        <ul className="contact-list">
          <li className="contact-row">
            <TileIcon>
              <BriefcaseGlyph />
            </TileIcon>
            <p className="contact-text">
              Incoming SDE Intern <span aria-label="at">@</span>{' '}
              <a href="https://www.wolterskluwer.com/" target="_blank" rel="noopener noreferrer" className="inline-link">
                Wolters Kluwer
              </a>
            </p>
          </li>
          <li className="contact-row">
            <TileIcon>
              <BriefcaseGlyph />
            </TileIcon>
            <p className="contact-text">
              B.Tech Student <span aria-label="at">@</span>{' '}
              <a href="https://viit.ac.in/" target="_blank" rel="noopener noreferrer" className="inline-link">
                VIIT Pune
              </a>
            </p>
          </li>
          <li className="contact-row">
            <TileIcon>
              <PinGlyph />
            </TileIcon>
            <p className="contact-text">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Pune%2CIndia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-link"
                aria-label="Location: Pune, India"
              >
                Pune, India
              </a>
            </p>
          </li>
          <li className="contact-row">
            <TileIcon>
              <ClockGlyph />
            </TileIcon>
            <p className="contact-text" aria-label={`Local time: ${puneTime}`}>
              {puneTime}
            </p>
          </li>
          <li className="contact-row">
            <TileIcon>
              <MailGlyph />
            </TileIcon>
            <p className="contact-text">
              <a href={`mailto:${EMAIL}`} className="inline-link">
                {EMAIL}
              </a>
            </p>
            <button
              type="button"
              className="copy-btn"
              onClick={copyEmail}
              aria-label={copied ? 'Email copied' : 'Copy email'}
              title={copied ? 'Copied!' : 'Copy email'}
            >
              {copied ? <CheckGlyph /> : <CopyGlyph />}
            </button>
          </li>
        </ul>
        <div className="contact-social">
          <SocialLinks showNote={false} />
        </div>
      </div>
    </section>
  )
}
