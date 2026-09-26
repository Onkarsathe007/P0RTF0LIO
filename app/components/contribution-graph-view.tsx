'use client'

export type Activity = {
  date: string
  count: number
  level: number
}

const BLOCK = 12
const GAP = 2
const STEP = BLOCK + GAP
const LABEL_H = 22

function parseDay(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function monthShort(date: Date) {
  return date.toLocaleString('en-US', { month: 'short' })
}

function prettyDay(iso: string) {
  const d = parseDay(iso)
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function ContributionGraphView({ data }: { data: Activity[] }) {
  if (data.length === 0) return null

  const sorted = [...data].sort((a, b) => (a.date < b.date ? -1 : 1))
  const weeks: (Activity | null)[][] = []
  let current: (Activity | null)[] = new Array(parseDay(sorted[0].date).getDay()).fill(null)

  for (const act of sorted) {
    current.push(act)
    if (current.length === 7) {
      weeks.push(current)
      current = []
    }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null)
    weeks.push(current)
  }

  const total = sorted.reduce((sum, a) => sum + a.count, 0)
  const width = weeks.length * STEP + GAP
  const height = LABEL_H + 7 * STEP + GAP

  let lastMonth = -1
  const monthLabels = weeks.map((week, i) => {
    const first = week.find((d) => d !== null)
    if (!first) return null
    const m = parseDay(first.date).getMonth()
    if (m === lastMonth) return null
    lastMonth = m
    return { x: i * STEP + GAP, label: monthShort(parseDay(first.date)) }
  })

  return (
    <figure className="contrib">
      <div className="contrib-scroll">
        <svg
          className="contrib-svg"
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="GitHub contributions graph"
        >
          {monthLabels.map(
            (ml, i) =>
              ml && (
                <text key={i} x={ml.x} y={14} className="contrib-month">
                  {ml.label}
                </text>
              )
          )}
          {weeks.map((week, wi) =>
            week.map((day, di) =>
              day ? (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * STEP + GAP}
                  y={LABEL_H + di * STEP + GAP}
                  width={BLOCK}
                  height={BLOCK}
                  data-level={Math.max(0, Math.min(4, day.level))}
                >
                  <title>
                    {day.count} contribution{day.count === 1 ? '' : 's'} on {prettyDay(day.date)}
                  </title>
                </rect>
              ) : (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * STEP + GAP}
                  y={LABEL_H + di * STEP + GAP}
                  width={BLOCK}
                  height={BLOCK}
                  data-level="0"
                  opacity={0.35}
                />
              )
            )
          )}
        </svg>
      </div>
      <figcaption className="contrib-footer">
        <span className="contrib-caption">
          <span className="contrib-fig">Fig. 2.</span> {total.toLocaleString('en-US')} contributions,{' '}
          {prettyDay(sorted[0].date)} – {prettyDay(sorted[sorted.length - 1].date)}. Source:{' '}
          <a
            href="https://github.com/Onkarsathe007"
            className="inline-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </span>
        <span className="contrib-legend" aria-hidden>
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <i key={l} data-level={l} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  )
}
