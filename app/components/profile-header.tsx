'use client'

import {
  Children,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import type { Ref } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const FLIP_SENTENCES = [
  'I build systems that solve real problems.',
  'Cloud, DevOps, and clean shipping.',
  'Hackathons are my playground.',
]

function VerifiedTick(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
      />
    </svg>
  )
}

type WaveHandle = {
  ripple: () => void
}

function SoundWaves({ waveRef }: { waveRef: Ref<WaveHandle> }) {
  const [rippling, setRippling] = useState(false)

  useImperativeHandle(waveRef, () => ({
    ripple: () => setRippling(true),
  }))

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="sound-icon"
      aria-hidden
    >
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <AnimatePresence initial={false} mode="wait">
        {rippling ? (
          <motion.g
            key="waves-on"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            onAnimationComplete={() => setRippling(false)}
          >
            <path d="M16 9a5 5 0 0 1 0 6" />
            <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
          </motion.g>
        ) : (
          <g key="waves-off">
            <path d="M16 9a5 5 0 0 1 0 6" />
            <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
          </g>
        )}
      </AnimatePresence>
    </svg>
  )
}

function FlipLines({ lines }: { lines: string[] }) {
  const [index, setIndex] = useState(0)
  const items = Children.toArray(lines)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="flip-lines" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={index}
          className="flip-line"
          initial={{ y: '-20%', opacity: 0, filter: 'blur(1px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '40%', opacity: 0, filter: 'blur(1px)', transition: { ease: 'easeOut' } }}
          transition={{ duration: 0.3 }}
        >
          {items[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

export function ProfileHeader() {
  const waveRef = useRef<WaveHandle>(null)

  const speakName = () => {
    waveRef.current?.ripple()
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance('Onkar Sathe')
    utterance.rate = 0.95
    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return
      if (event.key.toLowerCase() === 'p' && !event.metaKey && !event.ctrlKey) {
        speakName()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="profile-header">
      <div className="profile-name-row">
        <h1 className="home-title">Onkar Sathe</h1>
        <VerifiedTick className="verified-tick" aria-label="Verified" />
        <button
          type="button"
          className="sound-btn"
          onClick={speakName}
          aria-label="Pronounce my name"
          title="Pronounce my name (p)"
        >
          <SoundWaves waveRef={waveRef} />
        </button>
      </div>
      <FlipLines lines={FLIP_SENTENCES} />
    </div>
  )
}
