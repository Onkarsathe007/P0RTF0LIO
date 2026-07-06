'use client'

import { motion as m } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'

import { Button } from './ui/button'

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mounted, setMounted] = useState(false)
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light'

  useEffect(() => {
    // `next-themes` needs a client-only mount flag to avoid hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleTheme = async () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startViewTransition = document.startViewTransition?.bind(document)

    if (!startViewTransition || prefersReducedMotion) {
      setTheme(newTheme)
      return
    }

    // This is only necessary for transitions that rely on --x and --y
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const x = (rect.left + rect.right) / 2
      const y = (rect.top + rect.bottom) / 2

      document.documentElement.style.setProperty('--x', `${(x / window.innerWidth) * 100}%`)
      document.documentElement.style.setProperty('--y', `${(y / window.innerHeight) * 100}%`)
    }

    const transitionClass = 'vertical-wipe-transition'

    document.documentElement.classList.add(transitionClass)

    const transition = startViewTransition(() => {
      setTheme(newTheme)
    })

    try {
      await transition.finished
    } finally {
      document.documentElement.classList.remove(transitionClass)
    }
  }

  const shineVariant = {
    hidden: {
      opacity: 0,
      scale: 2,
      strokeDasharray: '20, 1000',
      strokeDashoffset: 0,
      filter: 'blur(0px)',
    },
    visible: {
      opacity: [0, 1, 0],
      strokeDashoffset: [0, -50, -100],
      filter: ['blur(2px)', 'blur(2px)', 'blur(0px)'],
      transition: {
        duration: 0.75,
      },
    },
  }

  const raysVariants = {
    hidden: {
      strokeOpacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    visible: {
      strokeOpacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const rayVariant = {
    hidden: {
      pathLength: 0,
      opacity: 0,
      scale: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        pathLength: { duration: 0.3 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.3 },
      },
    },
  }

  const sunPath =
    'M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C60 29 69.5 38 70 49.5Z'
  const moonPath =
    'M70 49.5C70 60.8218 60.8218 70 49.5 70C38.1782 70 29 60.8218 29 49.5C29 38.1782 38.1782 29 49.5 29C39 45 49.5 59.5 70 49.5Z'

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      data-theme-toggle
      className="theme-toggle-btn"
      aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} theme`}
      style={{ visibility: mounted ? 'visible' : 'hidden' }}
    >
      <m.svg
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        width={100}
        height={100}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="theme-toggle-icon"
      >
        <m.path
          variants={shineVariant}
          d={moonPath}
          initial="hidden"
          animate={currentTheme === 'dark' ? 'visible' : 'hidden'}
        />
        <m.g
          variants={raysVariants}
          initial="hidden"
          animate={currentTheme === 'light' ? 'visible' : 'hidden'}
          style={{ strokeLinecap: 'round' }}
        >
          <m.path variants={rayVariant} d="M50 2V11" />
          <m.path variants={rayVariant} d="M85 15L78 22" />
          <m.path variants={rayVariant} d="M98 50H89" />
          <m.path variants={rayVariant} d="M85 85L78 78" />
          <m.path variants={rayVariant} d="M50 98V89" />
          <m.path variants={rayVariant} d="M23 78L16 84" />
          <m.path variants={rayVariant} d="M11 50H2" />
          <m.path variants={rayVariant} d="M23 23L16 16" />
        </m.g>
        <m.path
          d={sunPath}
          fill="transparent"
          transition={{ duration: 1, type: 'spring' }}
          initial={{ fillOpacity: 0, strokeOpacity: 0, d: sunPath }}
          animate={{
            d: currentTheme === 'dark' ? moonPath : sunPath,
            rotate: currentTheme === 'dark' ? -360 : 0,
            scale: currentTheme === 'dark' ? 2 : 1,
            stroke: 'currentColor',
            fill: 'currentColor',
            fillOpacity: 0.35,
            strokeOpacity: 1,
            transition: { delay: 0.1 },
          }}
        />
      </m.svg>
    </Button>
  )
}
