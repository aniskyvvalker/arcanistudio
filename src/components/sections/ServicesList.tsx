import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus, ChevronRight } from 'lucide-react'
import { ui, defaultLang, type Lang } from '../../i18n/ui'

type Service = {
  id: number
  name: string
  nameLines: string[]
  description: string
  tags: string[]
  bundled?: boolean
}

export default function ServicesList({ lang = defaultLang }: { lang?: Lang }) {
  const t = ui[lang].services
  const services = t.items as Service[]
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const toggle = (id: number) => setExpandedId(expandedId === id ? null : id)

  const standalone = services.filter((s) => !s.bundled)
  const bundled = services.filter((s) => s.bundled)

  return (
    <div>
      <GroupLabel className="mt-12">{t.whatWeBuild}</GroupLabel>
      <div className="space-y-0">
        {standalone.map((service, i) => (
          <ServiceRow
            key={service.id}
            service={service}
            number={String(i + 1).padStart(2, '0')}
            isExpanded={expandedId === service.id}
            onToggle={() => toggle(service.id)}
            isLast={i === standalone.length - 1}
            t={t}
          />
        ))}
      </div>

      <GroupLabel className="mt-16">{t.builtInto}</GroupLabel>
      <div className="space-y-0">
        {bundled.map((service, i) => (
          <ServiceRow
            key={service.id}
            service={service}
            number={null}
            isExpanded={expandedId === service.id}
            onToggle={() => toggle(service.id)}
            isLast={i === bundled.length - 1}
            t={t}
          />
        ))}
      </div>
    </div>
  )
}

function GroupLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-4 flex items-center gap-4 ${className}`}>
      <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-palette-500">{children}</span>
      <span className="h-px flex-1 bg-palette-300" />
    </div>
  )
}

function ServiceRow({
  service, number, isExpanded, onToggle, isLast, t,
}: {
  service: Service
  number: string | null
  isExpanded: boolean
  onToggle: () => void
  isLast: boolean
  t: (typeof ui)[Lang]['services']
}) {
  return (
    <button
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) return
        onToggle()
      }}
      className={`group w-full py-8 text-left ${!isLast ? 'border-b border-palette-300' : ''}`}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[3rem_1fr_auto] md:items-start">
        <span className={`col-span-2 w-12 text-p-regular font-light transition-colors duration-300 md:col-span-1 ${isExpanded ? 'text-primary-600' : 'text-palette-500 group-hover:text-primary-600'}`}>
          {number ? `[${number}]` : <span className="inline-block text-5xl font-light leading-none text-primary-600">*</span>}
        </span>
        <span className={`max-[410px]:whitespace-normal whitespace-nowrap text-left text-[26px] font-normal leading-[1.2] transition-all duration-300 sm:text-[32px] md:mx-auto md:w-1/2 md:text-[36px] lg:text-[40px] ${isExpanded ? 'text-palette-950' : 'text-palette-500 group-hover:translate-x-2 group-hover:text-palette-950'}`}>
          {service.nameLines.length > 1 ? (
            <>
              <span className="max-[410px]:block hidden">
                {service.nameLines.map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
              <span className="max-[410px]:hidden">{service.name}</span>
            </>
          ) : service.name}
        </span>
        <div className="flex-shrink-0 justify-self-end">
          {isExpanded ? (
            <Minus size={24} strokeWidth={1.5} className="text-primary-600" />
          ) : (
            <Plus size={24} strokeWidth={1.5} className="text-palette-500 transition-colors duration-300 group-hover:text-primary-600" />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 mt-4 md:grid-cols-[3rem_1fr_auto]">
              <div className="col-span-2 md:col-span-1 md:col-start-2 md:mx-auto md:w-1/2">
                <p className="text-p-regular font-light text-palette-600">{service.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-palette-300 px-3 py-1 text-[13px] font-light text-palette-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {service.bundled ? (
                  <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-palette-100 py-2 px-4 text-[14px] font-light text-palette-600">
                    <span className="text-primary-600">*</span>
                    {t.includedNote}
                  </p>
                ) : (
                  <a
                    href="#contact"
                    className="group/cta mt-4 inline-flex items-center gap-3 rounded-full bg-primary-600 py-2 pl-5 pr-2 text-[16px] font-light text-white"
                  >
                    <span className="relative h-[1.2em] overflow-hidden">
                      <span className="flex h-full items-center transition-transform duration-500 group-hover/cta:-translate-y-[150%]">{t.getStarted}</span>
                      <span className="absolute left-0 top-0 flex h-full translate-y-[150%] items-center transition-transform duration-500 group-hover/cta:translate-y-0">{t.getStarted}</span>
                    </span>
                    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white text-palette-950">
                      <ChevronRight size={24} strokeWidth={1.5} className="transition-transform duration-500 group-hover/cta:translate-x-8" />
                      <ChevronRight size={24} strokeWidth={1.5} className="absolute -translate-x-8 transition-transform duration-500 group-hover/cta:translate-x-0" />
                    </span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}
