import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const services = [
  {
    id: 1,
    number: '01',
    name: 'GROWTH MARKETING',
    description: 'Accelerate your growth with data-driven marketing strategies that convert.',
  },
  {
    id: 2,
    number: '02',
    name: 'PRODUCT DESIGN',
    description: 'Create beautiful, intuitive products that users love.',
  },
  {
    id: 3,
    number: '03',
    name: 'WEB DEVELOPMENT',
    description: 'Build fast, scalable web applications with modern technologies.',
  },
  {
    id: 4,
    number: '04',
    name: 'BRANDING STRATEGY',
    description: 'Develop a compelling brand identity that stands out.',
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
            className="w-full border-b border-palette-800 py-6 text-left transition-colors hover:bg-palette-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8 flex-1">
                <span className="w-12 text-p-regular font-semibold text-palette-500">
                  [{service.number}]
                </span>
                <span className="text-h4 font-semibold text-palette-300">
                  {service.name}
                </span>
              </div>
              <div className="flex-shrink-0">
                {expandedId === service.id ? (
                  <Minus size={24} className="text-primary-600" />
                ) : (
                  <Plus size={24} className="text-palette-500" />
                )}
              </div>
            </div>

            {expandedId === service.id && (
              <div className="mt-4 ml-20 text-p-regular text-palette-400">
                {service.description}
              </div>
            )}
          </button>
        </div>
      ))}
    </div>
  )
}
