'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 'violette-mode',
    name: 'Violette Mode',
    category: 'Fashion boutique',
    description:
      'Full brand identity and e-commerce build for an independent Quebec fashion boutique — considered, editorial, built to last.',
    image: '/images/portfolio/violette-mode.webp',
  },
  {
    id: 'pop-pop',
    name: 'POP POP Café',
    category: 'Café & boutique',
    description:
      'Bilingual brand site for a rotating café-boutique concept in Quebec. Playful, local, and never the same twice.',
    image: '/images/portfolio/pop-pop.webp',
  },
  {
    id: 'cafe-buade',
    name: 'Café Buade',
    category: 'Fine dining',
    description:
      "Heritage restaurant in Quebec City's old quarter — tradition meets modern web. Reservation-first, image-led.",
    image: '/images/portfolio/cafe-buade.webp',
  },
  {
    id: 'maeve-june',
    name: 'Maeve in June',
    category: 'Hair salon',
    description:
      'Rebrand and booking site for a fashion-forward Montreal salon. Black, white, and unapologetically bold.',
    image: '/images/portfolio/maeve-june.webp',
  },
  {
    id: 'upcycli',
    name: 'Upcycli',
    category: 'Sustainable fashion',
    description:
      'Quebec designers marketplace — 30+ independent brands, curated, conscious, and easy to shop.',
    image: '/images/portfolio/upcycli.webp',
  },
  {
    id: 'copal-studio',
    name: 'Copal Studio',
    category: 'Design assets',
    description:
      'Product marketplace for designers. 200+ mockups, clean checkout, built for creative professionals in 12 countries.',
    image: '/images/portfolio/copal-studio.webp',
  },
]

const ROWS = [PROJECTS.slice(0, 3), PROJECTS.slice(3, 6)]
const TABLET_ROWS = [PROJECTS.slice(0, 2), PROJECTS.slice(2, 4), PROJECTS.slice(4, 6)]

// ── LAYOUT OPTION A: Equal Flex Rows (currently active) ───────
// Two rows of 3 cards each. Cards expand on hover via flex
// transition — hovered card grows, others shrink slightly.
// ──────────────────────────────────────────────────────────────

function DesktopCard({
  project,
  index,
  isHovered,
  anyHovered,
  onEnter,
  onLeave,
  reduced,
}: {
  project: (typeof PROJECTS)[number]
  index: number
  isHovered: boolean
  anyHovered: boolean
  onEnter: () => void
  onLeave: () => void
  reduced: boolean | null
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [touched, setTouched] = useState(false)

  const active = isHovered || touched
  const flexValue = anyHovered ? (isHovered ? 1.18 : 0.91) : 1

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
      style={{
        flex: flexValue,
        // Kept under 1s — flex transitions run on CPU (not GPU), longer = more fan noise
        transition: reduced ? 'none' : 'flex 0.7s cubic-bezier(0.25, 0, 0, 1)',
        minWidth: 0,
      }}
      className="group relative overflow-hidden rounded-2xl"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={() => { setTouched(t => !t); onLeave() }}
    >
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-[1.04]"
        style={{ transform: active ? 'scale(1.04)' : undefined }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Bottom bar */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
        <div
          className="flex min-w-0 flex-1 flex-col gap-0.5 transition-transform duration-[1100ms] ease-[cubic-bezier(0.25,0,0,1)] group-hover:-translate-y-2"
          style={{ transform: active ? 'translateY(-3rem)' : undefined }}
        >
          <span className="text-[11px] uppercase tracking-wider text-white/50">
            {project.category}
          </span>
          <h3 className="font-clash text-[20px] font-medium leading-tight text-white">
            {project.name}
          </h3>
        </div>
        <p
          className="absolute bottom-3 left-5 right-14 line-clamp-2 translate-y-8 text-[12px] leading-relaxed text-white/65 opacity-0 transition-all delay-150 duration-[1100ms] ease-[cubic-bezier(0.25,0,0,1)] group-hover:-translate-y-2 group-hover:opacity-100"
          style={active ? { transform: 'translateY(-0.5rem)', opacity: 1 } : undefined}
        >
          {project.description}
        </p>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          style={active ? { transform: 'translateY(-0.125rem) translateX(0.125rem)' } : undefined}
        >
          <ArrowUpRight size={15} strokeWidth={1.75} className="text-palette-950" />
        </div>
      </div>
    </motion.div>
  )
}

// ── LAYOUT OPTION B1: Bento Grid (commented out) ──────────────
// 3-col CSS grid, 3 rows (340 / 340 / 260px).
//   [0] tall left (row-span-2) · [1][2] top row · [3][4] mid row
//   [5] full-width panoramic strip
//
// To restore: uncomment BentoCard + the desktop bento <div> below,
// comment out Option A DesktopCard + ROWS + the flex desktop <div>.
//
// PROJECTS order for bento:
//   0: Copal Studio, 1: POP POP, 2: Violette Mode
//   3: Maeve in June, 4: Upcycli, 5: Café Buade
//
// const BENTO: { gridClass: string }[] = [
//   { gridClass: 'col-start-1 col-span-1 row-start-1 row-span-2' },
//   { gridClass: 'col-start-2 col-span-1 row-start-1 row-span-1' },
//   { gridClass: 'col-start-3 col-span-1 row-start-1 row-span-1' },
//   { gridClass: 'col-start-2 col-span-1 row-start-2 row-span-1' },
//   { gridClass: 'col-start-3 col-span-1 row-start-2 row-span-1' },
//   { gridClass: 'col-start-1 col-span-3 row-start-3 row-span-1' },
// ]
//
// function BentoCard({ project, index, gridClass, reduced }) {
//   const ref = useRef(null)
//   const inView = useInView(ref, { once: true, margin: '-60px' })
//   const [touched, setTouched] = useState(false)
//   const active = touched
//   return (
//     <motion.div ref={ref} initial={{ opacity: 0, y: 40 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={reduced ? { duration: 0 } : { duration: 0.6, delay: index * 0.08, ease: [0.25, 0, 0, 1] }}
//       className={`group relative overflow-hidden rounded-2xl ${gridClass}`}
//       onTouchStart={() => { setTouched(t => !t); onLeave() }}
//     >
//       <img src={project.image} alt={project.name} loading="lazy" decoding="async"
//         className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-[1.04]"
//         style={{ transform: active ? 'scale(1.04)' : undefined }} />
//       <div className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
//       <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
//         <div className="flex min-w-0 flex-1 flex-col gap-0.5 transition-transform duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:-translate-y-2"
//           style={{ transform: active ? 'translateY(-3rem)' : undefined }}>
//           <span className="text-[11px] uppercase tracking-wider text-white/50">{project.category}</span>
//           <h3 className="font-clash text-[20px] font-medium leading-tight text-white">{project.name}</h3>
//         </div>
//         <p className="absolute bottom-5 left-5 right-14 line-clamp-2 translate-y-2 text-[12px] leading-relaxed text-white/65 opacity-0 transition-all delay-150 duration-700 ease-[cubic-bezier(0.25,0,0,1)] group-hover:translate-y-0 group-hover:opacity-100"
//           style={active ? { transform: 'translateY(0)', opacity: 1 } : undefined}>
//           {project.description}
//         </p>
//         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
//           style={active ? { transform: 'translateY(-0.125rem) translateX(0.125rem)' } : undefined}>
//           <ArrowUpRight size={15} strokeWidth={1.75} className="text-palette-950" />
//         </div>
//       </div>
//     </motion.div>
//   )
// }
// ──────────────────────────────────────────────────────────────

// ── LAYOUT OPTION B2: Bento Grid variant (commented out) ──────
// 3-col CSS grid, 3 rows (340 / 340 / 260px).
//   [0] tall left (row-span-2) · [1][2] top row
//   [3] wide mid (col-span-2) · [4] small bottom-left
//   [5] half-width bottom (col-span-2)
// Differs from B1: row 2 has wide card spanning cols 2+3,
// and bottom row has a small card + half-width card instead of panoramic.
//
// PROJECTS order same as B1:
//   0: Copal Studio, 1: POP POP, 2: Violette Mode
//   3: Maeve in June, 4: Upcycli, 5: Café Buade
//
// const BENTO_B2: { gridClass: string }[] = [
//   { gridClass: 'col-start-1 col-span-1 row-start-1 row-span-2' }, // tall left
//   { gridClass: 'col-start-2 col-span-1 row-start-1 row-span-1' }, // top-center
//   { gridClass: 'col-start-3 col-span-1 row-start-1 row-span-1' }, // top-right
//   { gridClass: 'col-start-2 col-span-2 row-start-2 row-span-1' }, // wide mid (cols 2+3)
//   { gridClass: 'col-start-1 col-span-1 row-start-3 row-span-1' }, // small bottom-left
//   { gridClass: 'col-start-2 col-span-2 row-start-3 row-span-1' }, // half-width bottom (cols 2+3)
// ]
//
// Render block (replace Option A desktop divs):
// <div className="hidden md:grid gap-4"
//   style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '340px 340px 260px' }}>
//   {PROJECTS_BENTO.map((project, i) => (
//     <BentoCard key={project.id} project={project} index={i} gridClass={BENTO_B2[i].gridClass} reduced={reduced} />
//   ))}
// </div>
// ──────────────────────────────────────────────────────────────

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
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [seeAllHovered, setSeeAllHovered] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!seeAllHovered) return
    const move = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [seeAllHovered])

  return (
    <>
      {/* Custom cursor for "See all projects" hover */}
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
                {/* work that held up. */}
              work we're proud of.
              </em>
            </h2>
          </motion.div>

          {/* ── Tablet: 640–767px — 2-col flex rows with expanding touch/hover ── */}
          <div className="hidden sm:flex md:hidden flex-col gap-4">
            {TABLET_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex h-[380px] gap-4">
                {row.map((project, i) => (
                  <DesktopCard
                    key={project.id}
                    project={project}
                    index={rowIdx * 2 + i}
                    isHovered={hoveredId === project.id}
                    anyHovered={hoveredId !== null}
                    onEnter={() => setHoveredId(project.id)}
                    onLeave={() => setHoveredId(null)}
                    reduced={reduced}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* ── Tablet: "See all projects" button ── */}
          <a
            href="/work"
            className="mt-6 w-full hidden sm:flex md:hidden items-center justify-center gap-2 rounded-full border border-palette-950/20 py-3.5 text-[13px] font-medium uppercase tracking-wider text-palette-950 transition-colors duration-200 hover:border-palette-950/50"
          >
            See all projects
            <ArrowUpRight size={14} strokeWidth={2} />
          </a>

          {/* ── Desktop: Option A — equal flex rows with expanding hover ── */}
          <div className="hidden flex-col gap-4 md:flex">
            {ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex h-[460px] gap-4">
                {row.map((project, i) => (
                  <DesktopCard
                    key={project.id}
                    project={project}
                    index={rowIdx * 3 + i}
                    isHovered={hoveredId === project.id}
                    anyHovered={hoveredId !== null}
                    onEnter={() => setHoveredId(project.id)}
                    onLeave={() => setHoveredId(null)}
                    reduced={reduced}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* ── Desktop: Option B1 — Bento Grid (commented out) ──
          <div className="hidden md:grid gap-4"
            style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '340px 340px 260px' }}>
            {PROJECTS_BENTO.map((project, i) => (
              <BentoCard key={project.id} project={project} index={i} gridClass={BENTO[i].gridClass} reduced={reduced} />
            ))}
          </div>
          ── */}

          {/* ── Mobile: stacked grid ── */}
          {/* TODO: behavior inconsistency — mobile expands in-place while tablet links to /work.
              Decide on one pattern: either both expand or both link. */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {PROJECTS.slice(0, 3).map((project, i) => (
              <MobileCard key={project.id} project={project} index={i} reduced={reduced} />
            ))}
            <motion.div
              initial={false}
              animate={mobileExpanded ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.5, ease: [0.25, 0, 0, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="grid grid-cols-1 gap-4 pt-4">
                {PROJECTS.slice(3).map((project, i) => (
                  <MobileCard key={project.id} project={project} index={3 + i} reduced={reduced} />
                ))}
              </div>
            </motion.div>
          </div>
          {!mobileExpanded && (
            <button
              onClick={() => setMobileExpanded(true)}
              className="mt-6 w-full sm:hidden flex items-center justify-center gap-2 rounded-full border border-palette-950/20 py-3.5 text-[13px] font-medium uppercase tracking-wider text-palette-950 transition-colors duration-200 hover:border-palette-950/50"
            >
              See all projects
              <ArrowUpRight size={14} strokeWidth={2} />
            </button>
          )}

          {/* ── See all projects ── */}
          <a
            href="/work"
            className="group mt-28 hidden md:inline-flex xl:-ml-14 flex-col cursor-none"
            onMouseEnter={() => setSeeAllHovered(true)}
            onMouseLeave={() => setSeeAllHovered(false)}
          >
            <div className="inline-flex flex-col">
              <span className="font-sans text-[clamp(40px,8vw,120px)] font-medium leading-tight text-palette-950">
                See all projects
              </span>
              <div className="relative mt-2 h-[8px] w-full bg-palette-950/20">
                <span className="absolute inset-0 origin-left scale-x-0 bg-palette-950 transition-transform duration-500 ease-[cubic-bezier(0.25,0,0,1)] group-hover:scale-x-100" />
              </div>
            </div>
          </a>

        </div>
      </section>
    </>
  )
}
