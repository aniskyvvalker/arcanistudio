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
export function ScrollGlow({ className, minHeight = 2, maxHeight = 14 }: ScrollGlowProps) {
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    // animate while the element travels through the lower half of the viewport
    offset: ['start end', 'end 60%'],
  })

  const height = useTransform(scrollYProgress, [0, 1], [`${minHeight}rem`, `${maxHeight}rem`])

  return (
    // Reserve maxHeight up front so the box above (logo ticker) never
    // shifts as the inner glow grows — the glow is pinned to the bottom
    // of this fixed-size box and grows upward into it.
    <div ref={container} className={className} style={{ width: '100%', height: `${maxHeight}rem`, position: 'relative' }}>
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height,
          // The full "sun" is a vertical color ramp (black base -> deep red ->
          // bright orange -> fade), then a dome-shaped mask clips it so the
          // WHOLE stack is tall at the horizontal center and tapers to a sliver
          // at the edges. Every band (red, orange, fade) follows the same arch,
          // not just the orange rim.
          backgroundImage:
            'linear-gradient(to top, #0A0A0A 0%, #0A0A0A 14%, #C73600 30%, #F94500 40%, #FF852F 50%, #FFB066 60%, rgba(255,176,102,0.4) 74%, rgba(255,176,102,0) 88%)',
          WebkitMaskImage:
            'radial-gradient(130% 100% at 50% 132%, #000 0%, #000 66%, rgba(0,0,0,0.6) 73%, rgba(0,0,0,0) 80%)',
          maskImage:
            'radial-gradient(130% 100% at 50% 132%, #000 0%, #000 66%, rgba(0,0,0,0.6) 73%, rgba(0,0,0,0) 80%)',
        }}
      />
    </div>
  )
}

export default ScrollGlow
