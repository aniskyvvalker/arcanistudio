import { useState, useRef, useLayoutEffect } from 'react'
import { ArrowRight, ArrowLeft, ArrowUpRight, Check } from 'lucide-react'

const CHOICE_STEPS = [
  {
    question: "What are you building?",
    field: 'project' as const,
    options: ['Web Design & Development', 'Brand Identity', 'UI / UX Design', 'Something else'],
  },
  {
    question: "What's your budget?",
    field: 'budget' as const,
    options: ['Under $1,000', '$1,000 – $5,000', '$5,000 – $15,000', '$15,000 and above'],
  },
  {
    question: "When do you need it?",
    field: 'timeline' as const,
    options: ['As soon as possible', '1 – 3 months', '3 – 6 months', 'No rush, flexible'],
  },
]

type Selections = { project: string; budget: string; timeline: string }
type Contact = { name: string; email: string; message: string }

export default function ContactSection() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState<'fwd' | 'bwd'>('fwd')
  const [animKey, setAnimKey] = useState(0)
  const [selections, setSelections] = useState<Selections>({ project: '', budget: '', timeline: '' })
  const [contact, setContact] = useState<Contact>({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const backRef = useRef<HTMLButtonElement>(null)
  const [backWidth, setBackWidth] = useState(0)

  useLayoutEffect(() => {
    if (backRef.current) setBackWidth(backRef.current.offsetWidth)
  }, [])

  const TOTAL = 4

  function navigate(next: number) {
    setDir(next > step ? 'fwd' : 'bwd')
    setStep(next)
    setAnimKey(k => k + 1)
  }

  function pick(field: keyof Selections, value: string) {
    setSelections(s => ({ ...s, [field]: value }))
    setTimeout(() => navigate(step + 1), 150)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setContact(c => ({ ...c, [name]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const body = [
      `Project: ${selections.project}`,
      `Budget: ${selections.budget}`,
      `Timeline: ${selections.timeline}`,
      ``,
      `Name: ${contact.name}`,
      `Email: ${contact.email}`,
      ``,
      contact.message,
    ].join('\n')
    window.location.href = `mailto:hello@arcanistudio.com?subject=New project inquiry&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  if (sent) {
    return (
      <section id="contact" className="bg-palette-950 flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <p className="font-reckless text-[clamp(40px,6vw,72px)] font-light italic text-white leading-[1.05]">
            We'll be in touch<span style={{ color: '#F94500' }}>.</span>
          </p>
          <p className="mt-5 text-palette-400 text-[15px]">We reply within 24 hours.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="bg-palette-950 overflow-x-clip">

      {/* Progress bar + step counter */}
      <div className="px-6 pt-16 md:px-12">
        <div className="mx-auto max-w-[900px]">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-[11px] font-medium text-palette-600 tabular-nums tracking-widest uppercase shrink-0">
              Step {step + 1} of {TOTAL}
            </span>
            <div
              className="flex flex-1 gap-1.5"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={0}
              aria-valuemax={TOTAL}
            >
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} className="h-[4px] flex-1 rounded-full bg-palette-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: i < step ? '100%' : '0%', backgroundColor: '#F94500' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-6 py-12 md:px-12 md:py-16">

        {/* Animated step content only */}
        <div key={animKey} className={dir === 'fwd' ? 'step-enter-fwd' : 'step-enter-bwd'}>
          {step < 3 ? (
            <ChoiceStep
              config={CHOICE_STEPS[step]}
              selected={selections[CHOICE_STEPS[step].field]}
              onPick={(val) => pick(CHOICE_STEPS[step].field, val)}
            />
          ) : (
            <ContactStep
              contact={contact}
              onChange={handleChange}
              onSubmit={submit}
              canSubmit={!!(contact.name && contact.email && contact.message)}
            />
          )}
        </div>

        {/* Navigation buttons — outside animated wrapper so they don't re-animate */}
        {step < 3 && (
          <div className="mt-10 flex items-center gap-4">
            <div
              className="overflow-hidden transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ maxWidth: step > 0 ? `${backWidth}px` : '0px' }}
            >
              <button
                ref={backRef}
                onClick={() => navigate(step - 1)}
                className="group flex items-center gap-3 rounded-full border border-palette-700 px-7 py-3.5 text-[15px] font-medium text-palette-300 whitespace-nowrap hover:border-palette-500 hover:text-white transition-[transform,border-color,color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: step > 0 ? 'translateX(0)' : `translateX(-${backWidth}px)` }}
              >
                <ArrowLeft size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back
              </button>
            </div>
            <button
              onClick={() => navigate(step + 1)}
              disabled={!selections[CHOICE_STEPS[step].field]}
              className="group flex items-center gap-3 rounded-full px-7 py-3.5 text-[15px] font-medium transition-[background-color,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: selections[CHOICE_STEPS[step].field] ? '#F94500' : '#262626', color: '#fff' }}
            >
              Continue
              <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes stepInFwd {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes stepInBwd {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .step-enter-fwd, .step-enter-bwd { will-change: transform, opacity; backface-visibility: hidden; transform: translateZ(0); }
        .step-enter-fwd { animation: stepInFwd 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .step-enter-bwd { animation: stepInBwd 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .step-enter-fwd, .step-enter-bwd { animation: none; }
        }
      `}</style>
    </section>
  )
}

function ChoiceStep({
  config, selected, onPick,
}: {
  config: typeof CHOICE_STEPS[number]
  selected: string
  onPick: (val: string) => void
}) {
  return (
    <div>
      <h2
        className="font-reckless font-light italic text-white leading-[1.05] mb-10"
        style={{ fontSize: 'clamp(36px, 5vw, 56px)' }}
      >
        {config.question}
      </h2>

      <ol className="divide-y divide-palette-800/60" role="list">
        {config.options.map((option, i) => {
          const isActive = selected === option
          return (
            <li key={option}>
              <button
                onClick={() => onPick(option)}
                className="group w-full flex items-center gap-6 py-5 text-left transition-colors duration-150"
                aria-pressed={isActive}
              >
                <span
                  className="tabular-nums text-[13px] w-6 shrink-0 transition-colors duration-150"
                  style={{ color: isActive ? '#F94500' : '#525252' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="flex-1 font-light transition-colors duration-150"
                  style={{
                    fontSize: 'clamp(18px, 2.5vw, 24px)',
                    color: isActive ? '#ffffff' : '#A1A1A1',
                  }}
                >
                  {option}
                </span>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: isActive ? '#F94500' : 'transparent',
                    border: isActive ? '1.5px solid #F94500' : '1.5px solid #404040',
                  }}
                >
                  {isActive && <Check size={11} strokeWidth={2.5} color="#fff" />}
                </span>
              </button>
            </li>
          )
        })}
        <li className="border-t border-palette-800/60" />
      </ol>
    </div>
  )
}

function ContactStep({
  contact, onChange, onSubmit, canSubmit,
}: {
  contact: Contact
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  canSubmit: boolean
}) {
  return (
    <div>
      <h2
        className="font-reckless font-light italic text-white leading-[1.05] mb-10"
        style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
      >
        {"Almost\nthere."}
      </h2>

      <form onSubmit={onSubmit} className="flex flex-col">
        <div className="grid sm:grid-cols-2 border-t border-palette-800/60">
          <InputField label="Your name" name="name" type="text" value={contact.name} onChange={onChange} required className="border-b sm:border-b-0 sm:border-r border-palette-800/60 pr-0 sm:pr-8" />
          <InputField label="Email address" name="email" type="email" value={contact.email} onChange={onChange} required className="border-b border-palette-800/60 pl-0 sm:pl-8" />
        </div>

        <div className="border-t border-palette-800/60 py-6">
          <label className="block text-[11px] font-medium text-palette-600 mb-4 tracking-widest uppercase">
            Tell us about the project
          </label>
          <textarea
            name="message"
            value={contact.message}
            onChange={onChange}
            required
            rows={5}
            placeholder="Goals, timeline, context — anything that helps us understand what you need."
            className="w-full bg-transparent text-white text-[15px] font-light leading-relaxed placeholder:text-palette-700 focus:outline-none resize-none"
          />
        </div>

        <div className="border-t border-palette-800/60 pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <p className="text-[12px] text-palette-600 max-w-xs leading-relaxed">
            Opens your email client with details prefilled. We reply within 24 hours.
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="group inline-flex shrink-0 items-center gap-3 rounded-full px-7 py-3.5 text-[15px] font-medium transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#F94500', color: '#fff' }}
          >
            Send message
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/15">
              <ArrowUpRight size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-5 group-hover:-translate-y-5" />
              <ArrowUpRight size={14} strokeWidth={1.5} className="absolute -translate-x-5 translate-y-5 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}

function InputField({
  label, name, type, value, onChange, required, className = '',
}: {
  label: string; name: string; type: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean; className?: string
}) {
  return (
    <div className={`py-6 ${className}`}>
      <label className="block text-[11px] font-medium text-palette-600 mb-3 tracking-widest uppercase">
        {label}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange} required={required}
        placeholder={label}
        className="w-full bg-transparent text-white text-[15px] font-light placeholder:text-palette-700 focus:outline-none"
      />
    </div>
  )
}
