const LINKS = [
  {
    title: 'X',
    handle: '@theonkarsathe',
    href: 'https://x.com/theonkarsathe',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="social-icon-svg">
        <path
          d="m22.991 23-8.533-12.612L22.42 1h-2.77l-6.422 7.575L8.105 1H1.123l8.225 12.158L1 23h2.77l6.81-8.03L16.015 23H23zM7.193 2.769l12.49 18.462h-2.76L4.43 2.769z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: 'GitHub',
    handle: 'Onkarsathe007',
    href: 'https://github.com/Onkarsathe007',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="social-icon-svg">
        <path
          d="M12 0C5.37 0 0 5.372 0 11.997 0 17.3 3.438 21.795 8.205 23.38c.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.609-4.042-1.609C4.422 17.77 3.633 17.4 3.633 17.4c-1.087-.744.084-.73.084-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.417-1.304.76-1.604-2.665-.3-5.466-1.332-5.466-5.929 0-1.31.465-2.38 1.235-3.219-.135-.303-.54-1.523.105-3.175 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.006 2.04.138 3 .404 2.28-1.551 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.608-2.805 5.623-5.475 5.918.42.36.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.284 0 .315.21.69.825.57C20.565 21.79 24 17.291 24 11.997 24 5.372 18.627 0 12 0"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: 'LinkedIn',
    handle: 'onkar-sathe007',
    href: 'https://in.linkedin.com/in/onkar-sathe007',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="social-icon-svg">
        <path
          d="M22.274 0H1.728C.692 0 0 .685 0 1.715v20.569C0 23.316.864 24 1.727 24h20.546C23.31 24 24 23.315 24 22.285V1.716C24.001.684 23.31 0 22.274 0M7.08 20.4H3.454V8.915h3.625zM5.352 7.371c-1.209 0-2.07-.856-2.07-2.056s.863-2.059 2.07-2.059c1.21 0 2.073.859 2.073 2.059S6.388 7.37 5.352 7.37M20.548 20.4h-3.626v-5.485c0-1.371 0-3.087-1.9-3.087-1.898 0-2.073 1.372-2.073 2.916V20.4H9.325V8.915h3.454v1.541c.69-1.2 2.073-1.885 3.453-1.885 3.627 0 4.316 2.4 4.316 5.485z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: 'YouTube',
    handle: '@onkarsatheee',
    href: 'https://www.youtube.com/@onkarsatheee',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="social-icon-svg">
        <path
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          fill="currentColor"
        />
      </svg>
    ),
  },
]

export function SocialLinks({ showNote = true }: { showNote?: boolean }) {
  return (
    <div className="social-plain">
      <h2 className="sr-only">Social links</h2>
        <ul className="social-row">
          {LINKS.map((item, index) => (
            <li key={item.title} className="social-cell">
              <a
                className="social-btn"
                href={item.href}
                target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener"
                title={`${item.title} (${item.handle})`}
                aria-label={item.title}
              >
                {item.icon}
              </a>
              {index === LINKS.length - 1 && showNote && (
                <div className="follow-note" aria-hidden>
                  <span className="follow-text">follow me</span>
                  <svg
                    className="follow-arrow"
                    viewBox="0 0 40 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M34 4c1 15-5 26-21 30" />
                    <path d="m22 37-9-3 7.5-8" />
                  </svg>
                </div>
              )}
            </li>
          ))}
        </ul>
    </div>
  )
}
