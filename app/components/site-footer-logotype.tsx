'use client'

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react'

const VIEWBOX_WIDTH = 1410

export function SiteFooterLogotype() {
  const shouldReduceMotion = useReducedMotion()

  const gradientX1Raw = useMotionValue(0.5)
  const gradientX1 = useSpring(
    useTransform(gradientX1Raw, [0, 1], [0, VIEWBOX_WIDTH]),
    {
      stiffness: 150,
      damping: 25,
    }
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return
    const rect = event.currentTarget.getBoundingClientRect()
    gradientX1Raw.set((event.clientX - rect.left) / rect.width)
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    gradientX1Raw.set(0.5)
  }

  return (
    <div
      className="footer-logotype"
      aria-label="Onkar Sathe"
      role="img"
    >
      <div
        className="footer-logotype-clip"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="footer-logotype-crop">
          <svg
            className="footer-logotype-svg"
            viewBox="0 0 1410 258"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            {/* Fill layer — mouse-following shine */}
            <text
              x="705"
              y="218"
              textAnchor="middle"
              textLength="1360"
              lengthAdjust="spacingAndGlyphs"
              className="footer-logotype-text"
              fill="url(#onkar-footer-gradient)"
            >
              ONKAR SATHE
            </text>
            {/* Outline layer — subtle construction lines like original */}
            <text
              x="705"
              y="218"
              textAnchor="middle"
              textLength="1360"
              lengthAdjust="spacingAndGlyphs"
              className="footer-logotype-text"
              fill="none"
              stroke="var(--text)"
              strokeOpacity="0.14"
              strokeWidth="2"
            >
              ONKAR SATHE
            </text>
            <defs>
              <motion.linearGradient
                id="onkar-footer-gradient"
                x1={gradientX1}
                y1="1"
                x2="705"
                y2="257"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--text)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--text)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="footer-logotype-glow" aria-hidden />
    </div>
  )
}
