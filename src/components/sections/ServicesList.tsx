import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus, ChevronRight } from 'lucide-react'

type Service = {
  id: number
  name: string
  description: string
  tags: string[]
  bundled?: boolean
}

const services: Service[] = [
  {
    id: 1,
    name: 'WEB DEVELOPMENT',
    description: 'We build fast, scalable web applications with modern frameworks and clean architecture. From landing pages to complex platforms, every build is optimized for speed, SEO, and seamless performance across devices.',
    tags: ['React', 'Next.js', 'Astro', 'TypeScript'],
  },
  {
    id: 2,
    name: 'BRANDING & UI/UX DESIGN',
    description: 'We craft compelling brand identities and intuitive interfaces that users genuinely love. Through research-driven design and pixel-perfect execution, we turn your vision into experiences that convert and stick.',
    tags: ['Figma', 'Brand Identity', 'Design Systems', 'Prototyping'],
    bundled: true,
  },
  {
    id: 3,
    name: 'MOBILE APPS',
    description: 'We design and develop native and cross-platform mobile apps that feel effortless to use. From concept to App Store launch, we deliver smooth, reliable experiences your users will reach for every day.',
    tags: ['React Native', 'iOS', 'Android', 'Expo'],
  },
  {
    id: 4,
    name: 'AUTOMATION & AI',
    description: 'We streamline your workflows and embed AI-powered solutions that cut manual work and scale your output. From smart integrations to custom automations, we help your business move faster and think smarter.',
    tags: ['OpenAI', 'Workflow Automation', 'APIs', 'Custom Agents'],
  },
  {
    id: 5,
    name: 'E-COMMERCE SOLUTIONS',
    description: 'We launch and scale online stores engineered for conversion and growth. From storefront design to checkout optimization, we build shopping experiences that turn browsers into loyal buyers.',
    tags: ['Shopify', 'Stripe', 'Headless Commerce', 'CRO'],
  },
  {
    id: 6,
    name: 'SEO & GROWTH',
    description: 'We boost your visibility and rankings with proven, data-driven SEO strategies. From technical audits to content optimization, we get you found by the right people and keep you ahead of competitors.',
    tags: ['Technical SEO', 'Content Strategy', 'Analytics', 'Core Web Vitals'],
    bundled: true,
  },
]

export default function ServicesList() {
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const toggle = (id: number) => setExpandedId(expandedId === id ? null : id)

  const standalone = services.filter((s) => !s.bundled)
  const bundled = services.filter((s) => s.bundled)

  return (
    <div>
      <GroupLabel className="mt-12">What we build</GroupLabel>
      <div className="space-y-0">
        {standalone.map((service, i) => (
          <ServiceRow
            key={service.id}
            service={service}
            number={String(i + 1).padStart(2, '0')}
            isExpanded={expandedId === service.id}
            onToggle={() => toggle(service.id)}
            isLast={i === standalone.length - 1}
          />
        ))}
      </div>

      <GroupLabel className="mt-16">Built into every project</GroupLabel>
      <div className="space-y-0">
        {bundled.map((service, i) => (
          <ServiceRow
            key={service.id}
            service={service}
            number={null}
            isExpanded={expandedId === service.id}
            onToggle={() => toggle(service.id)}
            isLast={i === bundled.length - 1}
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
  service, number, isExpanded, onToggle, isLast,
}: {
  service: Service
  number: string | null
  isExpanded: boolean
  onToggle: () => void
  isLast: boolean
}) {
  return (
    <button
      onClick={onToggle}
      className={`group w-full py-8 text-left ${!isLast ? 'border-b border-palette-300' : ''}`}
    >
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[3rem_1fr_auto] md:items-start">
        <span className={`col-span-2 w-12 text-p-regular font-light transition-colors duration-300 md:col-span-1 ${isExpanded ? 'text-primary-600' : 'text-palette-500 group-hover:text-primary-600'}`}>
          {number ? `[${number}]` : <span className="inline-block text-5xl font-light leading-none text-primary-600">*</span>}
        </span>
        <span className={`max-[410px]:whitespace-normal whitespace-nowrap text-left text-[26px] font-normal leading-[1.2] transition-all duration-300 sm:text-[32px] md:mx-auto md:w-1/2 md:text-[36px] lg:text-[40px] ${isExpanded ? 'text-palette-950' : 'text-palette-500 group-hover:translate-x-2 group-hover:text-palette-950'}`}>
          {service.id === 2 ? (
            <><span className="max-[410px]:block hidden">BRANDING &<br />UI/UX DESIGN</span><span className="max-[410px]:hidden">BRANDING & UI/UX DESIGN</span></>
          ) : service.id === 5 ? (
            <><span className="max-[410px]:block hidden">E-COMMERCE<br />SOLUTIONS</span><span className="max-[410px]:hidden">E-COMMERCE SOLUTIONS</span></>
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
                    Included in every web &amp; app build — not sold standalone.
                  </p>
                ) : (
                  <a
                    href="#contact"
                    onClick={(e) => e.stopPropagation()}
                    className="group/cta mt-4 inline-flex items-center gap-3 rounded-full bg-primary-600 py-2 pl-5 pr-2 text-[16px] font-light text-white"
                  >
                    <span className="relative h-[1.2em] overflow-hidden">
                      <span className="flex h-full items-center transition-transform duration-500 group-hover/cta:-translate-y-[150%]">Get Started</span>
                      <span className="absolute left-0 top-0 flex h-full translate-y-[150%] items-center transition-transform duration-500 group-hover/cta:translate-y-0">Get Started</span>
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
