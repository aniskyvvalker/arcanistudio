'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      'They spent two weeks understanding why our funnel was broken before touching a single screen. What came out of it was something we couldn\'t have arrived at alone.',
    author: 'Sofia Reyes',
    role: 'Co-founder, Helix Analytics',
    initials: 'SR',
    color: '#FF6207',
  },
  {
    quote:
      'arcaniStudio pushed back on our brief because they\'d spotted something we missed. That one conversation changed the direction of the whole product.',
    author: 'Marcus Olatunji',
    role: 'Head of Product, Vault',
    initials: 'MO',
    color: '#6308E2',
  },
  {
    quote:
      'We\'ve worked with agencies that hand you a design and disappear. arcaniStudio stayed in it — QA, launch, the first round of real-user feedback. That\'s rare.',
    author: 'Camille Tran',
    role: 'CEO, Upcycli',
    initials: 'CT',
    color: '#CE3000',
  },
  {
    quote:
      'The site they built for us books more appointments in a week than our old one did in a month. It just works.',
    author: 'James Moreau',
    role: 'Owner, J&J Barbershop',
    initials: 'JM',
    color: '#FAAF01',
  },
]

type Direction = 1 | -1

const variants = {
  enter: (dir: Direction) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: Direction) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
  }),
}

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>(1)
  const reduced = useReducedMotion()

  const go = useCallback(
    (dir: Direction) => {
      setDirection(dir)
      setIndex((prev) => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length)
    },
    []
  )

  const t = TESTIMONIALS[index]

  return (
    <section
      className="relative bg-palette-950 py-0"
      aria-label="Client testimonials"
    >
      {/* Top border */}
      <div className="mx-auto max-w-7xl px-5">
        <div className="border-t border-white/10" />
      </div>

      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-20 py-24 md:px-32">

        {/* Left arrow */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="absolute left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:left-8"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="absolute right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors duration-200 hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:right-8"
        >
          <ArrowRight size={16} strokeWidth={1.5} />
        </button>

        {/* Content */}
        <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={reduced ? {} : variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.25, 0, 0, 1] }}
              className="flex flex-col items-center gap-8"
            >
              {/* Quote */}
              <blockquote
                className="font-reckless-book text-[clamp(18px,2.2vw,26px)] font-light italic leading-[1.55] text-white/85"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Avatar + attribution */}
              <footer className="flex flex-col items-center gap-3">
                {/* Avatar circle */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                  style={{ background: `linear-gradient(135deg, ${t.color}cc 0%, ${t.color}66 100%)` }}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>

                <div>
                  <p className="text-[15px] font-medium text-white">{t.author}</p>
                  <p className="text-[13px] text-white/40">{t.role}</p>
                </div>
              </footer>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex gap-2" role="tablist" aria-label="Testimonial pagination">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1)
                  setIndex(i)
                }}
                className="h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                style={{
                  width: i === index ? '24px' : '8px',
                  backgroundColor:
                    i === index ? '#FF6207' : 'rgba(255,255,255,0.18)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="mx-auto max-w-7xl px-5">
        <div className="border-t border-white/10" />
      </div>
    </section>
  )
}
