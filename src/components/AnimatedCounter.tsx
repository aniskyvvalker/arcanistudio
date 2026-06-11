import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type AnimatedCounterProps = {
  value: string
  className?: string
  duration?: number
}

export function AnimatedCounter({ value, className, duration = 4.5 }: AnimatedCounterProps) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : value
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView || !match) return
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    })
    return controls.stop
  }, [inView])

  return (
    <p ref={ref} className={className}>
      {match ? display.toFixed(decimals) : ''}
      {suffix}
    </p>
  )
}

export default AnimatedCounter
