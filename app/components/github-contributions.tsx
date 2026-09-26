import { Suspense } from 'react'
import type { Activity } from './contribution-graph-view'
import { ContributionGraphView } from './contribution-graph-view'

const USERNAME = 'onkarsathe007'
const API_URL = 'https://github-contributions-api.jogruber.de/v4'

async function getContributions(): Promise<Activity[]> {
  try {
    const res = await fetch(`${API_URL}/${USERNAME}?y=last`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return []
    const data = (await res.json()) as { contributions?: Activity[] }
    return data.contributions ?? []
  } catch {
    return []
  }
}

export async function GithubContributions() {
  const contributions = await getContributions()

  return (
    <section className="panel" aria-label="GitHub contributions">
      <h2 className="sr-only">GitHub contributions</h2>
      <div className="panel-body contrib-body">
        <Suspense fallback={<p className="home-paragraph">Loading contributions…</p>}>
          {contributions.length === 0 ? (
            <p className="home-paragraph">
              Contributions unavailable right now — see them on{' '}
              <a
                href={`https://github.com/${USERNAME}`}
                className="inline-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          ) : (
            <ContributionGraphView data={contributions} />
          )}
        </Suspense>
      </div>
    </section>
  )
}
