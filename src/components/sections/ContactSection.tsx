import { useState, useRef, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' })
  const leftRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nProject: ${form.project}\n\nMessage: ${form.message}`
    window.location.href = `mailto:hello@arcanistudio.com?subject=New project inquiry&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  useEffect(() => {
    const el = leftRef.current
    const glow = glowRef.current
    if (!el || !glow) return

    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      glow!.style.transform = `translate(${x - 200}px, ${y - 200}px)`
    }

    el.addEventListener('mousemove', onMove)
    return () => el.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section id="contact" className="bg-palette-950">
      <div className="mx-auto grid min-h-screen max-w-[1400px] md:grid-cols-2">

        {/* LEFT */}
        <div
          ref={leftRef}
          className="relative flex flex-col justify-between overflow-hidden border-r border-palette-800/60 px-10 py-16 md:px-16 md:py-24"
        >
          {/* cursor glow */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-primary-600/10 blur-[100px] transition-transform duration-300 ease-out"
            style={{ top: 0, left: 0 }}
          />

          <div className="relative z-10">
            <span className="inline-block rounded-full border border-palette-800 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-palette-500">
              Contact
            </span>
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            <h2 className="text-[clamp(40px,5.5vw,80px)] font-semibold leading-[1.05] text-white">
              Got a project<br />
              in <span className="font-reckless italic text-primary-600">mind?</span>
            </h2>

            <p className="max-w-xs text-body-l leading-relaxed text-palette-400">
              Tell us what you're working on. We'll get back within 24 hours.
            </p>

            <a
              href="mailto:hello@arcanistudio.com"
              className="group inline-flex items-center gap-2 text-body-m text-palette-400 transition-colors hover:text-white"
            >
              hello@arcanistudio.com
              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-palette-800" />
            <span className="text-tooltip-s text-palette-600">Algeria — working globally</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center px-10 py-16 md:px-16 md:py-24">
          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="text-[clamp(28px,3vw,48px)] font-semibold text-white">
                We'll be in touch<span className="text-primary-600">.</span>
              </p>
              <p className="text-body-l text-palette-400">Check your email — we reply fast.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                <Field label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-widest text-palette-500">
                  Project type
                </label>
                <select
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-palette-800 bg-transparent px-4 py-3.5 text-body-m text-white focus:border-palette-600 focus:outline-none transition-colors"
                >
                  <option value="" disabled className="bg-palette-900">Select a service</option>
                  <option value="Web Design & Development" className="bg-palette-900">Web Design & Development</option>
                  <option value="Brand Identity" className="bg-palette-900">Brand Identity</option>
                  <option value="UI/UX Design" className="bg-palette-900">UI/UX Design</option>
                  <option value="Other" className="bg-palette-900">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-medium uppercase tracking-widest text-palette-500">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project, goals, timeline…"
                  className="resize-none rounded-xl border border-palette-800 bg-transparent px-4 py-3.5 text-body-m text-white placeholder:text-palette-700 focus:border-palette-600 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="group flex items-center justify-between rounded-full bg-primary-600 px-6 py-3.5 text-body-m font-medium text-white transition-colors hover:bg-primary-700"
              >
                <span>Send message</span>
                <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/15">
                  <ArrowUpRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-6 group-hover:-translate-y-6" />
                  <ArrowUpRight size={16} strokeWidth={1.5} className="absolute -translate-x-6 translate-y-6 transition-transform duration-500 group-hover:translate-x-0 group-hover:translate-y-0" />
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({
  label, name, type, placeholder, value, onChange, required,
}: {
  label: string
  name: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium uppercase tracking-widest text-palette-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-palette-800 bg-transparent px-4 py-3.5 text-body-m text-white placeholder:text-palette-700 focus:border-palette-600 focus:outline-none transition-colors"
      />
    </div>
  )
}
