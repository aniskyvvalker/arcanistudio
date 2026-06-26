'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'What types of applications do you build?',
    a: 'We build web applications, mobile apps (iOS and Android), AI-integrated management systems (CRM, ERP), custom dashboards, and SaaS platforms. Every solution is tailored to your needs.',
  },
  {
    q: 'What does the process look like?',
    a: 'It starts with a free 30-minute discovery call. From there, we move through five clear stages: strategy & goals, copywriting, UX/UI design, development, and delivery with onboarding. You review and approve each phase before we move to the next.',
  },
  {
    q: 'How long does a project take?',
    a: 'Timelines depend on scope. A landing page ships in 7–10 business days, a full website in 3–5 weeks, and complex systems like CRMs or ERPs run 3–6 months. After the discovery call, you get a precise schedule — and we hold to it.',
  },
  {
    q: 'How does payment work?',
    a: 'Most projects are split into milestones: 40% upfront to kick off, 30% at mid-project, and 30% final payment on delivery.',
  },
  {
    q: 'Do I own the designs and the code?',
    a: 'Yes — completely. On final payment, the code, the designs, and the data are all yours. No license traps, no hostage situations.',
  },

  {
    q: 'Will my site rank well on Google (SEO)?',
    // FR: 'Oui — le SEO est intégré à chaque projet : structure sémantique propre, balises meta, temps de chargement rapides, design responsive et sitemap... Tout ce qui compte pour un bon positionnement sur Google. C\'est un avantage technique concret dès le lancement.',
    a: 'Yes — SEO is built into every project: clean semantic structure, meta tags, fast load times, responsive design, and a sitemap... Everything that matters for ranking well on Google. A concrete technical edge, not an afterthought.',
  },
  // {
  //   q: 'Do you work with international clients?',
  //   a: "Yes. We work remotely with teams across North America and Europe, adapt to your timezone for calls, and keep everything async and documented in between.",
  // },
  {
    q: 'Do you provide ongoing support and maintenance?',
    a: "Yes. For ongoing needs, an optional monthly plan covers maintenance, updates, and technical check-ins that keep your site secure and up to date — a practical way to have a dedicated developer on call, without hiring one.",
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
