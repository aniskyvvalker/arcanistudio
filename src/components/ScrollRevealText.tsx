import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

type Segment = {
  text: string
  className: string
}

/* Previous segments (alt copy):
const segments: Segment[] = [
  { text: "A website isn't a deliverable.", className: 'font-semibold text-white' },
  { text: " It's the first conversation your product has with the world.", className: 'font-reckless italic font-light text-white' },
  { text: ' Every pixel either earns trust or costs it.', className: 'font-semibold text-white' },
  { text: ' arcaniStudio', className: 'font-clash font-medium text-primary-600 text-[1.3em] mr-[0.05em]' },
  { text: ' exists for', className: 'font-semibold text-white' },
  { text: ' founders and product teams who refuse the generic agency look — and want their site to carry the same craft, the same precision, as the product they spent years building.', className: 'font-semibold text-white' },
]
*/

const segments: Segment[] = [
  {
    text: "A brand isn't a logo.",
    className: 'font-semibold text-white',
  },
  {
    text: " It's the first conversation your product has with the world.",
    className: 'font-reckless italic font-light text-white',
  },
  {
    text: " A voice you recognize through the noise. A standard you don't renegotiate.",
    className: 'font-semibold text-white',
  },
  {
    text: ' Every pixel either earns trust or costs it.',
    className: 'font-semibold text-white',
  },
  {
    text: ' arcaniStudio',
    className: 'font-clash font-medium text-primary-600 text-[1.3em] mr-[0.05em]',
  },
  {
    text: ' exists for founders who refuse average — and who want their digital presence to hold the same standard as their product.',
    className: 'font-semibold text-white',
  },
]

type Word = { text: string; className: string }

const words: Word[] = segments.flatMap(({ text, className }) =>
  text
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => ({ text, className })),
)

function RevealWord({ word, index, progress }: { word: Word; index: number; progress: MotionValue<number> }) {
  const start = index / words.length
  const end = start + 1 / words.length
  const opacity = useTransform(progress, [start, end], [0.12, 1])

  return (
    <motion.span style={{ opacity }} className={word.className}>
      {word.text}{' '}
    </motion.span>
  )
}

export function ScrollRevealText({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.85', 'end 0.65'],
  })

  return (
    <div ref={container} className={className}>
      <p className="text-[clamp(28px,3.2vw+12px,48px)] leading-[1.35]">
        {words.map((word, index) => (
          <RevealWord key={index} word={word} index={index} progress={scrollYProgress} />
        ))}
      </p>
    </div>
  )
}

export default ScrollRevealText
