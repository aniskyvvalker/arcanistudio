import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

type ScrollGlowProps = {
  className?: string
  /** collapsed height in rem */
  minHeight?: number
  /** expanded height in rem */
  maxHeight?: number
}

/**
 * Orange "horizon" glow that rises from the bottom of its container.
 * Height interpolates from minHeight -> maxHeight as the element scrolls
 * into view, mimicking the Framer ScrollGradient asset.
 */
export function ScrollGlow({ className, minHeight = 4, maxHeight = 14 }: ScrollGlowProps) {
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    // animate while the element travels through the lower half of the viewport
    offset: ['start end', 'end 60%'],
  })

  const height = useTransform(scrollYProgress, [0, 1], [`${minHeight}rem`, `${maxHeight}rem`])

  return (
    <div ref={container} className={className} style={{ width: '100%' }}>
      <motion.div
        aria-hidden="true"
        style={{
          width: '100%',
          height,
          background:
            'radial-gradient(120% 100% at 50% 135%, #0A0A0A 0%, #0A0A0A 58%, #F94500 66%, #FF852F 70%, rgba(255,133,47,0.25) 78%, transparent 88%)',
        }}
      />
    </div>
  )
}

export default ScrollGlow
