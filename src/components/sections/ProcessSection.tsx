import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Discover',
    verb: 'Map the territory',
    body: 'We dig into your users, competitors, and constraints before touching a pixel. Interviews, flow audits, technical scoping — the work that makes design decisions obvious, not arbitrary.',
    color: '#CE3000',
  },
  {
    number: '02',
    title: 'Design',
    verb: 'Build the language',
    body: 'High-fidelity interfaces and a design system built for your product, not borrowed from a template. Every decision is intentional — spacing, type, motion, color — argued and resolved.',
    color: '#F94500',
  },
  {
    number: '03',
    title: 'Build',
    verb: 'Ship production code',
    body: 'Astro, React, and whatever the stack demands. Pixel-perfect implementation, performant by default, accessible from the start. Not "developer handoff" — one team, start to finish.',
    color: '#FF6207',
  },
  {
    number: '04',
    title: 'Launch',
    verb: 'Refine in the real world',
    body: 'Deployment, QA, performance tuning. Then we watch real users and iterate. A site that ships is a hypothesis — we help you confirm or revise it.',
    color: '#FF852F',
  },
]

function DiscoverIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Outer app window */}
      <div className="w-72 rounded-2xl border border-black/10 bg-[#f4f4f5] overflow-hidden shadow-xl">
        {/* Title bar */}
        <div className="px-4 py-2.5 border-b border-black/8 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 1 C12.6 7 14 10.6 22 12 C14 13.4 12.6 17 12 23 C11.4 17 10 13.4 2 12 C10 10.6 11.4 7 12 1 Z" fill="#F94500" />
            </svg>
            <span className="text-[13px] font-semibold text-gray-700">Insights</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-6 h-1.5 rounded-full bg-gray-200" />
            <div className="w-5 h-1.5 rounded-full bg-gray-200" />
            <div className="w-7 h-1.5 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex">
          {/* Sidebar dots */}
          <div className="flex flex-col items-center gap-2 px-3 pt-4 border-r border-black/8 bg-palette-100">
            <div className="w-2 h-2 rounded-full bg-[#F94500]" />
            {[0,1,2,3,4].map(i => (
              <div key={i} className="w-2 h-2 rounded-full border border-gray-300" />
            ))}
          </div>

          {/* Cards stack */}
          <div className="flex-1 overflow-hidden">
            {/* Market Research card */}
            <div className="mx-2 mt-2 rounded-lg border border-gray-100 bg-white p-3">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-[13px] font-normal text-gray-800">Market Research</p>
                  <p className="text-[9px] text-gray-400">Compared to Last Year</p>
                </div>
                <span className="text-xs font-semibold text-primary-700">+24%</span>
              </div>
              <svg viewBox="0 0 200 50" className="w-full h-10" fill="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F94500" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F94500" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,42 C20,40 40,38 60,35 C80,32 100,28 120,24 C140,20 160,18 180,14 L200,12 L200,50 L0,50 Z"
                  fill="url(#areaGrad)"
                />
                <path
                  d="M0,42 C20,40 40,38 60,35 C80,32 100,28 120,24 C140,20 160,18 180,14 L200,12"
                  stroke="#F94500"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="200" cy="12" r="3" fill="#F94500" />
                <circle cx="200" cy="12" r="5" fill="#F94500" fillOpacity="0.2" />
              </svg>
            </div>

            {/* User Segments card */}
            <div className="mx-2 mt-1.5 rounded-lg border border-gray-100 bg-white p-3">
              <p className="text-[13px] font-normal text-gray-800">User Segments</p>
              <p className="text-[9px] text-gray-400 mb-2">Active Cohorts</p>
              <div className="flex items-end gap-1 h-10">
                {[55, 70, 100, 75, 85, 60].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 2 ? '#F94500' : 'rgba(249,69,0,0.3)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Competitor Analysis card */}
            <div className="mx-2 mt-1.5 mb-2 rounded-lg border border-gray-100 bg-white p-3">
              <p className="text-[13px] font-normal text-gray-800">Competitor Analysis</p>
              <p className="text-[9px] text-gray-400 mb-2">View &amp; manage your data</p>
              <div className="space-y-1.5">
                <div className="h-1.5 rounded-full bg-gray-200 w-full" />
                <div className="h-1.5 rounded-full bg-gray-200 w-4/5" />
                <div className="h-1.5 rounded-full bg-gray-200 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DesignIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-72 rounded-2xl border border-black/10 bg-[#f4f4f5] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-black/8 bg-white flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 1 C12.6 7 14 10.6 22 12 C14 13.4 12.6 17 12 23 C11.4 17 10 13.4 2 12 C10 10.6 11.4 7 12 1 Z" fill="#F94500" />
            </svg>
            <span className="text-[13px] font-semibold text-gray-700">Design System</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-6 h-1.5 rounded-full bg-gray-200" />
            <div className="w-5 h-1.5 rounded-full bg-gray-200" />
          </div>
        </div>

        <div className="px-3 py-2.5 space-y-2">
          {/* Color palette */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Palette</p>
            <div className="flex gap-1.5">
              {['#F94500', '#330014', '#FF852F', '#FFD2A4', '#e5e5e5', '#f4f4f5'].map((c) => (
                <div key={c} className="w-7 h-7 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* Type scale */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Type Scale</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-[10px] w-10">H1</span>
                <div className="h-3.5 rounded bg-gray-200 flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-[10px] w-10">H2</span>
                <div className="h-3 rounded bg-gray-200 w-3/4" />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-[10px] w-10">Body</span>
                <div className="h-2 rounded bg-gray-100 flex-1" />
              </div>
            </div>
          </div>

          {/* Component list */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Components</p>
            {[
              { label: 'Moodboard', icon: (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.5"/><rect x="9" y="1" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.35"/><rect x="1" y="9" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.25"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.15"/></svg>
              )},
              { label: 'UI Mockups', icon: (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="10" rx="1.5" stroke="#9ca3af" strokeWidth="1.2"/><rect x="3" y="3" width="5" height="3" rx="0.5" fill="#9ca3af" fillOpacity="0.3"/><rect x="3" y="7" width="10" height="1" rx="0.5" fill="#9ca3af" fillOpacity="0.3"/><rect x="6" y="13" width="4" height="1.5" rx="0.5" fill="#9ca3af" fillOpacity="0.3"/></svg>
              )},
              { label: 'Usability Testing', icon: (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#9ca3af" strokeWidth="1.2"/><path d="M5.5 8.5 L7 10 L10.5 6" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )},
              { label: 'Delivery', icon: (
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 5 L8 2 L14 5 L14 11 L8 14 L2 11 Z" stroke="#9ca3af" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 2 L8 14M2 5 L14 5" stroke="#9ca3af" strokeWidth="1.2"/></svg>
              )},
            ].map(({ label, icon }, i) => (
              <div key={label} className="flex items-center gap-2.5 py-1.5 border-b border-gray-100 last:border-0">
                {icon}
                <span className="text-xs text-gray-700">{label}</span>
                <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: i < 2 ? '#22c55e' : '#d1d5db' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function BuildIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-72 rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xl font-mono">
        {/* Tab bar */}
        <div className="flex border-b border-gray-100">
          {['app.tsx', 'api.ts', 'utils.ts'].map((tab, i) => (
            <div
              key={tab}
              className="px-3 py-2 text-[10px] border-r border-gray-100"
              style={{ color: i === 0 ? '#F94500' : '#9ca3af', borderBottom: i === 0 ? '2px solid #F94500' : 'none' }}
            >
              {i === 0 ? '• ' : ''}{tab}
            </div>
          ))}
        </div>

        {/* Code — Vue 3 component: fetches projects, filters active, deploys */}
        <div className="flex text-[10px] leading-5 border-b border-gray-100">
          {/* Line numbers */}
          <div className="py-3 px-2 text-right select-none text-gray-300 border-r border-gray-100" style={{ minWidth: '28px' }}>
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(n => <div key={n}>{n}</div>)}
          </div>
          {/* Code lines */}
          <div className="py-3 px-3 overflow-hidden">
            <div><span className="text-pink-500">&lt;script</span> <span className="text-orange-400">setup</span> <span className="text-orange-400">lang</span><span className="text-gray-500">="</span><span className="text-emerald-500">ts</span><span className="text-gray-500">"&gt;</span></div>
            <div><span className="text-violet-500">import</span> <span className="text-gray-600">{'{ ref, computed }'}</span> <span className="text-violet-500">from</span> <span className="text-emerald-500">'vue'</span></div>
            <div><span className="text-violet-500">import</span> <span className="text-gray-600">{'{ useApi }'}</span> <span className="text-violet-500">from</span> <span className="text-emerald-500">'@/composables'</span></div>
            <div>&nbsp;</div>
            <div><span className="text-violet-500">const</span> <span className="text-sky-500">projects</span> <span className="text-gray-400">=</span> <span className="text-sky-500">useApi</span><span className="text-gray-600">(<span className="text-emerald-500">'/projects'</span>)</span></div>
            <div><span className="text-violet-500">const</span> <span className="text-sky-500">active</span> <span className="text-gray-400">=</span> <span className="text-sky-500">computed</span><span className="text-gray-600">{'(() => {'}</span></div>
            <div className="pl-4"><span className="text-violet-500">return</span> <span className="text-sky-500">projects</span><span className="text-gray-600">.filter(p =&gt; p.status ===</span> <span className="text-emerald-500">'active'</span><span className="text-gray-600">)</span></div>
            <div><span className="text-gray-600">{'})'}</span></div>
            <div>&nbsp;</div>
            <div><span className="text-violet-500">const</span> <span className="text-sky-500">deploy</span> <span className="text-gray-400">=</span> <span className="text-violet-500">async</span> <span className="text-gray-600">{'() => {'}</span></div>
            <div className="pl-4"><span className="text-violet-500">await</span> <span className="text-gray-600">$fetch(<span className="text-emerald-500">'/api/deploy'</span>, {'{'}</span></div>
            <div className="pl-8"><span className="text-gray-400">method: </span><span className="text-emerald-500">'POST'</span><span className="text-gray-400">,</span></div>
            <div className="pl-8"><span className="text-gray-400">body: {'{ '}</span><span className="text-gray-400">env: </span><span className="text-emerald-500">'production'</span><span className="text-gray-400">{' }'}</span></div>
            <div className="pl-4"><span className="text-gray-600">{'})'}</span></div>
          </div>
        </div>

        {/* Terminal */}
        <div className="px-4 py-2.5 bg-gray-50">
          <div className="text-[10px] text-gray-400 mb-1">$ npm run build</div>
          <div className="text-[10px] text-emerald-500 font-medium">✓ Built in 1.2s</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-gray-400 text-[10px]">$</span>
            <div className="w-1.5 h-3 bg-[#F94500] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LaunchIllustration() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Git graph SVG */}
        <svg viewBox="0 0 280 200" className="w-full h-full" fill="none">
          {/* Main branch line */}
          <line x1="40" y1="100" x2="240" y2="100" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
          {/* Feature branch up */}
          <path d="M 100 100 Q 100 55 140 55 L 200 55" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />
          {/* Feature branch down */}
          <path d="M 140 100 Q 140 145 170 145 L 220 145" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" />

          {/* Main branch commits */}
          <circle cx="40" cy="100" r="6" fill="#CE3000" />
          <circle cx="100" cy="100" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="140" cy="100" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="200" cy="100" r="6" fill="#CE3000" />
          <circle cx="240" cy="100" r="6" fill="#F94500" />

          {/* Feature branch commits */}
          <circle cx="140" cy="55" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="200" cy="55" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

          {/* Hotfix branch commits */}
          <circle cx="170" cy="145" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <circle cx="220" cy="145" r="5" fill="#CE3000" />

          {/* Version tags */}
          <rect x="25" y="111" width="30" height="14" rx="3" fill="rgba(249,69,0,0.2)" stroke="#F94500" strokeWidth="0.5" />
          <text x="40" y="118" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#F94500" fontFamily="monospace">v1.0</text>

          <rect x="185" y="111" width="30" height="14" rx="3" fill="rgba(249,69,0,0.2)" stroke="#F94500" strokeWidth="0.5" />
          <text x="200" y="118" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#F94500" fontFamily="monospace">v1.2</text>

          <rect x="223" y="111" width="30" height="14" rx="3" fill="rgba(206,48,0,0.25)" stroke="#CE3000" strokeWidth="0.5" />
          <text x="238" y="118" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#FF852F" fontFamily="monospace">v2.0</text>

          {/* Branch labels */}
          <text x="40" y="88" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="monospace">main</text>
          <text x="170" y="44" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="monospace">feature</text>
          <text x="195" y="160" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="monospace">hotfix</text>
        </svg>

        {/* Floating deploy badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-mono">deployed</span>
        </div>
      </div>
    </div>
  )
}

function StepIllustration({ step }: { step: number }) {
  switch (step) {
    case 0: return <DiscoverIllustration />
    case 1: return <DesignIllustration />
    case 2: return <BuildIllustration />
    case 3: return <LaunchIllustration />
    default: return null
  }
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

export default function ProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [sectionEntered, setSectionEntered] = useState(false)
  const reducedMotion = useReducedMotion()

  // Approach phase: section scrolling up into viewport → fills stub
  const { scrollYProgress: approachProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  })
  const stubFillHeight = useTransform(approachProgress, [0, 1], ['0%', '100%'])

  // Main phase: sticky scroll through steps
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(approachProgress, 'change', (v) => {
    if (v >= 1 && !sectionEntered) setSectionEntered(true)
    if (v < 1 && sectionEntered) setSectionEntered(false)
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * steps.length), steps.length - 1)
    setActiveStep(idx)
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="bg-palette-950">
      {/* Header — not sticky */}
      <div className="mx-auto max-w-[1400px] px-5 pt-28 pb-4">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2
            className="font-switzer text-[clamp(48px,7vw,88px)] font-semibold leading-none text-white"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            <span className="italic">How we</span>
            <br />
            <em className="font-reckless font-light not-italic text-primary-600">actually</em> <span className="font-switzer italic text-white">work?</span>
          </h2>
          <p className="max-w-lg text-[17px] leading-relaxed text-palette-300 indent-8" style={{ textAlign: 'justify' }}>
            Every project is built with intention. From strategy to launch, we move quickly, communicate clearly, with a focused process designed to eliminate friction and keep projects moving. We build digital products that not only look great, but drive real results.
          </p>
        </div>
      </div>

      {/* Sticky scroll container */}
      <div
        ref={containerRef}
        style={{ height: `${steps.length * 100}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="mx-auto flex h-full max-w-7xl items-center gap-0 px-5">
            {/* Left: progress spine + active number */}
            <div className="relative flex h-full w-16 shrink-0 flex-col items-center justify-center md:w-24">
              {/* Track background — full span */}
              <div className="absolute inset-y-16 left-1/2 w-px -translate-x-1/2 bg-white/10" />
              {/* Stub fill — 64px→96px, fills during approach */}
              <div className="absolute left-1/2 w-px -translate-x-1/2 overflow-hidden" style={{ top: '64px', height: '32px' }}>
                <motion.div className="w-full origin-top bg-primary-600" style={{ height: stubFillHeight }} />
              </div>
              {/* Main fill — 96px→bottom, fills during sticky scroll */}
              <div className="absolute left-1/2 w-px -translate-x-1/2 overflow-hidden" style={{ top: '96px', bottom: '64px' }}>
                <motion.div className="w-full origin-top bg-primary-600" style={{ height: progressHeight }} />
              </div>
              {/* Dots */}
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!containerRef.current) return
                    const totalHeight = containerRef.current.scrollHeight
                    const targetProgress = i / steps.length + 0.001
                    window.scrollTo({
                      top: containerRef.current.offsetTop + targetProgress * totalHeight,
                      behavior: 'smooth',
                    })
                  }}
                  className="absolute"
                  style={{ top: `calc(96px + ${i / steps.length} * (100% - 160px))` }}
                  aria-label={`Go to step ${s.number}: ${s.title}`}
                >
                  <motion.div
                    className="h-2 w-2 rounded-full border border-white/30 transition-colors duration-300"
                    animate={{
                      backgroundColor: i === 0 ? (sectionEntered ? '#F94500' : 'transparent') : (i <= activeStep ? '#F94500' : 'transparent'),
                      borderColor: i === 0 ? (sectionEntered ? '#F94500' : 'rgba(255,255,255,0.3)') : (i <= activeStep ? '#F94500' : 'rgba(255,255,255,0.3)'),
                      scale: i === activeStep ? 1.5 : 1,
                    }}
                    transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  />
                </button>
              ))}
            </div>

            {/* Main content area */}
            <div className="flex flex-1 flex-col justify-center gap-0 md:flex-row md:items-center md:gap-12">
              {/* Step number — large typographic anchor */}
              <div className="relative w-full shrink-0 md:w-64">
                <span
                  className="block font-clash font-medium leading-none text-white/8 select-none"
                  style={{ fontSize: 'clamp(96px, 27vw, 200px)' }}
                >
                  {steps[activeStep].number}
                </span>
              </div>

              {/* Step text */}
              <div className="flex flex-1 flex-col justify-center">
                <div className="h-[280px] flex flex-col justify-end overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={reducedMotion ? false : { opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={reducedMotion ? false : { opacity: 0, x: -32 }}
                    transition={{ duration: 0.45, ease: [0.25, 0, 0, 1] }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="h-px flex-shrink-0 bg-primary-600"
                        initial={reducedMotion ? false : { width: 0 }}
                        animate={{ width: 32 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      />
                      <span className="font-sans text-tooltip-l uppercase tracking-widest text-primary-600">
                        {steps[activeStep].verb}
                      </span>
                    </div>

                    <h3
                      className="font-switzer text-[clamp(36px,4.5vw,64px)] font-medium leading-none text-white"
                    >
                      {steps[activeStep].title}
                    </h3>

                    <p className="max-w-md text-[clamp(15px,1.1vw,17px)] leading-relaxed text-palette-400">
                      {steps[activeStep].body}
                    </p>

                  </motion.div>
                </AnimatePresence>
                </div>

                {/* Step indicators — outside AnimatePresence so they never fade */}
                <motion.div layout transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.25, 0, 0, 1] }} className="flex gap-2 pt-5">
                  {steps.map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-0.5 rounded-full"
                      animate={{
                        width: i === activeStep ? 32 : 8,
                        backgroundColor: i === activeStep ? '#F94500' : 'rgba(255,255,255,0.15)',
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.25, 0, 0, 1] }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Step illustration */}
              <div className={`hidden h-64 shrink-0 lg:block xl:h-80 ${activeStep === 3 ? 'w-96 xl:w-[28rem]' : 'w-64 xl:w-80'}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
                    className="h-full w-full"
                  >
                    <StepIllustration step={activeStep} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
