import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { ui, defaultLang, type Lang } from '../i18n/ui'

type Word = { text: string; className: string }

function RevealWord({ word, index, total, progress }: { word: Word; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const end = start + 1 / total
  const opacity = useTransform(progress, [start, end], [0.12, 1])

  return (
    <motion.span style={{ opacity }} className={word.className}>
      {word.text}{' '}
    </motion.span>
  )
}

export function ScrollRevealText({ className, lang = defaultLang }: { className?: string; lang?: Lang }) {
  const container = useRef<HTMLDivElement>(null)

  const words: Word[] = ui[lang].about.segments.flatMap(({ text, className }) =>
    text
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, className })),
  )

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.85', 'end 0.65'],
  })

  return (
    <div ref={container} className={className}>
      <p className="text-[clamp(28px,3.2vw+12px,48px)] leading-[1.35]">
        {words.map((word, index) => (
          <RevealWord key={index} word={word} index={index} total={words.length} progress={scrollYProgress} />
        ))}
      </p>
    </div>
  )
}

export default ScrollRevealText
