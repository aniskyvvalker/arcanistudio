import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const steps = [
  {
    number: '01',
    title: 'Discover',
    verb: 'Map the territory',
    body: 'We dig into your users, competitors, and constraints before touching a pixel. Interviews, flow audits, technical scoping — the work that makes design decisions obvious, not arbitrary.',
    color: '#CE3000',
    shape: 'icosahedron',
  },
  {
    number: '02',
    title: 'Design',
    verb: 'Build the language',
    body: 'High-fidelity interfaces and a design system built for your product, not borrowed from a template. Every decision is intentional — spacing, type, motion, color — argued and resolved.',
    color: '#F94500',
    shape: 'torus',
  },
  {
    number: '03',
    title: 'Build',
    verb: 'Ship production code',
    body: 'Astro, React, and whatever the stack demands. Pixel-perfect implementation, performant by default, accessible from the start. Not "developer handoff" — one team, start to finish.',
    color: '#FF6207',
    shape: 'octahedron',
  },
  {
    number: '04',
    title: 'Launch',
    verb: 'Refine in the real world',
    body: 'Deployment, QA, performance tuning. Then we watch real users and iterate. A site that ships is a hypothesis — we help you confirm or revise it.',
    color: '#FF852F',
    shape: 'dodecahedron',
  },
]

type ShapeType = 'icosahedron' | 'torus' | 'octahedron' | 'dodecahedron'

function StepGeometry({ shape, color, isActive }: { shape: ShapeType; color: string; isActive: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetScale = isActive ? 1 : 0.7
  const currentScale = useRef(targetScale)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.3
    meshRef.current.rotation.y += delta * 0.5
    currentScale.current += (targetScale - currentScale.current) * 0.08
    meshRef.current.scale.setScalar(currentScale.current)
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'icosahedron': return new THREE.IcosahedronGeometry(1.4, 0)
      case 'torus': return new THREE.TorusGeometry(1.1, 0.35, 8, 24)
      case 'octahedron': return new THREE.OctahedronGeometry(1.5, 0)
      case 'dodecahedron': return new THREE.DodecahedronGeometry(1.3, 0)
    }
  }, [shape])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  )
}

function SceneCanvas({ activeStep }: { activeStep: number }) {
  const step = steps[activeStep]
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.5} />
      {steps.map((s, i) => (
        <group key={s.shape} visible={i === activeStep}>
          <StepGeometry shape={s.shape as ShapeType} color={s.color} isActive={i === activeStep} />
        </group>
      ))}
    </Canvas>
  )
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
  const reducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * steps.length), steps.length - 1)
    setActiveStep(idx)
  })

  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="bg-palette-950">
      {/* Header — not sticky */}
      <div className="mx-auto max-w-7xl px-5 pt-28 pb-4">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:gap-8">
          <h2
            className="font-switzer text-[clamp(48px,7vw,88px)] font-medium leading-none text-white"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            How we
            <br />
            <em className="font-reckless font-light not-italic text-primary-600">actually</em> work
          </h2>
          <p className="max-w-xs text-p-regular leading-relaxed text-palette-400 md:text-right">
            Four phases. One team. No account managers between you and the people doing the work.
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
              {/* Track */}
              <div className="absolute inset-y-16 left-1/2 w-px -translate-x-1/2 bg-white/10" />
              {/* Fill — clipped to track bounds */}
              <div className="absolute inset-y-16 left-1/2 w-px -translate-x-1/2 overflow-hidden">
                <motion.div
                  className="w-full origin-top bg-primary-600"
                  style={{ height: progressHeight }}
                />
              </div>
              {/* Dots */}
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!containerRef.current) return
                    const rect = containerRef.current.getBoundingClientRect()
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
                      backgroundColor: i <= activeStep ? '#F94500' : 'transparent',
                      borderColor: i <= activeStep ? '#F94500' : 'rgba(255,255,255,0.3)',
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

              {/* Three.js canvas */}
              <div className="hidden h-64 w-64 shrink-0 lg:block xl:h-80 xl:w-80">
                <SceneCanvas activeStep={activeStep} />
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
