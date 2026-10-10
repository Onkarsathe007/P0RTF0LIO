'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { TIMELINE_ITEMS, formatMonthIdx, monthIndex, type Side, type TimelineItem } from '@/app/journey/timeline-data'

const PX_PER_MONTH = 80
const MAX_GAP_PX = 96
const PAD_TOP = 84
const PAD_BOTTOM = 96

const RIGHT_LABEL_MONTHS = new Set<number>()
const EXTRA_GAP_AFTER = new Map([[monthIndex('2024-09'), 90]])
const MOBILE_EXTRA_GAP_AFTER = new Map([
  [monthIndex('2021-05'), 50],
  [monthIndex('2023-11'), 40],
  [monthIndex('2024-01'), 70],
  [monthIndex('2025-03'), 50],
  [monthIndex('2025-05'), 50],
  [monthIndex('2025-09'), 40],
  [monthIndex('2026-08'), 80],
  [monthIndex('2026-09'), 70],
])

function resolveMonth(date: string): number {
  if (date.trim().toLowerCase() === 'present') {
    const now = new Date()
    return now.getFullYear() * 12 + now.getMonth()
  }
  return monthIndex(date)
}

function formatDateLabel(date: string): string {
  if (date.trim().toLowerCase() === 'present') return 'Present'
  return formatMonthIdx(monthIndex(date))
}

function evStyle(color: string): CSSProperties {
  return { '--ev': color } as CSSProperties
}

function rangePath(axisX: number, laneX: number, startY: number, endY: number): string {
  const span = Math.max(startY - endY, 1)
  const bend = Math.max(20, Math.min(40, span / 2.5))
  const c = Math.min(30, bend * 0.8)
  const q = bend * 0.25
  return (
    `M ${axisX},${startY} ` +
    `C ${axisX},${startY - c} ${laneX},${startY - q} ${laneX},${startY - bend} ` +
    `L ${laneX},${endY + bend} ` +
    `C ${laneX},${endY + q} ${axisX},${endY + c} ${axisX},${endY}`
  )
}

function EventLink({ label, href }: { label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="j-link" onClick={(e) => e.stopPropagation()}>
      {label} <span aria-hidden>↗</span>
    </a>
  )
}

function EventCard({ item, dateLabel, open }: { item: TimelineItem; dateLabel: string; open: boolean }) {
  if (!item.detail) return null
  const glyph = (item.title.match(/[A-Za-z0-9]/) ?? ['•'])[0].toUpperCase()
  return (
    <div className={`j-tip j-card${open ? ' j-tip-open' : ''}`} role="dialog">
      <div className="j-cover" aria-hidden>
        {item.image ? (
          <img src={item.image} alt="" className="j-cover-img" />
        ) : (
          <span className="j-cover-letter">{glyph}</span>
        )}
      </div>
      <div className="j-card-body">
        <div className="j-card-date">{dateLabel}</div>
        <p className="j-card-text">{item.detail}</p>
      </div>
    </div>
  )
}

function MilestoneNode({
  item,
  index,
  y,
  axisX,
  containerW,
  dashLen,
  open,
  onToggle,
}: {
  item: Extract<TimelineItem, { kind: 'milestone' }>
  index: number
  y: number
  axisX: number
  containerW: number
  dashLen: number
  open: boolean
  onToggle: () => void
}) {
  const mobile = containerW < 640
  const side = mobile ? 'right' : (item.side ?? 'right')
  const textW = Math.min(side === 'right' ? containerW - axisX - dashLen - 28 : axisX - dashLen - 28, 300)
  const textStyle: CSSProperties =
    side === 'right'
      ? { left: axisX + 6 + dashLen + 12, width: Math.max(textW, 96), textAlign: 'left' as const }
      : { left: axisX - 6 - dashLen - 12 - Math.max(textW, 96), width: Math.max(textW, 96), textAlign: 'right' as const }

  return (
    <div className="j-node" style={{ top: y, left: 0, ...evStyle(item.color) }}>
      {item.halo && <span className="j-halo" style={{ left: axisX, top: 0 }} aria-hidden />}
      <span className="j-dot" style={{ left: axisX, top: 0 }} aria-hidden />
      <span
        className="j-ping"
        style={{ left: axisX, top: 0, animationDelay: `${(index % 5) * 0.45}s` }}
        aria-hidden
      />
      <span
        className="j-dash"
        aria-hidden
        style={
          side === 'right'
            ? { left: axisX + 6, width: dashLen, top: 0 }
            : { left: axisX - 6 - dashLen, width: dashLen, top: 0 }
        }
      />
      <div className="j-text" style={{ top: 0, ...textStyle }}>
        <div className={`j-title-wrap ${side === 'left' ? 'j-align-right' : ''}`}>
          <button type="button" className="j-title j-title-btn" onClick={onToggle} aria-expanded={open} aria-haspopup="dialog">
            {item.title}
          </button>
          <EventCard item={item} dateLabel={formatMonthIdx(monthIndex(item.date))} open={open} />
        </div>
        <div className="j-desc">{item.description}</div>
        {item.link && (
          <div className="j-link-row">
            <EventLink label={item.link.label} href={item.link.href} />
          </div>
        )}
      </div>
    </div>
  )
}

function RangeNode({
  item,
  startY,
  endY,
  axisX,
  laneX,
  containerW,
  open,
  onToggle,
}: {
  item: Extract<TimelineItem, { kind: 'range' }>
  startY: number
  endY: number
  axisX: number
  laneX: number
  containerW: number
  open: boolean
  onToggle: () => void
}) {
  const side = item.side
  const midY = (startY + endY) / 2
  const anchorY = item.textAt === 'end' ? endY : midY
  const isLive = item.end.trim().toLowerCase() === 'present'
  const rawW = side === 'right' ? containerW - laneX - 22 : laneX - 22
  const w = Math.max(Math.min(rawW, 300), containerW < 640 ? 40 : 96)
  const textStyle: CSSProperties =
    side === 'right'
      ? { left: laneX + 14, width: w, textAlign: 'left' as const }
      : { left: laneX - 14 - w, width: w, textAlign: 'right' as const }

  return (
    <div className="j-node" style={{ top: 0, left: 0, ...evStyle(item.color) }}>
      <span className="j-hollow" style={{ left: axisX, top: startY }} aria-hidden />
      <span className="j-hollow" style={{ left: axisX, top: endY }} aria-hidden />
      {isLive && (
        <span className="j-ping" style={{ left: axisX, top: endY }} aria-hidden />
      )}
      <div className="j-text" style={{ top: anchorY, ...textStyle }}>
        <div className={`j-title-wrap ${side === 'left' ? 'j-align-right' : ''}`}>
          <button type="button" className="j-title j-title-btn" onClick={onToggle} aria-expanded={open} aria-haspopup="dialog">
            {item.title}
          </button>
          <EventCard
            item={item}
            dateLabel={`${formatDateLabel(item.start)} → ${formatDateLabel(item.end)}`}
            open={open}
          />
        </div>
        <div className="j-desc">{item.org}</div>
        {item.meta && <div className="j-meta">{item.meta}</div>}
        {item.link && (
          <div className="j-link-row">
            <EventLink label={item.link.label} href={item.link.href} />
          </div>
        )}
      </div>
    </div>
  )
}

export function JourneyTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const laneRefs = useRef<(SVGPathElement | null)[]>([])
  const [containerW, setContainerW] = useState(700)
  const [drawnLanes, setDrawnLanes] = useState<Set<number>>(new Set())
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const toggleCard = (i: number) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) return
    setOpenIdx((prev) => (prev === i ? null : i))
  }

  useEffect(() => {
    if (openIdx === null) return
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest?.('.j-title-wrap')) setOpenIdx(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [openIdx])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerW(el.clientWidth)
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const els = laneRefs.current.filter((el): el is SVGPathElement => el !== null)
    if (typeof IntersectionObserver === 'undefined' || els.length === 0) {
      setDrawnLanes(new Set(laneRefs.current.map((_, i) => i)))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        setDrawnLanes((prev) => {
          const next = new Set(prev)
          let changed = false
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const idx = Number((entry.target as SVGPathElement).dataset.lane)
              if (!next.has(idx)) {
                next.add(idx)
                changed = true
              }
              io.unobserve(entry.target)
            }
          }
          return changed ? next : prev
        })
      },
      { threshold: 0.2 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const isMobile = containerW < 640
  const laneOffset = (side: Side) => (isMobile ? (side === 'left' ? 72 : 30) : side === 'left' ? 100 : 60)
  const dashLen = isMobile ? 32 : 50
  const axisX = containerW / 2

  const layout = useMemo(() => {
    const months = new Set<number>()
    const labelOverrides = new Map<number, string>()
    const addMonth = (date: string) => {
      const m = resolveMonth(date)
      months.add(m)
      if (date.trim().toLowerCase() === 'present') labelOverrides.set(m, 'Present')
    }
    for (const item of TIMELINE_ITEMS) {
      if (item.kind === 'milestone') addMonth(item.date)
      else {
        addMonth(item.start)
        addMonth(item.end)
      }
    }
    const sorted = [...months].sort((a, b) => a - b)
    const offset = new Map<number, number>()
    let acc = 0
    sorted.forEach((m, i) => {
      if (i > 0) {
        acc += Math.min((m - sorted[i - 1]) * PX_PER_MONTH, MAX_GAP_PX)
        acc += EXTRA_GAP_AFTER.get(sorted[i - 1]) ?? 0
        if (isMobile) acc += MOBILE_EXTRA_GAP_AFTER.get(sorted[i - 1]) ?? 0
      }
      offset.set(m, acc)
    })
    const span = acc
    const height = span + PAD_TOP + PAD_BOTTOM
    const yOf = (m: number) => PAD_TOP + (span - (offset.get(m) ?? 0))
    return { sorted, yOf, height, labelOverrides }
  }, [isMobile])

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div ref={containerRef} className="j-canvas">
        <div className="j-inner" style={{ height: layout.height }}>
          <div className="j-axis" style={{ left: axisX }} aria-hidden />

          <svg
            className="j-svg"
            width={containerW}
            height={layout.height}
            viewBox={`0 0 ${containerW} ${layout.height}`}
            aria-hidden
          >
            {TIMELINE_ITEMS.map((item, i) => {
              if (item.kind !== 'range') return null
              const startY = layout.yOf(resolveMonth(item.start))
              const endY = layout.yOf(resolveMonth(item.end))
              const laneDef = item.side === 'right' ? laneOffset('right') : laneOffset('left')
              const laneOff = item.lane != null ? Math.min(item.lane, axisX - 60) : laneDef
              const laneX = item.side === 'right' ? axisX + laneOff : axisX - laneOff
              return (
                <path
                  key={`lane-${i}`}
                  ref={(el) => {
                    laneRefs.current[i] = el
                  }}
                  data-lane={i}
                  className={`j-lane${drawnLanes.has(i) ? ' j-drawn' : ''}`}
                  style={{ '--ev': item.color } as CSSProperties}
                  d={rangePath(axisX, laneX, startY, endY)}
                  pathLength={100}
                />
              )
            })}
          </svg>

          {layout.sorted.map((m) => (
            <div
              key={`label-${m}`}
              className={`j-month${RIGHT_LABEL_MONTHS.has(m) ? ' j-month-right' : ''}`}
              style={{ left: axisX, top: layout.yOf(m) }}
            >
              {layout.labelOverrides.get(m) ?? formatMonthIdx(m)}
            </div>
          ))}

          {TIMELINE_ITEMS.map((item, i) => {
            if (item.kind === 'milestone') {
              return (
                <MilestoneNode
                  key={`m-${i}`}
                  item={item}
                  index={i}
                  y={layout.yOf(resolveMonth(item.date))}
                  axisX={axisX}
                  containerW={containerW}
                  dashLen={dashLen}
                  open={openIdx === i}
                  onToggle={() => toggleCard(i)}
                />
              )
            }
            const startY = layout.yOf(resolveMonth(item.start))
            const endY = layout.yOf(resolveMonth(item.end))
            const laneDef = item.side === 'right' ? laneOffset('right') : laneOffset('left')
            const laneOff = item.lane != null ? Math.min(item.lane, axisX - 60) : laneDef
            const laneX = item.side === 'right' ? axisX + laneOff : axisX - laneOff
            return (
              <RangeNode
                key={`r-${i}`}
                item={item}
                startY={startY}
                endY={endY}
                axisX={axisX}
                laneX={laneX}
                containerW={containerW}
                open={openIdx === i}
                onToggle={() => toggleCard(i)}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
