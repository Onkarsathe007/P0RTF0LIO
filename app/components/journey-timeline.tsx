'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { motion } from 'framer-motion'
import { TIMELINE_ITEMS, formatMonthIdx, monthIndex, type Side, type TimelineItem } from '@/app/journey/timeline-data'

const PX_PER_MONTH = 80
const MAX_GAP_PX = 96
const PAD_TOP = 84
const PAD_BOTTOM = 96

const RIGHT_LABEL_MONTHS = new Set([monthIndex('2024-09'), monthIndex('2026-07')])

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

function Tooltip({ text }: { text: string }) {
  return (
    <div className="j-tip" role="tooltip">
      {text}
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
}: {
  item: Extract<TimelineItem, { kind: 'milestone' }>
  index: number
  y: number
  axisX: number
  containerW: number
  dashLen: number
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
          <span className="j-title" tabIndex={item.detail ? 0 : undefined}>
            {item.title}
          </span>
          {item.detail && <Tooltip text={item.detail} />}
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
}: {
  item: Extract<TimelineItem, { kind: 'range' }>
  startY: number
  endY: number
  axisX: number
  laneX: number
  containerW: number
}) {
  const side = item.side
  const midY = (startY + endY) / 2
  const rawW = side === 'right' ? containerW - laneX - 22 : laneX - 22
  const w = Math.max(Math.min(rawW, 300), 96)
  const textStyle: CSSProperties =
    side === 'right'
      ? { left: laneX + 14, width: w, textAlign: 'left' as const }
      : { left: laneX - 14 - w, width: w, textAlign: 'right' as const }

  return (
    <div className="j-node" style={{ top: 0, left: 0, ...evStyle(item.color) }}>
      <span className="j-hollow" style={{ left: axisX, top: startY }} aria-hidden />
      <span className="j-hollow" style={{ left: axisX, top: endY }} aria-hidden />
      <div className="j-text" style={{ top: midY, ...textStyle }}>
        <div className={`j-title-wrap ${side === 'left' ? 'j-align-right' : ''}`}>
          <span className="j-title" tabIndex={item.detail ? 0 : undefined}>
            {item.title}
          </span>
          {item.detail && <Tooltip text={item.detail} />}
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
  const [containerW, setContainerW] = useState(700)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerW(el.clientWidth)
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const isMobile = containerW < 640
  const laneOffset = (side: Side) => (isMobile ? (side === 'left' ? 60 : 30) : side === 'left' ? 100 : 60)
  const dashLen = isMobile ? 32 : 50
  const axisX = containerW / 2

  const layout = useMemo(() => {
    const months = new Set<number>()
    for (const item of TIMELINE_ITEMS) {
      if (item.kind === 'milestone') months.add(monthIndex(item.date))
      else {
        months.add(monthIndex(item.start))
        months.add(monthIndex(item.end))
      }
    }
    const sorted = [...months].sort((a, b) => a - b)
    const offset = new Map<number, number>()
    let acc = 0
    sorted.forEach((m, i) => {
      if (i > 0) acc += Math.min((m - sorted[i - 1]) * PX_PER_MONTH, MAX_GAP_PX)
      offset.set(m, acc)
    })
    const span = acc
    const height = span + PAD_TOP + PAD_BOTTOM
    const yOf = (m: number) => PAD_TOP + (span - (offset.get(m) ?? 0))
    return { sorted, yOf, height }
  }, [])

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
              const startY = layout.yOf(monthIndex(item.start))
              const endY = layout.yOf(monthIndex(item.end))
              const laneX = item.side === 'right' ? axisX + laneOffset('right') : axisX - laneOffset('left')
              return (
                <path
                  key={`lane-${i}`}
                  className="j-lane"
                  style={{ '--ev': item.color, animationDelay: `${0.4 + i * 0.18}s` } as CSSProperties}
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
              {formatMonthIdx(m)}
            </div>
          ))}

          {TIMELINE_ITEMS.map((item, i) => {
            if (item.kind === 'milestone') {
              return (
                <MilestoneNode
                  key={`m-${i}`}
                  item={item}
                  index={i}
                  y={layout.yOf(monthIndex(item.date))}
                  axisX={axisX}
                  containerW={containerW}
                  dashLen={dashLen}
                />
              )
            }
            const startY = layout.yOf(monthIndex(item.start))
            const endY = layout.yOf(monthIndex(item.end))
            const laneX = item.side === 'right' ? axisX + laneOffset('right') : axisX - laneOffset('left')
            return (
              <RangeNode
                key={`r-${i}`}
                item={item}
                startY={startY}
                endY={endY}
                axisX={axisX}
                laneX={laneX}
                containerW={containerW}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
