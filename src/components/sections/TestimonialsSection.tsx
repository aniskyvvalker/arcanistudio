'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const TESTIMONIALS = [
  {
    quote:
      "They spent two weeks understanding why our funnel was broken before touching a single screen. What came out of it was something we couldn't have arrived at alone.",
    author: 'Sofia R.',
  },
  {
    quote:
      'The site they built for us books more appointments in a week than our old one did in a month. It just works.',
    author: 'James M.',
  },
  {
    quote:
      "We've worked with agencies that hand you a design and disappear. arcaniStudio stayed in it, QA, launch, the first round of real-user feedback. That's rare.",
    author: 'Camille T.',
  },
  {
    quote:
      "arcaniStudio pushed back on our brief because they'd spotted something we missed. That one conversation changed the direction of the whole product.",
    author: 'Marcus O.',
  },
]

function Pip() {
  return (
    <div className="flex h-full shrink-0 items-start pt-[0.45em]" aria-hidden="true">
      <div className="h-[6px] w-[6px] rounded-full bg-primary-500 opacity-70" />
    </div>
  )
}

function MarqueeRow({
  items,
  reverse,
  reduced,
}: {
  items: (typeof TESTIMONIALS)[number][]
  reverse: boolean
  reduced: boolean | null
}) {
  const doubled = [...items, ...items]
  const anim = reverse ? 'testimonial-scroll-reverse' : 'testimonial-scroll'

  return (
    <div
      role="list"
      data-marquee-row
      className="flex gap-10"
      style={{
        width: 'max-content',
        animation: reduced ? 'none' : `${anim} 52s linear infinite`,
        animationPlayState: 'paused',
      }}
      onMouseEnter={(e) => {
        if (!reduced) e.currentTarget.style.animationPlayState = 'paused'
      }}
      onMouseLeave={(e) => {
        if (!reduced) e.currentTarget.style.animationPlayState = 'running'
      }}
      onTouchStart={(e) => {
        if (!reduced) e.currentTarget.style.animationPlayState = 'paused'
      }}
      onTouchEnd={(e) => {
        if (!reduced) e.currentTarget.style.animationPlayState = 'running'
      }}
    >
      {doubled.map((t, i) => (
        <article
          key={i}
          role="listitem"
          className="flex shrink-0 items-start gap-4"
          style={{ width: 'min(320px, 74vw)' }}
          aria-label={`Testimonial from ${t.author}`}
        >
          <Pip />
          <div className="flex flex-col gap-3">
            <blockquote
              className="font-reckless text-[clamp(14px,1.55vw,19px)] font-light italic leading-[1.6] text-white/75"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              {t.quote}
            </blockquote>
            <footer>
              <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-white/28">
                {t.author}
              </span>
            </footer>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (reduced) return
    const el = sectionRef.current
    if (!el) return

    const rows = el.querySelectorAll<HTMLDivElement>('[data-marquee-row]')

    const observer = new IntersectionObserver(
      ([entry]) => {
        rows.forEach((row) => {
          row.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
        })
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  const row1 = TESTIMONIALS
  const row2 = [...TESTIMONIALS].reverse()

  return (
    <section ref={sectionRef} className="relative bg-palette-950" aria-label="Client testimonials">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
        <div className="mb-4 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 1 C12.6 7 14 10.6 22 12 C14 13.4 12.6 17 12 23 C11.4 17 10 13.4 2 12 C10 10.6 11.4 7 12 1 Z" fill="#F94500" />
          </svg>
          <p className="font-sans text-tooltip-l font-regular uppercase text-primary-600">Client voices</p>
        </div>
        <h2
          className="font-reckless text-[clamp(28px,3.5vw,52px)] font-light italic leading-[1.15] text-white"
          style={{ textWrap: 'balance' } as React.CSSProperties}
        >
          Straight from the people<br className="hidden md:block" /> we built for.
        </h2>
      </div>

      <div className="relative overflow-hidden pb-12 md:pb-16">
        {/* Left fade */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 md:w-24"
          style={{ background: 'linear-gradient(to right, #0A0A0A, transparent)' }}
        />
        {/* Right fade */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 md:w-24"
          style={{ background: 'linear-gradient(to left, #0A0A0A, transparent)' }}
        />

        <div className="flex flex-col gap-8">
          <MarqueeRow items={row1} reverse={false} reduced={reduced} />
          <MarqueeRow items={row2} reverse={true} reduced={reduced} />
        </div>
      </div>

      <style>{`
        @keyframes testimonial-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes testimonial-scroll-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="border-t border-white/10" />
      </div>
    </section>
  )
}

/*
// ============================================================
// TESTIMONIALS v3 — 2×2 typographic hover grid (no roles)
// ============================================================

'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const TESTIMONIALS = [
  { quote: "They spent two weeks understanding why our funnel was broken before touching a single screen. What came out of it was something we couldn't have arrived at alone.", author: 'Sofia R.', color: '#FF6207' },
  { quote: "The site they built for us books more appointments in a week than our old one did in a month. It just works.", author: 'James M.', color: '#FAAF01' },
  { quote: "We've worked with agencies that hand you a design and disappear. arcaniStudio stayed in it — QA, launch, the first round of real-user feedback. That's rare.", author: 'Camille T.', color: '#CE3000' },
  { quote: "arcaniStudio pushed back on our brief because they'd spotted something we missed. That one conversation changed the direction of the whole product.", author: 'Marcus O.', color: '#6308E2' },
]

export default function TestimonialsSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const reduced = useReducedMotion()
  return (
    <section className="relative bg-palette-950" aria-label="Client testimonials">
      <div className="mx-auto max-w-7xl px-5 md:px-10"><div className="border-t border-white/10" /></div>
      <div className="mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-32">
        <div className="grid grid-cols-1 gap-px bg-white/10 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => {
            const isActive = hovered === null || hovered === i
            return (
              <motion.article key={i} onHoverStart={() => setHovered(i)} onHoverEnd={() => setHovered(null)} animate={reduced ? {} : { opacity: isActive ? 1 : 0.12 }} transition={{ duration: 0.3, ease: [0.25, 0, 0, 1] }} className="group flex cursor-default flex-col justify-between gap-10 bg-palette-950 p-8 md:p-12" style={{ minHeight: i === 1 ? '280px' : i === 2 ? '320px' : '260px' }}>
                <blockquote className="font-reckless font-light italic leading-[1.5] text-white" style={{ fontSize: i === 1 ? 'clamp(22px, 2.8vw, 40px)' : i === 2 ? 'clamp(18px, 2vw, 30px)' : 'clamp(16px, 1.7vw, 26px)', textWrap: 'pretty' } as React.CSSProperties}>{t.quote}</blockquote>
                <footer className="flex items-center gap-3"><div className="h-px w-6 shrink-0 transition-all duration-500 group-hover:w-10" style={{ backgroundColor: t.color }} /><span className="font-sans text-[13px] font-medium text-white/35 transition-colors duration-300 group-hover:text-white/60">{t.author}</span></footer>
              </motion.article>
            )
          })}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-10"><div className="border-t border-white/10" /></div>
    </section>
  )
}
*/

/*
// ============================================================
// TESTIMONIALS v2 — split layout (left numbered list / right quote)
// ============================================================

'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const TESTIMONIALS = [
  { quote: "They spent two weeks understanding why our funnel was broken before touching a single screen. What came out of it was something we couldn't have arrived at alone.", author: 'Sofia Reyes', role: 'Co-founder, Helix Analytics', color: '#FF6207', idx: '01' },
  { quote: "arcaniStudio pushed back on our brief because they'd spotted something we missed. That one conversation changed the direction of the whole product.", author: 'Marcus Olatunji', role: 'Head of Product, Vault', color: '#6308E2', idx: '02' },
  { quote: "We've worked with agencies that hand you a design and disappear. arcaniStudio stayed in it — QA, launch, the first round of real-user feedback. That's rare.", author: 'Camille Tran', role: 'CEO, Upcycli', color: '#CE3000', idx: '03' },
  { quote: "The site they built for us books more appointments in a week than our old one did in a month. It just works.", author: 'James Moreau', role: 'Owner, J&J Barbershop', color: '#FAAF01', idx: '04' },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  const t = TESTIMONIALS[active]
  return (
    <section className="relative bg-palette-950" aria-label="Client testimonials">
      <div className="mx-auto max-w-7xl px-5 md:px-10"><div className="border-t border-white/10" /></div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 px-5 py-20 md:grid-cols-[1fr_1.6fr] md:gap-20 md:px-10 md:py-32">
        <div className="flex flex-col">
          {TESTIMONIALS.map((item, i) => (
            <button key={i} onClick={() => setActive(i)} className="group relative flex items-start gap-5 border-t border-white/10 py-6 text-left last:border-b last:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" aria-pressed={i === active}>
              <span className="font-clash mt-0.5 shrink-0 text-[12px] font-medium tabular-nums transition-colors duration-300" style={{ color: i === active ? '#FF6207' : 'rgba(255,255,255,0.18)' }}>{item.idx}</span>
              <div className="flex flex-1 flex-col gap-1">
                <span className="font-sans text-[15px] font-medium leading-snug transition-colors duration-300" style={{ color: i === active ? '#ffffff' : 'rgba(255,255,255,0.28)' }}>{item.author}</span>
                <span className="text-[13px] leading-snug transition-colors duration-300" style={{ color: i === active ? 'rgba(255,255,255,0.42)' : 'rgba(255,255,255,0.14)' }}>{item.role}</span>
              </div>
              {i === active && <motion.div layoutId="active-pip" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" transition={{ duration: 0.35, ease: [0.25, 0, 0, 1] }} />}
            </button>
          ))}
        </div>
        <div className="relative flex flex-col justify-center pt-12 md:pt-0">
          <span className="font-reckless pointer-events-none absolute -top-8 right-0 select-none text-[180px] leading-none text-white/[0.035] md:-top-12 md:text-[260px]" aria-hidden="true">&ldquo;</span>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? false : { opacity: 0, y: -16 }} transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col gap-10">
              <blockquote className="font-reckless text-[clamp(20px,2.6vw,42px)] font-light italic leading-[1.45] text-white" style={{ textWrap: 'pretty' } as React.CSSProperties}>{t.quote}</blockquote>
              <footer className="flex items-center gap-4"><div className="h-px w-8 shrink-0 transition-colors duration-300" style={{ backgroundColor: t.color }} /><div className="flex flex-col gap-0.5"><span className="font-sans text-[14px] font-medium text-white">{t.author}</span><span className="text-[12px] text-white/38">{t.role}</span></div></footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-10"><div className="border-t border-white/10" /></div>
    </section>
  )
}
*/

/*
// ============================================================
// TESTIMONIALS v1 — centered carousel with arrows (original)
// ============================================================

'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const TESTIMONIALS = [
  { quote: 'They spent two weeks understanding why our funnel was broken before touching a single screen. What came out of it was something we couldn\'t have arrived at alone.', author: 'Sofia Reyes', role: 'Co-founder, Helix Analytics', initials: 'SR', color: '#FF6207' },
  { quote: 'arcaniStudio pushed back on our brief because they\'d spotted something we missed. That one conversation changed the direction of the whole product.', author: 'Marcus Olatunji', role: 'Head of Product, Vault', initials: 'MO', color: '#6308E2' },
  { quote: 'We\'ve worked with agencies that hand you a design and disappear. arcaniStudio stayed in it — QA, launch, the first round of real-user feedback. That\'s rare.', author: 'Camille Tran', role: 'CEO, Upcycli', initials: 'CT', color: '#CE3000' },
  { quote: 'The site they built for us books more appointments in a week than our old one did in a month. It just works.', author: 'James Moreau', role: 'Owner, J&J Barbershop', initials: 'JM', color: '#FAAF01' },
]

type Direction = 1 | -1
const variants = { enter: (d: Direction) => ({ x: d > 0 ? 60 : -60, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: Direction) => ({ x: d > 0 ? -60 : 60, opacity: 0 }) }

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>(1)
  const reduced = useReducedMotion()
  const go = useCallback((dir: Direction) => { setDirection(dir); setIndex((p) => (p + dir + TESTIMONIALS.length) % TESTIMONIALS.length) }, [])
  const t = TESTIMONIALS[index]
  return (
    <section className="relative bg-palette-950 py-0" aria-label="Client testimonials">
      <div className="mx-auto max-w-7xl px-5"><div className="border-t border-white/10" /></div>
      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-20 py-24 md:px-32">
        <button onClick={() => go(-1)} aria-label="Previous testimonial" className="absolute left-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:left-8"><ArrowLeft size={16} strokeWidth={1.5} /></button>
        <button onClick={() => go(1)} aria-label="Next testimonial" className="absolute right-5 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 md:right-8"><ArrowRight size={16} strokeWidth={1.5} /></button>
        <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={index} custom={direction} variants={reduced ? {} : variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.38, ease: [0.25, 0, 0, 1] }} className="flex flex-col items-center gap-8">
              <blockquote className="font-reckless-book text-[clamp(18px,2.2vw,26px)] font-light italic leading-[1.55] text-white/85" style={{ textWrap: 'pretty' } as React.CSSProperties}>&ldquo;{t.quote}&rdquo;</blockquote>
              <footer className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-semibold text-white" style={{ background: `linear-gradient(135deg, ${t.color}cc 0%, ${t.color}66 100%)` }} aria-hidden="true">{t.initials}</div>
                <div><p className="text-[15px] font-medium text-white">{t.author}</p><p className="text-[13px] text-white/40">{t.role}</p></div>
              </footer>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2" role="tablist">{TESTIMONIALS.map((_, i) => <button key={i} role="tab" aria-selected={i === index} aria-label={`Go to testimonial ${i + 1}`} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }} className="h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" style={{ width: i === index ? '24px' : '8px', backgroundColor: i === index ? '#FF6207' : 'rgba(255,255,255,0.18)' }} />)}</div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5"><div className="border-t border-white/10" /></div>
    </section>
  )
}
*/
