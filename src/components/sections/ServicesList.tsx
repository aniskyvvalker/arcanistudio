import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus, ChevronRight } from 'lucide-react'

const services = [
  {
    id: 1,
    number: '01',
    name: 'WEB DEVELOPMENT',
    description: 'Build fast, scalable web applications with modern technologies.',
  },
  {
    id: 2,
    number: '02',
    name: 'BRANDING & UI/UX DESIGN',
    description: 'Develop a compelling brand identity and intuitive interfaces users love.',
  },
  {
    id: 3,
    number: '03',
    name: 'MOBILE APPS',
    description: 'Design and build native and cross-platform mobile experiences.',
  },
  {
    id: 4,
    number: '04',
    name: 'AUTOMATION & AI',
    description: 'Streamline workflows and integrate AI-powered solutions into your business.',
  },
  {
    id: 5,
    number: '05',
    name: 'E-COMMERCE SOLUTIONS',
    description: 'Launch and scale online stores built for conversion and growth.',
  },
  {
    id: 6,
    number: '06',
    name: 'SEO OPTIMIZATION',
    description: 'Improve your visibility and rankings with proven SEO strategies.',
  },
]

export default function ServicesList() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-0">
      {services.map((service, index) => (
        <div key={service.id}>
          <button
            onClick={() =>
              setExpandedId(expandedId === service.id ? null : service.id)
            }
            className={`w-full py-8 text-left ${index !== services.length - 1 ? 'border-b border-palette-300' : ''}`}
          >
            <div className="grid grid-cols-2 items-center gap-3 md:grid-cols-[3rem_1fr_auto] md:items-start">
              <span className={`col-span-2 w-12 text-p-regular font-light md:col-span-1 ${expandedId === service.id ? 'text-primary-600' : 'text-palette-600'}`}>
                [{service.number}]
              </span>
              <span className={`text-left text-h3 font-normal md:mx-auto md:w-1/2 ${expandedId === service.id ? 'text-palette-950' : 'text-palette-600'}`}>
                {service.name}
              </span>
              <div className="flex-shrink-0 justify-self-end">
                {expandedId === service.id ? (
                  <Minus size={24} strokeWidth={1.5} className="text-primary-600" />
                ) : (
                  <Plus size={24} strokeWidth={1.5} className="text-palette-600" />
                )}
              </div>
            </div>

            <AnimatePresence initial={false}>
              {expandedId === service.id && (
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
                      <a
                        href="#contact"
                        className="group mt-4 inline-flex items-center gap-3 rounded-full bg-primary-600 py-2 pl-5 pr-2 text-[16px] font-light text-white"
                      >
                        <span className="relative h-[1.2em] overflow-hidden">
                          <span className="flex h-full items-center transition-transform duration-500 group-hover:-translate-y-[150%]">Get Started</span>
                          <span className="absolute left-0 top-0 flex h-full translate-y-[150%] items-center transition-transform duration-500 group-hover:translate-y-0">Get Started</span>
                        </span>
                        <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white text-palette-950">
                          <ChevronRight size={24} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-8" />
                          <ChevronRight size={24} strokeWidth={1.5} className="absolute -translate-x-8 transition-transform duration-500 group-hover:translate-x-0" />
                        </span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      ))}
    </div>
  )
}
