import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

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
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-8 flex-1">
                <span className={`w-12 text-p-regular font-light ${expandedId === service.id ? 'text-primary-600' : 'text-palette-600'}`}>
                  [{service.number}]
                </span>
                <span className={`mx-auto w-1/2 text-left text-h3 font-normal ${expandedId === service.id ? 'text-palette-950' : 'text-palette-600'}`}>
                  {service.name}
                </span>
              </div>
              <div className="flex-shrink-0">
                {expandedId === service.id ? (
                  <Minus size={24} strokeWidth={1.5} className="text-primary-600" />
                ) : (
                  <Plus size={24} strokeWidth={1.5} className="text-palette-600" />
                )}
              </div>
            </div>

            {expandedId === service.id && (
              <div className="mt-4 ml-20 text-p-regular font-light text-palette-600">
                {service.description}
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
