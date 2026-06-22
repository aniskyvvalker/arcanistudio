'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'How much does a project cost?',
    a: "Every project is scoped to what it actually needs — most engagements start around $4,000 and scale with complexity. Tell us what you're building and we'll send a clear, fixed quote before any work begins. No surprise invoices.",
  },
  {
    q: 'How long does a typical project take?',
    a: 'A focused brand site runs 4–6 weeks. Larger builds with custom functionality land closer to 8–12. We give you a real timeline up front and hold to it.',
  },
  {
    q: 'What does the process look like?',
    a: "Three phases: Discover (we map your users, goals, and constraints), Design (high-fidelity interfaces built for your product, not a template), and Build (production code, fast and accessible by default). One team, start to finish — no handoff gaps.",
  },
  {
    q: 'Do I own the designs and the code?',
    a: 'Yes — completely. On final payment, every file, design asset, and line of code is yours. No license traps, no hostage situations.',
  },
  {
    q: 'What happens after launch?',
    a: "We don't disappear. You get a window of post-launch support to iron out anything, and for teams that want ongoing work, we offer monthly retainers for design and development.",
  },
  {
    q: 'Do you work with clients outside Algeria?',
    a: "Most of our clients are. We work remotely with teams across North America and Europe, adapt to your timezone for calls, and keep everything async and documented in between.",
  },
]

export default function FAQList() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} className={i !== faqs.length - 1 ? 'border-b border-palette-800/60' : ''}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 py-7 text-left"
            aria-expanded={openIdx === i}
          >
            <span className="text-[clamp(17px,2vw,21px)] font-normal text-white transition-colors duration-200">
              {faq.q}
            </span>
            {openIdx === i ? (
              <Minus size={24} strokeWidth={1.5} className="shrink-0 text-primary-600" />
            ) : (
              <Plus size={24} strokeWidth={1.5} className="shrink-0 text-palette-500" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="max-w-prose pb-7 text-[15px] leading-relaxed text-palette-400">
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
