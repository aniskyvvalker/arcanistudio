'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { ui, defaultLang, type Lang } from '../../i18n/ui'

export default function FAQList({ lang = defaultLang }: { lang?: Lang }) {
  const faqs = ui[lang].faq.items
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
