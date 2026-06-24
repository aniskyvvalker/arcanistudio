import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    verb: 'Understand before we build', // was: 'Map the territory'
    body: 'We dig into your users, competitors, and constraints before touching a pixel. Interviews, flow audits, technical scoping — You get a product blueprint, architecture document, and a fixed-price quote.',
    color: '#CE3000',
  },
  {
    number: '02',
    title: 'Design',
    verb: 'Validate the vision early',
    body: 'Every screen tested before development starts. Wireframes, flows, and interactive prototypes. You see it, you click it, you validate it — No surprises when we start building.',
    color: '#F94500',
  },
  {
    number: '03',
    title: 'Build',
    verb: 'Designs become real products', // was: 'Ship production code'
    body: 'Your prototype becomes a real product. Clean code, solid architecture, transparent progress — and weekly check-ins so nothing drifts. Every feature reviewed, every detail intentional.',
    color: '#FF6207',
  },
  {
    number: '04',
    title: 'Launch',
    verb: 'Beyond the finish line',
    body: 'Testing, polish, optimization. Once live, we stay with you — 30 days of post-launch support included, with monthly sprints available to keep your product evolving with your users. You leave with full ownership and zero technical dependency.',
    color: '#FF852F',
  },
]

const ALL_BARS = [55, 70, 100, 75, 85, 60, 90, 45]

function CountUp({ to, active, className }: { to: number; active: boolean; className?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return
    const duration = 2500
    const start = performance.now()
    const easeInOut = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2
    let raf: number
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setCount(Math.round(easeInOut(t) * to))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, to])

  return <span className={className}>+{count}%</span>
}

function DiscoverIllustration({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [barCount, setBarCount] = useState(6)
  const [fullyVisible, setFullyVisible] = useState(false)

  useEffect(() => {
    if (!rootRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      setBarCount(w >= 380 ? 8 : w >= 320 ? 7 : 6)
    })
    ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!rootRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFullyVisible(true) },
      { threshold: 0.99 }
    )
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="w-full h-full flex items-center justify-center">
      {/* Outer app window */}
      <div className="w-full rounded-tr-2xl rounded-br-2xl border border-black/10 bg-[#f4f4f5] overflow-hidden shadow-xl">
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
            <div
              className="w-2 h-2 rounded-full bg-[#F94500]"
            />
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
                <CountUp to={24} active={fullyVisible} className="text-xs font-semibold text-primary-700" />
              </div>
              <svg viewBox="0 0 206 50" className="w-full aspect-[5/1] max-h-24" fill="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F94500" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F94500" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0,42 C20,40 40,38 60,35 C80,32 100,28 120,24 C140,20 160,18 180,14 L200,12 L200,50 L0,50 Z"
                  fill="url(#areaGrad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: fullyVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                />
                <motion.path
                  d="M0,42 C20,40 40,38 60,35 C80,32 100,28 120,24 C140,20 160,18 180,14 L200,12"
                  stroke="#F94500"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: fullyVisible ? 1 : 0 }}
                  transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
                />
                <defs>
                  <style>{`
                    @keyframes dotGlow {
                      0%, 100% { filter: drop-shadow(0 0 0px rgba(249,69,0,0)); }
                      50% { filter: drop-shadow(0 0 3px rgba(249,69,0,0.9)) drop-shadow(0 0 6px rgba(249,69,0,0.4)); }
                    }
                    .chart-dot-glow { animation: dotGlow 2s ease-in-out infinite; }
                  `}</style>
                </defs>
                <motion.circle
                  cx="200" cy="12" r="3" fill="#F94500"
                  className="chart-dot-glow"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: fullyVisible ? 1 : 0, scale: fullyVisible ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: 2.1 }}
                />
              </svg>
            </div>

            {/* User Segments card */}
            <div className="mx-2 mt-1.5 rounded-lg border border-gray-100 bg-white p-3">
              <p className="text-[13px] font-normal text-gray-800">User Segments</p>
              <p className="text-[9px] text-gray-400 mb-2">Active Cohorts</p>
              <div className="flex items-end gap-1 h-10">
                {ALL_BARS.slice(0, barCount).map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm origin-bottom"
                    style={{ backgroundColor: i === 2 ? '#F94500' : 'rgba(249,69,0,0.3)' }}
                    initial={{ scaleY: 0, height: `${h}%` }}
                    animate={{ scaleY: fullyVisible ? 1 : 0, height: `${h}%` }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
                  />
                ))}
              </div>
            </div>

            {/* Competitor Analysis card */}
            <div className="mx-2 mt-1.5 mb-2 rounded-lg border border-gray-100 bg-white p-3">
              <p className="text-[13px] font-normal text-gray-800">Competitor Analysis</p>
              <p className="text-[9px] text-gray-400 mb-2">View &amp; manage your data</p>
              <div className="space-y-1.5">
                {[['w-full', 0.7], ['w-4/5', 0.8], ['w-[88%]', 0.9]].map(([w, delay], i) => (
                  <motion.div
                    key={i}
                    className={`h-1.5 rounded-full bg-gray-200 ${w}`}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: fullyVisible ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: delay as number, ease: 'easeOut' }}
                    style={{ transformOrigin: 'left' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DesignIllustration() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [fullyVisible, setFullyVisible] = useState(false)

  useEffect(() => {
    if (!rootRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFullyVisible(true) },
      { threshold: 0.99 }
    )
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  const typeRows = [
    { label: 'H1', h: 'h-3.5', w: 'flex-1' },
    { label: 'H2', h: 'h-3', w: 'w-3/4' },
    { label: 'Body', h: 'h-2', w: 'flex-1' },
  ]

  const components = [
    { label: 'Moodboard', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.5"/><rect x="9" y="1" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.35"/><rect x="1" y="9" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.25"/><rect x="9" y="9" width="6" height="6" rx="1" fill="#9ca3af" fillOpacity="0.15"/></svg> },
    { label: 'UI Mockups', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="10" rx="1.5" stroke="#9ca3af" strokeWidth="1.2"/><rect x="3" y="3" width="5" height="3" rx="0.5" fill="#9ca3af" fillOpacity="0.3"/><rect x="3" y="7" width="10" height="1" rx="0.5" fill="#9ca3af" fillOpacity="0.3"/><rect x="6" y="13" width="4" height="1.5" rx="0.5" fill="#9ca3af" fillOpacity="0.3"/></svg> },
    { label: 'Usability Testing', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="#9ca3af" strokeWidth="1.2"/><path d="M5.5 8.5 L7 10 L10.5 6" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Delivery', icon: <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2 5 L8 2 L14 5 L14 11 L8 14 L2 11 Z" stroke="#9ca3af" strokeWidth="1.2" strokeLinejoin="round"/><path d="M8 2 L8 14M2 5 L14 5" stroke="#9ca3af" strokeWidth="1.2"/></svg> },
  ]

  return (
    <div ref={rootRef} className="w-full h-full flex items-center justify-center">
      <div className="w-full rounded-tr-2xl rounded-br-2xl border border-black/10 bg-[#f4f4f5] overflow-hidden shadow-xl">
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
              {['#F94500', '#330014', '#FF852F', '#FFD2A4', '#e5e5e5', '#f4f4f5'].map((c, i) => (
                <motion.div
                  key={c}
                  className="w-7 h-7 rounded-full"
                  style={{ backgroundColor: c }}
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: fullyVisible ? 1 : 0, filter: fullyVisible ? 'blur(0px)' : 'blur(8px)' }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                />
              ))}
            </div>
          </div>

          {/* Type scale */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Type Scale</p>
            <div className="space-y-1.5">
              {typeRows.map(({ label, h, w }, i) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-gray-400 text-[10px] w-10">{label}</span>
                  <motion.div
                    className={`${h} rounded bg-gray-200 ${w}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: fullyVisible ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.55 + i * 0.1, ease: 'easeOut' }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Component list */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Components</p>
            {components.map(({ label, icon }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-2.5 py-1.5 border-b border-gray-100 last:border-0"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: fullyVisible ? 1 : 0, y: fullyVisible ? 0 : 5 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              >
                {icon}
                <span className="text-xs text-gray-700">{label}</span>
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full"
                  initial={{ backgroundColor: '#d1d5db' }}
                  animate={{ backgroundColor: fullyVisible && i < 2 ? '#22c55e' : '#d1d5db' }}
                  transition={{ duration: 0.4, delay: i === 0 ? 2.5 : i === 1 ? 4 : 1.2 + i * 0.15 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type CodeSegment = { text: string; className?: string }
type CodeLine = { segments: CodeSegment[]; indent?: string }

const CODE_DEF: CodeLine[] = [
  { segments: [{ text: '<script', className: 'text-pink-500' }, { text: ' setup lang', className: 'text-orange-400' }, { text: '="', className: 'text-gray-500' }, { text: 'ts', className: 'text-emerald-500' }, { text: '">', className: 'text-gray-500' }] },
  { segments: [{ text: 'import', className: 'text-violet-500' }, { text: " { ref, computed }", className: 'text-gray-600' }, { text: ' from', className: 'text-violet-500' }, { text: " 'vue'", className: 'text-emerald-500' }] },
  { segments: [{ text: 'import', className: 'text-violet-500' }, { text: " { useApi }", className: 'text-gray-600' }, { text: ' from', className: 'text-violet-500' }, { text: " '@/composables'", className: 'text-emerald-500' }] },
  { segments: [{ text: '' }] },
  { segments: [{ text: 'const', className: 'text-violet-500' }, { text: ' projects', className: 'text-sky-500' }, { text: ' =', className: 'text-gray-400' }, { text: ' useApi', className: 'text-sky-500' }, { text: "('/projects')", className: 'text-gray-600' }] },
  { segments: [{ text: 'const', className: 'text-violet-500' }, { text: ' active', className: 'text-sky-500' }, { text: ' =', className: 'text-gray-400' }, { text: ' computed', className: 'text-sky-500' }, { text: '(() => {', className: 'text-gray-600' }] },
  { indent: 'pl-4', segments: [{ text: 'return', className: 'text-violet-500' }, { text: ' projects', className: 'text-sky-500' }, { text: ".filter(p => p.status ===", className: 'text-gray-600' }, { text: " 'active'", className: 'text-emerald-500' }, { text: ')', className: 'text-gray-600' }] },
  { segments: [{ text: '})', className: 'text-gray-600' }] },
  { segments: [{ text: '' }] },
  { segments: [{ text: 'const', className: 'text-violet-500' }, { text: ' deploy', className: 'text-sky-500' }, { text: ' =', className: 'text-gray-400' }, { text: ' async', className: 'text-violet-500' }, { text: ' () => {', className: 'text-gray-600' }] },
  { indent: 'pl-4', segments: [{ text: 'await', className: 'text-violet-500' }, { text: " $fetch('/api/deploy', {", className: 'text-gray-600' }] },
  { indent: 'pl-8', segments: [{ text: 'method: ', className: 'text-gray-400' }, { text: "'POST'", className: 'text-emerald-500' }, { text: ',', className: 'text-gray-400' }] },
  { indent: 'pl-8', segments: [{ text: 'body: { env: ', className: 'text-gray-400' }, { text: "'production'", className: 'text-emerald-500' }, { text: ' }', className: 'text-gray-400' }] },
  { indent: 'pl-4', segments: [{ text: '})', className: 'text-gray-600' }] },
]

type CodeChar = { char: string; className?: string; lineIndex: number; segIndex: number }

const CODE_CHARS: CodeChar[] = CODE_DEF.flatMap((line, li) =>
  line.segments.flatMap((seg, si) =>
    seg.text.split('').map(char => ({ char, className: seg.className, lineIndex: li, segIndex: si }))
  )
)

function BuildIllustration() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [fullyVisible, setFullyVisible] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [terminalStep, setTerminalStep] = useState(0)
  const [cmdCount, setCmdCount] = useState(0)
  const CMD = 'arcani deploy --prod'

  useEffect(() => {
    if (!rootRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFullyVisible(true) },
      { threshold: 0.99 }
    )
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!fullyVisible) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setCharCount(i)
      if (i >= CODE_CHARS.length) clearInterval(interval)
    }, 15)
    return () => clearInterval(interval)
    // NOTE: 15ms interval = ~67 state updates/sec + per-render array rebuild + 317 individual char spans.
    // Fine for 1024px+ (laptops/desktops). If ever enabling on mobile (<1024px), switch to
    // requestAnimationFrame + useMemo for lineChars to avoid jank on low-end devices.
  }, [fullyVisible])

  useEffect(() => {
    if (charCount < CODE_CHARS.length) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setCmdCount(i)
      if (i >= CMD.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [charCount])

  useEffect(() => {
    if (cmdCount < CMD.length) return
    const timers = [
      setTimeout(() => setTerminalStep(1), 200),
      setTimeout(() => setTerminalStep(2), 900),
      setTimeout(() => setTerminalStep(3), 1700),
      setTimeout(() => setTerminalStep(4), 2500),
      setTimeout(() => setTerminalStep(5), 2800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [cmdCount])

  const done = charCount >= CODE_CHARS.length
  const visibleChars = CODE_CHARS.slice(0, charCount)
  const lastChar = visibleChars[visibleChars.length - 1]
  const currentLineIndex = lastChar?.lineIndex ?? -1

  // Group visible chars by line
  const lineChars: CodeChar[][] = Array.from({ length: CODE_DEF.length }, () => [])
  visibleChars.forEach(c => lineChars[c.lineIndex].push(c))

  return (
    <div ref={rootRef} className="w-full h-full flex items-center justify-center">
      <style>{`@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
      <div className="w-full rounded-tr-2xl rounded-br-2xl border border-black/10 bg-white overflow-hidden shadow-xl font-mono">
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

        {/* Code */}
        <div className="flex text-[10px] leading-5 border-b border-gray-100">
          <div className="py-3 px-2 text-right select-none text-gray-300 border-r border-gray-100" style={{ minWidth: '28px' }}>
            {CODE_DEF.map((_, n) => (
              <div key={n}>{n + 1}</div>
            ))}
          </div>
          <div className="py-3 px-3 overflow-hidden">
            {CODE_DEF.map((line, li) => {
              const chars = lineChars[li]
              if (chars.length === 0 && li > currentLineIndex) return <div key={li} style={{ visibility: 'hidden' }}>&nbsp;</div>
              return (
                <div key={li} className={line.indent ?? ''}>
                  {chars.map((c, ci) => (
                    <span key={ci} className={c.className}>{c.char}</span>
                  ))}
                  {li === currentLineIndex && !done && (
                    <span className="inline-block w-[5px] h-[10px] bg-[#F94500] ml-px animate-pulse align-middle" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Terminal */}
        <div className="px-4 py-2.5 bg-gray-50 space-y-0.5">
          <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
            <span>$</span>
            {cmdCount === 0
              ? <div className="w-1.5 h-3 bg-[#F94500]" style={{ animation: 'blink 1s steps(1) infinite' }} />
              : <span>{CMD.slice(0, cmdCount)}{cmdCount < CMD.length && <span className="inline-block w-[5px] h-[9px] bg-[#F94500] ml-px align-middle" style={{ animation: 'blink 1s steps(1) infinite' }} />}</span>
            }
          </div>
          <div className="text-[10px] text-gray-500" style={{ visibility: terminalStep >= 1 ? 'visible' : 'hidden' }}>Preparing your project...</div>
          <div className="text-[10px] text-emerald-500" style={{ visibility: terminalStep >= 2 ? 'visible' : 'hidden' }}>✓ Code reviewed</div>
          <div className="text-[10px] text-emerald-500" style={{ visibility: terminalStep >= 3 ? 'visible' : 'hidden' }}>✓ Tests passed</div>
          <div className="text-[10px] text-emerald-500 font-medium" style={{ visibility: terminalStep >= 4 ? 'visible' : 'hidden' }}>✓ Your app is live</div>
          <div className="flex items-center gap-1 pt-0.5" style={{ visibility: terminalStep >= 5 ? 'visible' : 'hidden' }}>
            <span className="text-gray-400 text-[10px]">$</span>
            <div className="w-1.5 h-3 bg-[#F94500]" style={{ animation: 'blink 1s steps(1) infinite' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function LaunchIllustration() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)

  useEffect(() => {
    if (!rootRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setV(true) },
      { threshold: 0.99 }
    )
    io.observe(rootRef.current)
    return () => io.disconnect()
  }, [])

  const dot = (delay: number, fill: string, stroke?: string) => ({
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: v ? 1 : 0, scale: v ? 1 : 0 },
    transition: { duration: 0.25, delay, ease: [0.34, 1.56, 0.64, 1] },
    style: stroke ? undefined : undefined,
  })

  return (
    <div ref={rootRef} className="w-full h-full flex items-center justify-center">
      <div className="w-full h-full relative">
        <svg viewBox="22 72 233 148" className="w-full h-full" fill="none">

          {/* Main branch line */}
          <motion.line x1="40" y1="140" x2="240" y2="140"
            stroke="rgba(255,255,255,0.75)" strokeWidth="1.5"
            initial={{ pathLength: 0 }} animate={{ pathLength: v ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeInOut' }}
          />
          {/* Feature branch */}
          <motion.path d="M 100 140 Q 100 95 140 95 L 200 95"
            stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: v ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: 'easeInOut' }}
          />
          {/* Hotfix branch */}
          <motion.path d="M 140 140 Q 140 185 170 185 L 220 185"
            stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: v ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.9, ease: 'easeInOut' }}
          />

          {/* Main branch commits */}
          <motion.circle cx="40" cy="140" r="6" fill="#CE3000" {...dot(0.2, '#CE3000')} />
          <motion.circle cx="100" cy="140" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" {...dot(0.45, '')} />
          <motion.circle cx="140" cy="140" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" {...dot(0.6, '')} />
          <motion.circle cx="200" cy="140" r="6" fill="#CE3000" {...dot(0.8, '#CE3000')} />
          <motion.circle cx="240" cy="140" r="6" fill="#F94500" {...dot(0.95, '#F94500')} />

          {/* Feature branch commits */}
          <motion.circle cx="140" cy="95" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" {...dot(0.85, '')} />
          <motion.circle cx="200" cy="95" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" {...dot(1.0, '')} />

          {/* Hotfix branch commits */}
          <motion.circle cx="170" cy="185" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" {...dot(1.0, '')} />
          <motion.circle cx="220" cy="185" r="5" fill="#CE3000" {...dot(1.1, '#CE3000')} />

          {/* Version tags */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.35 }}>
            <rect x="25" y="151" width="30" height="14" rx="3" fill="rgba(249,69,0,0.2)" stroke="#F94500" strokeWidth="0.5" />
            <text x="40" y="158" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#F94500" fontFamily="monospace">v1.0</text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.85 }}>
            <rect x="185" y="151" width="30" height="14" rx="3" fill="rgba(249,69,0,0.2)" stroke="#F94500" strokeWidth="0.5" />
            <text x="200" y="158" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#F94500" fontFamily="monospace">v1.2</text>
          </motion.g>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 1.05 }}>
            <rect x="223" y="151" width="30" height="14" rx="3" fill="rgba(206,48,0,0.25)" stroke="#CE3000" strokeWidth="0.5" />
            <text x="238" y="158" textAnchor="middle" dominantBaseline="central" fontSize="7" fill="#FF852F" fontFamily="monospace">v2.0</text>
          </motion.g>

          {/* Branch labels */}
          <motion.text x="40" y="128" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.2 }}>main</motion.text>
          <motion.text x="170" y="84" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.7 }}>feature</motion.text>
          <motion.text x="195" y="200" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.35)" fontFamily="monospace"
            initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 0.9 }}>hotfix</motion.text>
        </svg>

        {/* Deploy badge */}
        <motion.div
          className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: v ? 1 : 0, y: v ? 0 : -8 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          <span className="text-[10px] text-green-400 font-mono">deployed</span>
        </motion.div>
      </div>
    </div>
  )
}

// ---- Tablet (768–1023px) wide variants ----
// Card-stack illustrations re-laid into horizontal columns so they read
// wide-and-short under the step text instead of tall-and-narrow.

function useEnteredOnce(threshold = 0.45) {
  const ref = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setEntered(true) },
      { threshold }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return { ref, entered }
}

function DiscoverWide({ active }: { active: boolean }) {
  const { ref, entered } = useEnteredOnce()
  const v = active || entered
  return (
    <div ref={ref} className="w-full h-full flex items-center">
      <div className="w-full rounded-2xl border border-black/10 bg-[#f4f4f5] overflow-hidden shadow-xl">
        {/* Title bar */}
        <div className="px-4 py-2 border-b border-black/8 bg-white flex items-center justify-between">
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
        {/* 3 columns */}
        <div className="grid grid-cols-3 gap-2 p-2">
          {/* Market Research */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[12px] font-normal text-gray-800">Market Research</p>
                <p className="text-[9px] text-gray-400">vs Last Year</p>
              </div>
              <CountUp to={24} active={v} className="text-[11px] font-semibold text-primary-700" />
            </div>
            <svg viewBox="0 0 206 60" className="w-full" fill="none">
              <defs>
                <linearGradient id="areaGradWide" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F94500" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#F94500" stopOpacity="0" />
                </linearGradient>
              </defs>
              <motion.path
                d="M0,50 C30,47 50,44 80,38 C110,32 140,26 170,18 L200,12 L200,60 L0,60 Z"
                fill="url(#areaGradWide)"
                initial={{ opacity: 0 }} animate={{ opacity: v ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.5 }}
              />
              <motion.path
                d="M0,50 C30,47 50,44 80,38 C110,32 140,26 170,18 L200,12"
                stroke="#F94500" strokeWidth="1.5" strokeLinecap="round" fill="none"
                initial={{ pathLength: 0 }} animate={{ pathLength: v ? 1 : 0 }} transition={{ duration: 1.6, delay: 0.3, ease: 'easeInOut' }}
              />
              <motion.circle cx="200" cy="12" r="3" fill="#F94500"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: v ? 1 : 0, scale: v ? 1 : 0 }} transition={{ duration: 0.3, delay: 1.6 }}
              />
            </svg>
          </div>
          {/* User Segments */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[12px] font-normal text-gray-800">User Segments</p>
            <p className="text-[9px] text-gray-400 mb-2">Active Cohorts</p>
            <div className="flex items-end gap-1 h-[60px]">
              {ALL_BARS.slice(0, 6).map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm origin-bottom"
                  style={{ backgroundColor: i === 2 ? '#F94500' : 'rgba(249,69,0,0.3)' }}
                  initial={{ scaleY: 0, height: `${h}%` }}
                  animate={{ scaleY: v ? 1 : 0, height: `${h}%` }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.06, ease: 'easeOut' }}
                />
              ))}
            </div>
          </div>
          {/* Competitor Analysis */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[12px] font-normal text-gray-800">Competitor Analysis</p>
            <p className="text-[9px] text-gray-400 mb-3">Manage data</p>
            <div className="space-y-2">
              {[['w-full', 0.7], ['w-4/5', 0.8], ['w-[88%]', 0.9], ['w-3/5', 1.0]].map(([w, delay], i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 rounded-full bg-gray-200 ${w}`}
                  initial={{ scaleX: 0 }} animate={{ scaleX: v ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: delay as number, ease: 'easeOut' }}
                  style={{ transformOrigin: 'left' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DesignWide() {
  const { ref, entered: v } = useEnteredOnce()
  const typeRows = [
    { label: 'H1', h: 'h-3', w: 'w-full' },
    { label: 'H2', h: 'h-2.5', w: 'w-3/4' },
    { label: 'Body', h: 'h-2', w: 'w-full' },
  ]
  const comps = [
    { label: 'Moodboard', on: true },
    { label: 'UI Mockups', on: true },
    { label: 'Usability', on: false },
    { label: 'Delivery', on: false },
  ]
  return (
    <div ref={ref} className="w-full h-full flex items-center">
      <div className="w-full rounded-2xl border border-black/10 bg-[#f4f4f5] overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-4 py-2 border-b border-black/8 bg-white flex items-center justify-between">
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
        {/* 3 columns */}
        <div className="grid grid-cols-3 gap-2 p-2">
          {/* Palette */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Palette</p>
            <div className="grid grid-cols-3 gap-1.5">
              {['#F94500', '#330014', '#FF852F', '#FFD2A4', '#e5e5e5', '#f4f4f5'].map((c, i) => (
                <motion.div
                  key={c}
                  className="aspect-square rounded-full"
                  style={{ backgroundColor: c }}
                  initial={{ opacity: 0, filter: 'blur(8px)' }}
                  animate={{ opacity: v ? 1 : 0, filter: v ? 'blur(0px)' : 'blur(8px)' }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                />
              ))}
            </div>
          </div>
          {/* Type scale */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Type Scale</p>
            <div className="space-y-2.5">
              {typeRows.map(({ label, h, w }, i) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-gray-400 text-[9px] w-7">{label}</span>
                  <motion.div
                    className={`${h} rounded bg-gray-200 ${w}`}
                    initial={{ scaleX: 0 }} animate={{ scaleX: v ? 1 : 0 }}
                    transition={{ duration: 0.5, delay: 0.55 + i * 0.1, ease: 'easeOut' }}
                    style={{ transformOrigin: 'left' }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Components */}
          <div className="rounded-lg border border-gray-100 bg-white p-3">
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Components</p>
            {comps.map(({ label, on }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: v ? 1 : 0, y: v ? 0 : 5 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
              >
                <span className="text-[11px] text-gray-700">{label}</span>
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full"
                  initial={{ backgroundColor: '#d1d5db' }}
                  animate={{ backgroundColor: v && on ? '#22c55e' : '#d1d5db' }}
                  transition={{ duration: 0.4, delay: 1.4 + i * 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const CODE_DEF_WIDE: CodeLine[] = [
  { segments: [{ text: '<script', className: 'text-pink-500' }, { text: ' setup lang', className: 'text-orange-400' }, { text: '="', className: 'text-gray-500' }, { text: 'ts', className: 'text-emerald-500' }, { text: '">', className: 'text-gray-500' }] },
  { segments: [{ text: 'import', className: 'text-violet-500' }, { text: " { ref, computed }", className: 'text-gray-600' }, { text: ' from', className: 'text-violet-500' }, { text: " 'vue'", className: 'text-emerald-500' }] },
  { segments: [{ text: '' }] },
  { segments: [{ text: 'const', className: 'text-violet-500' }, { text: ' projects', className: 'text-sky-500' }, { text: ' =', className: 'text-gray-400' }, { text: ' useApi', className: 'text-sky-500' }, { text: "('/projects')", className: 'text-gray-600' }] },
  { segments: [{ text: 'const', className: 'text-violet-500' }, { text: ' active', className: 'text-sky-500' }, { text: ' =', className: 'text-gray-400' }, { text: ' computed', className: 'text-sky-500' }, { text: '(() =>', className: 'text-gray-600' }] },
  { indent: 'pl-4', segments: [{ text: 'projects', className: 'text-sky-500' }, { text: ".filter(p => p.active)", className: 'text-gray-600' }] },
  { segments: [{ text: ')', className: 'text-gray-600' }] },
]

const CODE_CHARS_WIDE: CodeChar[] = CODE_DEF_WIDE.flatMap((line, li) =>
  line.segments.flatMap((seg, si) =>
    seg.text.split('').map(char => ({ char, className: seg.className, lineIndex: li, segIndex: si }))
  )
)

function BuildWide() {
  const { ref, entered: fullyVisible } = useEnteredOnce()
  const [charCount, setCharCount] = useState(0)
  const [terminalStep, setTerminalStep] = useState(0)
  const [cmdCount, setCmdCount] = useState(0)
  const CMD = 'arcani deploy --prod'

  useEffect(() => {
    if (!fullyVisible) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setCharCount(i)
      if (i >= CODE_CHARS_WIDE.length) clearInterval(interval)
    }, 18)
    return () => clearInterval(interval)
  }, [fullyVisible])

  useEffect(() => {
    if (charCount < CODE_CHARS_WIDE.length) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setCmdCount(i)
      if (i >= CMD.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [charCount])

  useEffect(() => {
    if (cmdCount < CMD.length) return
    const timers = [
      setTimeout(() => setTerminalStep(1), 200),
      setTimeout(() => setTerminalStep(2), 900),
      setTimeout(() => setTerminalStep(3), 1700),
      setTimeout(() => setTerminalStep(4), 2400),
      setTimeout(() => setTerminalStep(5), 2700),
    ]
    return () => timers.forEach(clearTimeout)
  }, [cmdCount])

  const done = charCount >= CODE_CHARS_WIDE.length
  const visibleChars = CODE_CHARS_WIDE.slice(0, charCount)
  const lastChar = visibleChars[visibleChars.length - 1]
  const currentLineIndex = lastChar?.lineIndex ?? -1
  const lineChars: CodeChar[][] = Array.from({ length: CODE_DEF_WIDE.length }, () => [])
  visibleChars.forEach(c => lineChars[c.lineIndex].push(c))

  return (
    <div ref={ref} className="w-full h-full flex items-center">
      <style>{`@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
      <div className="w-full rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xl font-mono">
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
        {/* Code | Terminal */}
        <div className="grid grid-cols-[1.4fr_1fr]">
          <div className="flex text-[10px] leading-5 border-r border-gray-100">
            <div className="py-3 px-2 text-right select-none text-gray-300 border-r border-gray-100" style={{ minWidth: '24px' }}>
              {CODE_DEF_WIDE.map((_, n) => (
                <div key={n}>{n + 1}</div>
              ))}
            </div>
            <div className="py-3 px-3 overflow-hidden">
              {CODE_DEF_WIDE.map((line, li) => {
                const chars = lineChars[li]
                if (chars.length === 0 && li > currentLineIndex) return <div key={li} style={{ visibility: 'hidden' }}>&nbsp;</div>
                return (
                  <div key={li} className={line.indent ?? ''}>
                    {chars.map((c, ci) => (
                      <span key={ci} className={c.className}>{c.char}</span>
                    ))}
                    {li === currentLineIndex && !done && (
                      <span className="inline-block w-[5px] h-[10px] bg-[#F94500] ml-px animate-pulse align-middle" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="px-3 py-3 bg-gray-50 space-y-0.5">
            <div className="text-[10px] text-gray-400 mb-1 flex items-center gap-1">
              <span>$</span>
              {cmdCount === 0
                ? <div className="w-1.5 h-3 bg-[#F94500]" style={{ animation: 'blink 1s steps(1) infinite' }} />
                : <span>{CMD.slice(0, cmdCount)}{cmdCount < CMD.length && <span className="inline-block w-[5px] h-[9px] bg-[#F94500] ml-px align-middle" style={{ animation: 'blink 1s steps(1) infinite' }} />}</span>
              }
            </div>
            <div className="text-[10px] text-gray-500" style={{ visibility: terminalStep >= 1 ? 'visible' : 'hidden' }}>Preparing...</div>
            <div className="text-[10px] text-emerald-500" style={{ visibility: terminalStep >= 2 ? 'visible' : 'hidden' }}>✓ Code reviewed</div>
            <div className="text-[10px] text-emerald-500" style={{ visibility: terminalStep >= 3 ? 'visible' : 'hidden' }}>✓ Tests passed</div>
            <div className="text-[10px] text-emerald-500 font-medium" style={{ visibility: terminalStep >= 4 ? 'visible' : 'hidden' }}>✓ Your app is live</div>
            <div className="flex items-center gap-1 pt-0.5" style={{ visibility: terminalStep >= 5 ? 'visible' : 'hidden' }}>
              <span className="text-gray-400 text-[10px]">$</span>
              <div className="w-1.5 h-3 bg-[#F94500]" style={{ animation: 'blink 1s steps(1) infinite' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepIllustration({ step, sectionEntered, wide }: { step: number; sectionEntered: boolean; wide?: boolean }) {
  if (wide) {
    switch (step) {
      case 0: return <DiscoverWide active={sectionEntered} />
      case 1: return <DesignWide />
      case 2: return <BuildWide />
      case 3: return <LaunchIllustration />
      default: return null
    }
  }
  switch (step) {
    case 0: return <DiscoverIllustration active={sectionEntered} />
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
      <div className="mx-auto max-w-7xl px-4 pt-[clamp(64px,8.75vw,112px)] pb-4">
        <div className="mb-8 flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1 C12.6 7 14 10.6 22 12 C14 13.4 12.6 17 12 23 C11.4 17 10 13.4 2 12 C10 10.6 11.4 7 12 1 Z" fill="#F94500" />
          </svg>
          <p className="text-tooltip-l font-regular uppercase text-primary-600">Our process</p>
        </div>
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2
            className="font-switzer text-[clamp(48px,7vw,88px)] font-semibold leading-none text-white"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            <span className="italic">How we</span>
            <br />
            <em className="font-reckless font-light not-italic text-primary-600">actually</em> <span className="font-switzer italic text-white">work?</span>
          </h2>
          <p className="max-w-lg text-[17px] leading-relaxed text-palette-300 indent-8 min-[550px]:max-md:ml-auto" style={{ textAlign: 'justify' }}>
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
          {/* Original: max-w-7xl — restore if margin feels too wide on large screens */}
          <div className="mx-auto flex h-full max-w-[1350px] items-center gap-0 px-5">
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
            <div className="flex flex-1 flex-col justify-center gap-0 md:gap-14 lg:flex-row lg:items-center lg:gap-12">
              {/* Number + text — own row on tablet; lg:contents dissolves wrapper so all 3 sit in one row at ≥1024 */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:contents">
              {/* Step number — large typographic anchor */}
              <div className="relative w-full shrink-0 md:w-64">
                <span
                  className="block font-clash font-medium leading-none text-white/15 select-none"
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

                    <p className="max-w-md text-[clamp(15px,1.1vw,16px)] leading-relaxed text-palette-400">
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
              </div>

              {/* Step illustration — wide variant on tablet (768–1023) */}
              <div className="hidden w-full max-w-[750px] shrink-0 md:block lg:hidden" style={{ height: 'clamp(230px, 30vw, 300px)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
                    className="h-full w-full"
                  >
                    <StepIllustration step={activeStep} sectionEntered={sectionEntered} wide />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Step illustration — square variant on desktop (≥1024) */}
              <div className="hidden shrink-0 lg:block" style={{ width: 'clamp(280px, 26vw, 420px)', height: 'clamp(280px, 26vw, 420px)' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
                    className="h-full w-full"
                  >
                    <StepIllustration step={activeStep} sectionEntered={sectionEntered} />
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
