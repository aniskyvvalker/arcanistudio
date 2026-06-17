'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 'copal-studio',
    name: 'Copal Studio',
    category: 'Design assets',
    description:
      'Product marketplace for designers. 200+ mockups, clean checkout, built for creative professionals in 12 countries.',
    image:
      'https://cdn.prod.website-files.com/6a106f5648dd0697c1e26edb/6a15b4ceb326bbd9624cacf7_Group%2074%20(1).png',
  },
  {
    id: 'pop-pop',
    name: 'POP POP Café',
    category: 'Café & boutique',
    description:
      'Bilingual brand site for a rotating café-boutique concept in Quebec. Playful, local, and never the same twice.',
    image:
      'https://cdn.prod.website-files.com/6a106f5648dd0697c1e26edb/6a180f51d2fd6310df0367c0_Group%2028%20(1)%201%20(1).png',
  },
  {
    id: 'upcycli',
    name: 'Upcycli',
    category: 'Sustainable fashion',
    description:
      'Quebec designers marketplace — 30+ independent brands, curated, conscious, and easy to shop.',
    image:
      'https://cdn.prod.website-files.com/6a106f5648dd0697c1e26edb/6a180bcc9db60d4ac58b8040_Group%202%20(8).png',
  },
  {
    id: 'maeve-june',
    name: 'Maeve in June',
    category: 'Hair salon',
    description:
      'Rebrand and booking site for a fashion-forward Montreal salon. Black, white, and unapologetically bold.',
    image:
      'https://cdn.prod.website-files.com/6a106f5648dd0697c1e26edb/6a180372ad7992cf1ffba5dc_Group%209%20(3).png',
  },
  {
    id: 'violette-mode',
    name: 'Violette Mode',
    category: 'Fashion boutique',
    description:
      'Full brand identity and e-commerce build for an independent Quebec fashion boutique — considered, editorial, built to last.',
    image:
      'https://cdn.prod.website-files.com/6a106f5648dd0697c1e26edb/6a180c1a411443935b1b48ad_Frame%206%20(2).png',
  },
  {
    id: 'cafe-buade',
    name: 'Café Buade',
    category: 'Fine dining',
    description:
      "Heritage restaurant in Quebec City's old quarter — tradition meets modern web. Reservation-first, image-led.",
    image:
      'https://cdn.prod.website-files.com/6a106f5648dd0697c1e26edb/6a16fc158eac902ef9312e0b_Group%2029.png',
  },
]

// ── LAYOUT OPTION B: Bento Grid ───────────────────────────────
// 3-column CSS grid, 3 rows. Cards have varying spans:
//   [0] Copal Studio  → col 1, rows 1-2  (tall left card)
//   [1] POP POP Café  → col 2, row 1
//   [2] Upcycli       → col 3, row 1
//   [3] Maeve in June → cols 2-3, row 2  (wide mid card)
//   [4] Violette Mode → col 1, row 3     (small bottom-left)
//   [5] Café Buade    → cols 2-3, row 3  (half-width bottom)
// To switch to Option A (flex rows), see the JSX block below.
// ──────────────────────────────────────────────────────────────

function DesktopCard({
  project,
  index,
  gridClass,
  reduced,
}: {
  project: (typeof PROJECTS)[number]
  index: number
  gridClass: string
  reduced: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.6, delay: index * 0.08, ease: [0.25, 0, 0, 1] }
      }
      className={`group relative overflow-hidden rounded-2xl ${gridClass}`}
    >
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-[1.04]"
      />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:-translate-y-12">
          <span className="text-[11px] uppercase tracking-wider text-white/50">
            {project.category}
          </span>
          <h3 className="font-clash text-[20px] font-medium leading-tight text-white">
            {project.name}
          </h3>
        </div>
        <p className="absolute bottom-5 left-5 right-14 line-clamp-2 translate-y-2 text-[12px] leading-relaxed text-white/65 opacity-0 transition-all delay-150 duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:translate-y-0 group-hover:opacity-100">
          {project.description}
        </p>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight size={15} strokeWidth={1.75} className="text-palette-950" />
        </div>
      </div>
    </motion.div>
  )
}

// Grid placement map — one entry per project (index matches PROJECTS order)
const BENTO: { gridClass: string }[] = [
  { gridClass: 'col-start-1 col-span-1 row-start-1 row-span-2' }, // [0] tall left, spans rows 1+2
  { gridClass: 'col-start-2 col-span-1 row-start-1 row-span-1' }, // [1] top-center
  { gridClass: 'col-start-3 col-span-1 row-start-1 row-span-1' }, // [2] top-right
  { gridClass: 'col-start-2 col-span-2 row-start-2 row-span-1' }, // [3] wide mid — cols 2+3
  { gridClass: 'col-start-1 col-span-1 row-start-3 row-span-1' }, // [4] small bottom-left
  { gridClass: 'col-start-2 col-span-2 row-start-3 row-span-1' }, // [5] half-width bottom — cols 2+3
]

// ── Card (mobile) ─────────────────────────────────────────────

function MobileCard({
  project,
  index,
  reduced,
}: {
  project: (typeof PROJECTS)[number]
  index: number
  reduced: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.6, delay: index * 0.06, ease: [0.25, 0, 0, 1] }
      }
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
    >
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] uppercase tracking-wider text-white/50">
            {project.category}
          </span>
          <h3 className="font-clash text-[20px] font-medium leading-tight text-white">
            {project.name}
          </h3>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
          <ArrowUpRight size={15} strokeWidth={1.75} className="text-palette-950" />
        </div>
      </div>
    </motion.div>
  )
}

// ── Section ───────────────────────────────────────────────────

export default function PortfolioSection() {
  const [seeAllHovered, setSeeAllHovered] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
    {/* ── Custom cursor ── */}
    {seeAllHovered && (
      <div
        className="pointer-events-none fixed z-50 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-600"
        style={{ left: cursor.x, top: cursor.y }}
      >
        <ArrowUpRight size={22} strokeWidth={1.5} className="text-white" />
      </div>
    )}
    <section className="bg-background-light pt-24 pb-12 md:pt-32 md:pb-16" aria-label="Selected work">
      <div className="mx-auto max-w-7xl px-5">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={
            reduced ? { duration: 0 } : { duration: 0.55, ease: [0.25, 0, 0, 1] }
          }
          className="mb-16 text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M12 1 C12.6 7 14 10.6 22 12 C14 13.4 12.6 17 12 23 C11.4 17 10 13.4 2 12 C10 10.6 11.4 7 12 1 Z" fill="#F94500" />
            </svg>
            <p className="text-tooltip-l font-regular uppercase text-primary-600">Selected work</p>
          </div>
          <h2
            className="font-sans text-[clamp(36px,5.5vw,72px)] font-medium leading-[1.08] text-palette-950"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Clients we built for,<br />
            <em className="font-reckless font-light not-italic text-primary-600">
              work that held up.
            </em>
          </h2>
        </motion.div>

        {/*
         * ── LAYOUT OPTION B: Bento Grid (currently active) ──────────
         * 3 cols × 3 rows. Row heights: 340px / 340px / 260px.
         * Card 0 is tall (row-span-2). Cards 3 and 5 are wide (col-span-2).
         * To switch to Option A (equal flex rows), comment this block out
         * and uncomment the Option A block below.
         * ─────────────────────────────────────────────────────────────
         */}
        <div
          className="hidden md:grid gap-4"
          style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '340px 340px 260px' }}
        >
          {PROJECTS.map((project, i) => (
            <DesktopCard
              key={project.id}
              project={project}
              index={i}
              gridClass={BENTO[i].gridClass}
              reduced={reduced}
            />
          ))}
        </div>

        {/*
         * ── LAYOUT OPTION A: Equal Flex Rows (currently inactive) ───
         * Two rows of 3 cards each, equal width, with expanding hover.
         * Cards expand on hover via flex transition.
         * To activate: uncomment this block, comment out Option B above.
         *
         * <div className="hidden flex-col gap-4 md:flex">
         *   {[PROJECTS.slice(0, 3), PROJECTS.slice(3, 6)].map((row, rowIdx) => (
         *     <div key={rowIdx} className="flex h-[460px] gap-4">
         *       {row.map((project, i) => (
         *         <DesktopCard
         *           key={project.id}
         *           project={project}
         *           index={rowIdx * 3 + i}
         *           gridClass=""
         *           reduced={reduced}
         *         />
         *       ))}
         *     </div>
         *   ))}
         * </div>
         * ─────────────────────────────────────────────────────────────
         */}

        {/* ── Mobile: stacked grid ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
          {PROJECTS.map((project, i) => (
            <MobileCard key={project.id} project={project} index={i} reduced={reduced} />
          ))}
        </div>

        {/* ── See all projects ── */}
        <a
          href="/work"
          className="group mt-28 hidden md:inline-flex xl:-ml-14 flex-col cursor-none"
          onMouseEnter={() => setSeeAllHovered(true)}
          onMouseLeave={() => setSeeAllHovered(false)}
        >
          <div className="inline-flex flex-col">
            <span className="font-sans text-[clamp(40px,8vw,120px)] font-medium leading-none text-palette-950">
              See all projects
            </span>
            <div className="relative mt-4 h-[6px] w-full bg-palette-950/20">
              <span className="absolute inset-0 origin-left scale-x-0 bg-palette-950 transition-transform duration-500 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-x-100" />
            </div>
          </div>
        </a>

      </div>
    </section>
    </>
  )
}
