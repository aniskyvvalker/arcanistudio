/* ============================================================================
 * i18n copy — single source of truth for every visible string on the site.
 * ----------------------------------------------------------------------------
 * Shape MUST stay identical between `en` and `fr` (same keys, same array
 * lengths) — components index into these by position/key. Brand names, tech
 * tags (React, Figma…), and the small decorative dashboard labels inside the
 * Process illustrations are intentionally left untranslated.
 * ========================================================================== */

export const languages = { en: 'English', fr: 'Français' } as const
export const defaultLang = 'en'
export type Lang = 'en' | 'fr'

export const ui = {
  en: {
    meta: {
      homeTitle: 'arcaniStudio',
      title: 'arcaniStudio — Web & App Development Agency in Algeria',
      description:
        'arcaniStudio builds fast, scalable websites, mobile apps, and AI-powered systems for founders and brands in Algeria and beyond. Book a free discovery call.',
    },
    langBanner: {
      message: 'Prefer to read this in French?',
      switchLabel: 'Voir en français',
      dismiss: 'Dismiss',
    },
    notFound: {
      title: 'Page not found — arcaniStudio',
      headingParts: ['Page', 'Not', 'Available'],
      bodyLines: ["Sorry, this page isn't available", 'anymore or an error occurred.'],
      backHome: 'Back home',
    },
    nav: {
      tagline: 'Digital Solutions With Purpose',
      links: [
        { label: 'Services', href: '#services' },
        { label: 'Process', href: '#how-we-work' },
        { label: 'Work', href: '#portfolio' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
      cta: 'Book a call',
      mobileCta: 'Get started',
      openMenu: 'Open menu',
    },
    hero: {
      badgeNew: 'New',
      badgeText: 'Now booking projects for next quarter',
      titleLine1: 'Unleash Your',
      titleLine2: 'Digital Potential',
      subtitle:
        'You bring the vision. We bring it to life — design, code, testing, and deployment fully handled so you can focus on your business.',
      cta: 'Book A Call',
    },
    logos: {
      trustedBy: 'Trusted by teams everywhere',
    },
    stats: {
      eyebrow: 'Proof',
      heading: 'Numbers that speak for themselves',
      subtitle: 'We lead digital projects built for measurable results.',
      quote: 'Get a Quote',
      discover: 'Discover',
      items: [
        { value: '20+', label: 'Projects launched', description: 'For founders and brands who take their digital presence seriously.' },
        { value: '38%', label: 'Average conversion lift', description: 'Typical improvement clients see within six months' },
        { value: '4.9', label: 'Average client rating', description: "Because you don't just meet expectations; you exceed them" },
      ],
    },
    services: {
      ticker: 'OUR SERVICES',
      whatWeBuild: 'What we build',
      builtInto: 'Built into every project',
      getStarted: 'Get Started',
      includedNote: 'Included in every web & app build — not offered standalone.',
      items: [
        { id: 1, name: 'WEB DEVELOPMENT', nameLines: ['WEB DEVELOPMENT'], description: 'We build fast, scalable web applications with modern frameworks and clean architecture. From landing pages to complex platforms, every build is optimized for speed, SEO, and seamless performance across devices.', tags: ['React', 'Next.js', 'Astro', 'TypeScript'] },
        { id: 2, name: 'BRANDING & UI/UX DESIGN', nameLines: ['BRANDING &', 'UI/UX DESIGN'], description: 'We craft compelling brand identities and intuitive interfaces that users genuinely love. Through research-driven design and pixel-perfect execution, we turn your vision into experiences that convert and stick.', tags: ['Figma', 'Brand Identity', 'Design Systems', 'Prototyping'], bundled: true },
        { id: 3, name: 'MOBILE APPS', nameLines: ['MOBILE APPS'], description: 'We design and develop native and cross-platform mobile apps that feel effortless to use. From concept to App Store launch, we deliver smooth, reliable experiences your users will reach for every day.', tags: ['React Native', 'iOS', 'Android', 'Expo'] },
        { id: 4, name: 'AUTOMATION & AI', nameLines: ['AUTOMATION & AI'], description: 'We streamline your workflows and embed AI-powered solutions that cut manual work and scale your output. From smart integrations to custom automations, we help your business move faster and think smarter.', tags: ['OpenAI', 'Workflow Automation', 'APIs', 'Custom Agents'] },
        { id: 5, name: 'E-COMMERCE SOLUTIONS', nameLines: ['E-COMMERCE', 'SOLUTIONS'], description: 'We launch and scale online stores engineered for conversion and growth. From storefront design to checkout optimization, we build shopping experiences that turn browsers into loyal buyers.', tags: ['Shopify', 'E-Payment', 'Headless Commerce', 'CRO'] },
        { id: 6, name: 'SEO & GROWTH', nameLines: ['SEO & GROWTH'], description: 'We boost your visibility across search and AI answer engines with proven, data-driven strategies. From technical audits to content optimization, we get you found by the right people across every search surface, and keep you ahead of competitors.', tags: ['Technical SEO', 'Content Strategy', 'Analytics', 'Core Web Vitals'], bundled: true },
      ],
    },
    about: {
      eyebrow: 'Our mission',
      segments: [
        { text: "A brand isn't a logo.", className: 'font-semibold text-white' },
        { text: " It's the first conversation your product has with the world.", className: 'font-reckless italic font-light text-white' },
        { text: " A voice you recognize through the noise. A standard you don't renegotiate.", className: 'font-semibold text-white' },
        { text: ' Every pixel either earns trust or costs it.', className: 'font-semibold text-white' },
        { text: ' arcaniStudio', className: 'font-clash font-medium text-primary-600 text-[1.3em] mr-[0.05em]' },
        { text: ' exists for founders who refuse average — and who want their digital presence to hold the same standard as their product.', className: 'font-semibold text-white' },
      ],
    },
    process: {
      eyebrow: 'Our process',
      heading: { line1: 'How we', emphasis: 'actually', line2: 'work?' },
      intro:
        'Every project is built with intention. From strategy to launch, we move quickly, communicate clearly, with a focused process designed to eliminate friction and keep projects moving. We build digital products that not only look great, but drive real results.',
      steps: [
        { number: '01', title: 'Discovery', verb: 'Understand before we build', body: 'We dig into your users, competitors, and constraints before touching a pixel. Interviews, flow audits, technical scoping — You get a product blueprint, architecture document, and a clear quote.' },
        { number: '02', title: 'Design', verb: 'Validate the vision early', body: 'Every screen tested before development starts. Wireframes, flows, and interactive prototypes. You see it, you click it, you validate it — No surprises when we start building.' },
        { number: '03', title: 'Build', verb: 'Designs become real products', body: 'Your prototype becomes a real product. Clean code, solid architecture, transparent progress — and weekly check-ins so nothing drifts. Every feature reviewed, every detail intentional.' },
        { number: '04', title: 'Launch', verb: 'Beyond the finish line', body: 'Testing, polish, optimization. Once live, we stay with you — 30 days of post-launch support included, with monthly sprints available to keep your product evolving with your users. You leave with full ownership and zero technical dependency.' },
      ],
      dashboard: {
        insights: 'Insights',
        marketResearch: 'Market Research',
        comparedToLastYear: 'Compared to Last Year',
        vsLastYear: 'vs Last Year',
        userSegments: 'User Segments',
        activeCohorts: 'Active Cohorts',
        competitorAnalysis: 'Competitor Analysis',
        manageData: 'Manage data',
        viewManageData: 'View & manage your data',
        designSystem: 'Design System',
        palette: 'Palette',
        typeScale: 'Type Scale',
        components: 'Components',
        moodboard: 'Moodboard',
        uiMockups: 'UI Mockups',
        usabilityTesting: 'Usability Testing',
        usability: 'Usability',
        delivery: 'Delivery',
        preparingProject: 'Preparing your project...',
        codeReviewed: '✓ Code reviewed',
        testsPassed: '✓ Tests passed',
        appIsLive: '✓ Your app is live',
        deployed: 'deployed',
      },
    },
    portfolio: {
      eyebrow: 'Selected work',
      heading: 'Clients we built for,',
      headingEm: "work we're proud of.",
      seeAll: 'See all projects',
      projects: [
        { id: 'violette-mode', name: 'Copal Studio', category: 'Design assets', description: 'Product marketplace for designers. 200+ mockups, clean checkout, built for creative professionals in 12 countries.', image: '/images/portfolio/copal.webp' },
        { id: 'pop-pop', name: 'Mama-C Café', category: 'Café & restaurant', description: 'The site runs with the café, from the first morning espresso to the last evening drink, never stopping in between.', image: '/images/portfolio/mama-c-cafe.webp' },
        { id: 'cafe-buade', name: 'Raoul', category: 'Hair & beauty salon', description: "A gold-lit hair & beauty salon site built around one idea — trust is the best hairstyle — with booking a chair down to a few clicks.", image: '/images/portfolio/raoul.webp' },
        { id: 'upcycli', name: 'Upcycli', category: 'Fashion marketplace', description: 'Independent designers marketplace — 30+ independent brands, curated, conscious, and easy to shop.', image: '/images/portfolio/upcycli-store.webp' },
        { id: 'maeve-june', name: 'Nogi', category: 'Interior design', description: 'A minimalist, elegant site designed to let the work take center stage — capturing a sense of premium simplicity.', image: '/images/portfolio/nogi.webp' },
        { id: 'copal-studio', name: 'Sky Dental', category: 'Dental clinic', description: 'Booking-first site for a modern dental practice. Clean, reassuring, built to turn visitors into scheduled appointments.', image: '/images/portfolio/sky-dental.webp' },
      ],
    },
    testimonials: {
      eyebrow: 'Client voices',
      headingLine1: 'Straight from the people',
      headingLine2: 'we worked with.',
      items: [
        { quote: "Honestly I was skeptical at first because our last redesign went nowhere. But they actually dug into why people were dropping off at checkout instead of just making it look nicer.", author: 'Sofia R.' },
        { quote: "Our old site barely got us a booking a week. The new one does a few a day now. I don't fully understand what they changed but it worked.", author: 'James M.' },
        { quote: "We used to spend half a day every week copying leads from forms into spreadsheets and chasing follow-ups manually. They built us an automation that handles all of it now — routing, reminders, the works. That's a day a week we get back.", author: 'Camille T.' },
        { quote: "They pushed back on half my brief, which annoyed me at the time. They were right about most of it though.", author: 'Marcus O.' },
        { quote: "Ce que j'ai apprécié c'est qu'ils répondaient vite, même aux questions un peu bêtes. On ne s'est jamais sentis laissés de côté.", author: 'Rayan B.' },
        { quote: "We came in with a pretty fixed idea of what we wanted. They asked a lot of annoying questions and we ended up building something different. Glad they did.", author: 'Lena W.' },
        { quote: "Felt less like hiring an agency and more like having someone on the team who actually cared about the outcome as much as we did.", author: 'Mehdi K.' },
        { quote: "Engagement went up after the redesign. Not going to throw a specific number at you but enough that my co-founder noticed before I told him.", author: 'Priya S.' },
        { quote: "Our internal dashboard used to be the thing nobody wanted to open. The team uses it without complaining now, which is honestly the highest praise I can give.", author: 'Yasmine A.' },
        { quote: "Whenever they made a call I didn't get, I could just ask and they'd explain the reasoning. Never felt like I was being managed.", author: 'Daniel F.' },
        { quote: "We weren't a big budget client and I kept expecting to feel like one. Never did.", author: 'Amine D.' },
        { quote: "I've shipped a handful of products with different agencies. This is the only studio I've worked with where the handoff actually felt complete.", author: 'Nora J.' },
        { quote: "They understood our market quickly. We didn't have to keep re-explaining what our customers actually do, which saved a ton of meetings.", author: 'Sofiane M.' },
        { quote: "Mobile was solid out of the box. Usually that's where everything falls apart for us but we barely had to flag anything.", author: 'Bilal H.' },
        { quote: "An investor brought up how good the product looked before we'd even pitched it. First time that's happened.", author: 'Emma C.' },
        { quote: "On avait une idée encore floue et ils en ont fait quelque chose de concret sans la dénaturer. C'est plus rare qu'on ne le croit.", author: 'Lydia O.' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      headingLine1: 'Frequently',
      headingEm: 'asked questions.',
      intro: "Still unsure about something? Reach us directly and we'll get back within 24 hours.",
      items: [
        { q: 'What types of applications do you build?', a: 'We build web applications, mobile apps (iOS and Android), AI-integrated management systems (CRM, ERP), custom dashboards, and SaaS platforms. Every solution is tailored to your needs.' },
        { q: 'What does the process look like?', a: 'It starts with a free 30-minute discovery call. From there, we move through five clear stages: strategy & goals, copywriting, UX/UI design, development, and delivery with onboarding. You review and approve each phase before we move to the next.' },
        { q: 'How long does a project take?', a: 'Timelines depend on scope. A landing page ships in 7–10 business days, a full website in 3–5 weeks, and complex systems like CRMs or ERPs run 3–6 months. After the discovery call, you get a precise schedule — and we hold to it.' },
        { q: 'How does payment work?', a: 'Most projects are split into milestones: 40% upfront to kick off, 30% at mid-project, and 30% final payment on delivery.' },
        { q: 'Do I own the designs and the code?', a: 'Yes — completely. On final payment, the code, the designs, and the data are all yours. No license traps, no hostage situations.' },
        { q: 'Will my site rank well on Google (SEO)?', a: 'Yes — SEO is built into every project: clean semantic structure, meta tags, fast load times, responsive design, and a sitemap... Everything that matters for ranking well on Google. A concrete technical edge, not an afterthought.' },
        { q: 'Do you provide ongoing support and maintenance?', a: "Yes. For ongoing needs, an optional monthly plan covers maintenance, updates, and technical check-ins that keep your site secure and up to date — a practical way to have a dedicated developer on call, without hiring one." },
      ],
    },
    cta: {
      join: 'Join 20+ founders who launched with ArcaniStudio',
      headingLine1: 'Your product is',
      headingEm: 'one conversation away.',
      subtitle: 'Book a 30-minute call. No pitch decks, no commitment — just the fastest path from idea to launch.',
      primary: 'Book My Discovery Call',
      secondary: 'See Our Services',
    },
    // Privacy Policy / Terms of Service pages live at /privacy and /terms (see
    // legal.privacy / legal.terms below + src/components/LegalPage.astro).
    // Still planned: dedicated service pages (currently all 6 services crammed
    // under one #services anchor, capping keyword targeting) and a
    // case-study/blog section for long-tail + authority. See project memory
    // "SEO/Perf Audit" for full context.
    footer: {
      buildSomething: "Let's Build Something",
      dropEmail: "Drop your email and we'll reach out to discuss your project.",
      emailPlaceholder: 'Write your email',
      emailSubject: 'New project inquiry',
      getInTouch: 'Get in touch',
      emailSent: "Thanks — we'll be in touch soon.",
      emailErrorRate: 'Too many submissions. Please wait a minute and try again.',
      emailErrorGeneric: 'Something went wrong. Please try again or contact us directly.',
      menu: 'Menu',
      legal: 'Legal',
      links: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'How We Work', href: '#how-we-work' },
        { label: 'Work', href: '#portfolio' },
        { label: 'Contact', href: '#contact' },
      ],
      legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
      rights: 'Arcani Studio. All Rights Reserved.',
    },
    contact: {
      step: 'Step',
      of: 'of',
      choiceSteps: [
        { question: 'What are you building?', options: ['Business website / Landing page', 'Online store', 'Custom management software (ERP / CRM)', 'Web / mobile app', 'Something else'] },
        { question: 'When do you need it?', options: ['As soon as possible', 'Within 1 – 3 months', 'Within 3 – 6 months', 'Just exploring options'] },
        { question: "What's your main goal?", options: ['Get more customers', 'Sell online', 'Look professional & credible', 'Replace something old'] },
        // old: "What's your budget?"
        { question: "What's your budget for this project?", options: ['Under 100,000 DZD', '100,000 – 300,000 DZD', '300,000 – 700,000 DZD', '700,000 DZD and above'] },
      ],
      budgetQuestionManagement: 'What investment are you planning for this project?',
      businessSizeStep: { question: 'How big is your business?', options: ['Solo / Micro (1–5)', 'Small (6–20)', 'Mid-size (21–50)', 'Large (50+)'] },
      budgetByProject: {
        'Business website / Landing page': ['Under 50,000 DZD', '50,000 – 120,000 DZD', '120,000 DZD and above'],
        'Online store': ['Under 100,000 DZD', '100,000 – 250,000 DZD', '250,000 – 400,000 DZD', '400,000 DZD and above'],
        'Custom management software (ERP / CRM)': ['Under 300,000 DZD', '300,000 – 600,000 DZD', '600,000 – 1,100,000 DZD', '1,100,000 DZD and above'],
        'Web / mobile app': ['Under 600,000 DZD', '600,000 – 1,500,000 DZD', '1,500,000 – 3,000,000 DZD', '3,000,000 DZD and above'],
      } as Record<string, string[]>,
      somethingElse: 'Something else',
      managementKey: 'Custom management software (ERP / CRM)',
      otherPlaceholder: 'Tell us briefly what you need',
      almostThere: 'Almost\nthere.',
      fields: {
        name: { label: 'Your name', placeholder: 'Full name' },
        email: { label: 'Email address', placeholder: 'you@company.com' },
        phone: { label: 'Phone number', placeholder: '+213 ...' },
        business: { label: 'Business name', placeholder: 'Company or brand' },
      },
      companyWebsiteLabel: 'Company website',
      back: 'Back',
      continue: 'Continue',
      send: 'Send message',
      sending: 'Sending…',
      reassure: "We'll reach out within 24 hours to book your call.",
      sentHeading: "We'll be in touch",
      sentBody: "Got it — your request is in. We'll reach out by WhatsApp or phone within 24 hours to find a time that works.",
      expressEyebrow: 'Prefer to lock a time now?',
      expressBody: 'Skip the wait and grab a slot — your name and email are already filled in.',
      bookNow: 'Book a time now',
      validation: { intro: 'Please check your ', name: 'name', email: 'email', phone: 'phone number', and: ' and ', sep: ', ', suffixSingle: ' and try again.', suffixMulti: ', and try again.' },
      errorRate: 'Too many submissions. Please wait a minute and try again.',
      errorServer: 'Could not send your request. Please try again or contact us directly.',
      errorGeneric: 'Please check your details and try again.',
    },
    legal: {
      backHome: 'Back home',
      privacy: {
        metaTitle: 'Privacy Policy — arcaniStudio',
        metaDescription:
          'How arcaniStudio collects, uses, and protects your personal data when you visit arcanistudio.com, submit the contact form, or book a call.',
        heading: 'Privacy Policy',
        lastUpdated: 'Last updated: July 12, 2026',
        intro:
          'This Privacy Policy describes how arcaniStudio collects, uses, and protects the personal data of users of the arcanistudio.com website, in accordance with the General Data Protection Regulation (GDPR).',
        sections: [
          {
            heading: 'Data controller',
            content: [
              'The arcanistudio.com website is published and operated by arcaniStudio, a web and mobile development agency. arcaniStudio is the party responsible for the processing of personal data collected through the site.',
              'For any question regarding the processing of your data, you can contact us at: contact@arcanistudio.com.',
            ],
          },
          {
            heading: 'Personal data collected',
            content: [
              'In the course of its activity, arcaniStudio may collect the following personal data:',
              [
                'First and last name',
                'Email address',
                'Phone number',
                'Company name (where applicable)',
                'Information about your project (project type, budget, timeline) submitted through the contact form',
                'Any information you voluntarily provide through a form or by email',
              ],
              'No sensitive data is collected.',
            ],
          },
          {
            heading: 'Purposes of processing',
            content: [
              'Personal data is collected solely for the following purposes:',
              [
                'Responding to contact and quote requests',
                'Managing the client relationship and business communications',
                'Preparing quotes, invoices, and contractual documents',
                'Following up on the services provided',
                'Meeting legal and accounting obligations',
              ],
              'Data is never used for unsolicited marketing purposes.',
            ],
          },
          {
            heading: 'Legal basis for processing',
            content: [
              'The processing carried out relies on:',
              [
                'your consent (contact form submissions);',
                'contractual necessity (performance of a quote or service);',
                'a legal obligation (invoicing, accounting).',
              ],
            ],
          },
          {
            heading: 'Recipients of the data',
            content: [
              'Personal data is intended solely for arcaniStudio. It is never sold, rented, or transferred to third parties.',
              'Certain data may, however, be shared with technical service providers strictly necessary to deliver our services, in compliance with the GDPR, notably:',
              [
                'website hosting',
                'email delivery',
                'internal team communication tools',
                'internal client and lead record-keeping',
                'appointment scheduling',
                'technical error monitoring',
                'audience measurement and analytics',
              ],
            ],
          },
          {
            heading: 'Data retention',
            content: [
              'Data is retained:',
              [
                'for the duration of the business relationship;',
                'then archived for a maximum of 3 years from the last contact, for prospects;',
                'and 10 years for invoicing and accounting data (legal obligation).',
              ],
            ],
          },
          {
            heading: 'Data security',
            content: [
              'arcaniStudio implements all reasonable technical and organizational measures to ensure the security and confidentiality of personal data and to prevent unauthorized access, loss, alteration, or disclosure. The site operates entirely over HTTPS, and forms are rate-limited and spam-filtered.',
            ],
          },
          {
            heading: 'Your rights',
            content: [
              'In accordance with the GDPR, you have the following rights:',
              [
                'Right of access',
                'Right to rectification',
                'Right to erasure',
                'Right to restriction of processing',
                'Right to object',
                'Right to data portability',
              ],
              'These rights may be exercised at any time by written request to: contact@arcanistudio.com.',
            ],
          },
          {
            heading: 'Complaints',
            content: [
              'If you have any concern regarding the processing of your personal data, you may lodge a complaint with the competent data protection authority.',
            ],
          },
          {
            heading: 'Cookies and audience measurement',
            content: [
              'The site uses cookies for audience measurement and to record anonymized session activity, helping us understand how the site is used. Separate performance-monitoring tools used on the site do not use cookies.',
              'You can accept, refuse, or delete cookies at any time through your browser settings. The site remains functional without them.',
            ],
          },
          {
            heading: 'Changes to this policy',
            content: [
              'This Privacy Policy may be amended at any time to remain compliant with legal or technical developments. The version in force is the one published on the site at the time of consultation.',
            ],
          },
        ],
      },
      terms: {
        metaTitle: 'Terms of Use — arcaniStudio',
        metaDescription: 'The terms that govern access to and use of the arcanistudio.com website.',
        heading: 'Terms of Use',
        lastUpdated: 'Last updated: July 12, 2026',
        intro:
          'These Terms of Use (the "Terms") govern access to and use of the arcanistudio.com website. By accessing the site, the user accepts these Terms in full.',
        sections: [
          {
            heading: 'Purpose',
            content: [
              "These Terms define the conditions under which arcaniStudio makes its website available and under which the user may browse it. The site is informational: it presents arcaniStudio's services and allows visitors to get in touch.",
            ],
          },
          {
            heading: 'Access to the site',
            content: [
              'The site is accessible free of charge to any user with internet access. The user agrees to use it for its intended purpose and to refrain from any conduct likely to disrupt its operation, including large-scale scraping and abuse of the contact form (spam, automated submissions). Form submissions are rate-limited and filtered.',
            ],
          },
          {
            heading: 'Intellectual property',
            content: [
              'The design, code, content, and branding of this site are the property of arcaniStudio. Any reproduction or use without prior authorization is prohibited. Client logos and work shown on the site are displayed for portfolio purposes with permission; their presence does not constitute an endorsement of arcaniStudio unless explicitly stated by the client.',
            ],
          },
          {
            heading: 'Services and engagements',
            content: [
              'This website is informational only. The scope, pricing, timeline, and deliverables of any client project are defined exclusively in a separate signed agreement (quote and contract), and never by the content of this site.',
            ],
          },
          {
            heading: 'No guarantee of results',
            content: [
              'Case studies, testimonials, and examples presented on this site illustrate past work. They do not guarantee similar results for any future project, as each project differs.',
            ],
          },
          {
            heading: 'Third-party links and services',
            content: [
              'This site embeds a Cal.com booking widget and links to external sites (such as our Instagram profile). arcaniStudio is not responsible for the content or privacy practices of sites it does not operate.',
            ],
          },
          {
            heading: 'Personal data',
            content: ['The processing of personal data collected through this site is described in our Privacy Policy.'],
          },
          {
            heading: 'Limitation of liability',
            content: [
              'To the extent permitted by applicable law, arcaniStudio shall not be held liable for any indirect, incidental, or consequential damages arising from the use of this website.',
            ],
          },
          {
            heading: 'Governing law',
            content: ['These Terms are governed by the laws of Algeria, where arcaniStudio operates.'],
          },
          {
            heading: 'Amendments',
            content: [
              'arcaniStudio may amend these Terms as the site evolves. Continued use of the site after any change constitutes acceptance of the updated Terms.',
            ],
          },
          {
            heading: 'Contact',
            content: ['For any question regarding these Terms: contact@arcanistudio.com.'],
          },
        ],
      },
    },
  },

  fr: {
    meta: {
      homeTitle: 'arcaniStudio',
      title: 'arcaniStudio — Développement Web & Mobile en Algérie',
      description:
        "arcaniStudio conçoit des sites web rapides, apps mobiles et systèmes IA pour fondateurs et marques en Algérie et à l'international. Réservez un appel gratuit.",
    },
    langBanner: {
      message: 'Vous préférez lire ceci en anglais ?',
      switchLabel: 'View in English',
      dismiss: 'Fermer',
    },
    notFound: {
      title: 'Page introuvable — arcaniStudio',
      headingParts: ['Page', 'Non', 'Disponible'],
      bodyLines: ["Désolé, cette page n'est plus disponible", "ou une erreur s'est produite."],
      backHome: 'Retour à l’accueil',
    },
    nav: {
      tagline: 'Des solutions digitales qui ont du sens',
      links: [
        { label: 'Services', href: '#services' },
        { label: 'Process', href: '#how-we-work' },
        { label: 'Projets', href: '#portfolio' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
      cta: 'Réserver un appel',
      mobileCta: 'Commencer',
      openMenu: 'Ouvrir le menu',
    },
    hero: {
      badgeNew: 'Dispo', // alt: 'Info'
      badgeText: 'Agenda ouvert pour le prochain trimestre',
      titleLine1: 'Libérez votre',
      titleLine2: 'potentiel digital',
      subtitle:
        'Vous portez la vision, on la réalise — design, code, tests, déploiement : tout est pris en charge pour vous laisser concentré sur votre business.',
      cta: 'Réserver un appel',
    },
    logos: {
      trustedBy: 'Ils nous ont fait confiance',
    },
    stats: {
      eyebrow: 'Preuves',
      heading: "Des chiffres qui parlent d'eux-mêmes",
      subtitle: 'On pilote des projets digitaux conçus pour des résultats mesurables.',
      quote: 'Obtenir un devis',
      discover: 'Découvrir',
      items: [
        { value: '20+', label: 'Projets lancés', description: 'Pour les fondateurs et marques qui prennent leur présence digitale au sérieux.' },
        { value: '38%', label: 'Hausse moyenne des conversions', description: 'Amélioration typique constatée par nos clients en six mois' },
        { value: '4.9', label: 'Note moyenne des clients', description: "Parce qu'on ne se contente pas de répondre aux attentes, on les dépasse" },
      ],
    },
    services: {
      ticker: 'NOS SERVICES',
      whatWeBuild: "Ce qu'on construit",
      builtInto: 'Inclus dans chaque projet',
      getStarted: 'Commencer',
      includedNote: 'Inclus dans chaque projet web & app — non proposé à part.',
      items: [
        { id: 1, name: 'DÉVELOPPEMENT WEB', nameLines: ['DÉVELOPPEMENT WEB'], description: "On développe des applications web rapides et évolutives, avec des frameworks modernes et une architecture propre. De la landing page aux plateformes complexes, chaque projet est optimisé pour la vitesse, le SEO et des performances fluides sur tous les appareils.", tags: ['React', 'Next.js', 'Astro', 'TypeScript'] },
        { id: 2, name: 'BRANDING & DESIGN UI/UX', nameLines: ['BRANDING &', 'DESIGN UI/UX'], description: "On signe des identités de marque uniques et des interfaces intuitives que les utilisateurs adorent. Grâce à une approche centrée utilisateur et un souci du détail au pixel près, on transforme votre vision en expériences qui convertissent et restent en mémoire.", tags: ['Figma', 'Identité de marque', 'Systèmes de design', 'Prototypage'], bundled: true },
        { id: 3, name: 'APPS MOBILE', nameLines: ['APPS MOBILE'], description: "On conçoit et développe des applications mobiles natives et cross-platform, simples et agréables à utiliser. Du concept au lancement sur l'App Store, on livre des expériences fluides et fiables, conçues pour devenir un réflexe quotidien pour vos utilisateurs.", tags: ['React Native', 'iOS', 'Android', 'Expo'] },
        { id: 4, name: 'AUTOMATISATION & IA', nameLines: ['AUTOMATISATION & IA'], description: "On fluidifie vos processus et on intègre des solutions dopées à l'IA qui réduisent le travail manuel et démultiplient votre production. Qu'il s'agisse d'intégrations intelligentes ou d'automatisations sur mesure, on aide votre entreprise à aller plus vite et à voir plus loin.", tags: ['OpenAI', 'Automatisation', 'APIs', 'Agents sur mesure'] },
        { id: 5, name: 'SOLUTIONS E-COMMERCE', nameLines: ['SOLUTIONS', 'E-COMMERCE'], description: "On lance et on développe des boutiques en ligne conçues pour convertir et grandir. Du design de la vitrine à l'optimisation du tunnel d'achat, on crée des expériences qui transforment les visiteurs en clients fidèles.", tags: ['Shopify', 'E-Paiement', 'Commerce headless', 'CRO'] },
        { id: 6, name: 'SEO & CROISSANCE', nameLines: ['SEO & CROISSANCE'], description: "On améliore votre visibilité dans les résultats de recherche et sur les outils d'IA grâce à des stratégies SEO éprouvées, basées sur l'analyse de données. De l'audit technique à la stratégie de contenu, on vous rend visible auprès des bonnes personnes sur tous les canaux de recherche, et on vous garde devant la concurrence.", tags: ['SEO technique', 'Stratégie de contenu', 'Analytics', 'Core Web Vitals'], bundled: true },
      ],
    },
    about: {
      eyebrow: 'Notre mission',
      segments: [
        { text: "Une marque n'est pas qu'un logo.", className: 'font-semibold text-white' },
        { text: " C'est la première conversation entre votre produit et le monde.", className: 'font-reckless italic font-light text-white' },
        { text: " Une voix qui se distingue dans le bruit. Un standard qu'on ne renégocie pas.", className: 'font-semibold text-white' },
        { text: ' Chaque pixel inspire confiance ou la fait perdre.', className: 'font-semibold text-white' },
        { text: ' arcaniStudio', className: 'font-clash font-medium text-primary-600 text-[1.3em] mr-[0.05em]' },
        { text: ' existe pour les fondateurs qui refusent la moyenne — et veulent que leur présence digitale tienne le même standard que leur produit.', className: 'font-semibold text-white' },
      ],
    },
    process: {
      eyebrow: 'Notre processus',
      heading: { line1: 'Comment se déroule un projet', emphasis: 'avec nous', line2: '?' },
      intro:
        "Chaque projet est mené avec intention. De la stratégie au lancement, on avance vite et on communique clairement, avec un processus précis pensé pour éliminer les frictions et garder le projet en mouvement. On conçoit des produits digitaux qui combinent design soigné et résultats concrets.",
      steps: [
        { number: '01', title: 'Découverte', verb: 'Comprendre avant de construire', body: "On étudie votre marché, vos concurrents et vos contraintes avant de démarrer quoi que ce soit. Appels découverte, audit de l'expérience utilisateur, cadrage technique — vous repartez avec un plan produit, un schéma technique et un devis clair." },
        { number: '02', title: 'Design', verb: 'Valider la vision tôt', body: "Chaque écran testé avant le début du développement. Wireframes, maquettes et prototypes interactifs. Vous le testez, vous cliquez, vous validez — aucune surprise quand on passe au développement." },
        { number: '03', title: 'Réalisation', verb: 'Le design devient un vrai produit', body: "Votre prototype devient un vrai produit. Code propre, architecture solide, progression visible — et des suivis hebdomadaires pour que rien ne dérive. Chaque fonctionnalité testée, chaque détail pensé." },
        { number: '04', title: 'Lancement', verb: "Au-delà de la ligne d'arrivée", body: "Tests, finitions, optimisation. Une fois en ligne, on reste à vos côtés — 30 jours de support post-lancement inclus, avec des sprints mensuels si besoin pour faire évoluer votre produit avec vos utilisateurs. Vous repartez pleinement propriétaire, sans aucune dépendance technique." },
      ],
      dashboard: {
        insights: 'Analyses',
        marketResearch: 'Étude de marché',
        comparedToLastYear: "Comparé à l'année dernière",
        vsLastYear: "vs l'année dernière",
        userSegments: "Segments d'utilisateurs",
        activeCohorts: 'Cohortes actives',
        competitorAnalysis: 'Analyse concurrentielle',
        manageData: 'Gérer les données',
        viewManageData: 'Gérer vos données',
        designSystem: 'Système de design',
        palette: 'Palette',
        typeScale: 'Échelle typographique',
        components: 'Composants',
        moodboard: 'Moodboard',
        uiMockups: 'Maquettes UI',
        usabilityTesting: 'Tests utilisateurs',
        usability: 'Tests UX',
        delivery: 'Lancement',
        preparingProject: 'Préparation de votre projet...',
        codeReviewed: '✓ Code vérifié',
        testsPassed: '✓ Tests réussis',
        appIsLive: '✓ Votre app est en ligne',
        deployed: 'déployé',
      },
    },
    portfolio: {
      eyebrow: 'Réalisations',
      // Alt option: heading: 'Pour qui on a bâti,', headingEm: 'ce dont on est fiers.'
      heading: 'Des clients pour qui on a bâti,',
      headingEm: "un travail dont on est fiers.",
      seeAll: 'Voir tous les projets',
      projects: [
        { id: 'violette-mode', name: 'Copal Studio', category: 'Ressources design', description: "Place de marché de produits pour designers. Plus de 200 mockups, paiement épuré, pensée pour les créatifs de 12 pays.", image: '/images/portfolio/copal.webp' },
        { id: 'pop-pop', name: 'Mama-C Café', category: 'Café & restaurant', description: "Le site tourne avec le café, du premier espresso du matin jusqu'au dernier verre du soir, sans jamais s'arrêter entre les deux.", image: '/images/portfolio/mama-c-cafe.webp' },
        { id: 'cafe-buade', name: 'Raoul', category: 'Salon de coiffure & beauté', description: "Salon de coiffure et beauté tout en dorures, autour d'une idée simple — la confiance est la meilleure coiffure — et un rendez-vous pris en quelques clics.", image: '/images/portfolio/raoul.webp' },
        { id: 'upcycli', name: 'Upcycli', category: 'Mode & accessoires', description: "Place de marché de créateurs indépendants — plus de 30 marques indépendantes, sélectionnées, responsables et faciles à magasiner.", image: '/images/portfolio/upcycli-store.webp' },
        { id: 'maeve-june', name: 'Nogi', category: 'Architecture d’intérieur', description: "Un site minimaliste et élégant imaginé pour laisser pleinement la place aux projets et retranscrire une sensation de simplicité premium.", image: '/images/portfolio/nogi.webp' },
        { id: 'copal-studio', name: 'Sky Dental', category: 'Clinique dentaire', description: "Site axé réservation pour un cabinet dentaire moderne. Épuré, rassurant, pensé pour transformer les visiteurs en rendez-vous.", image: '/images/portfolio/sky-dental.webp' },
      ],
    },
    testimonials: {
      eyebrow: 'Paroles de clients',
      headingLine1: 'Dans les mots',
      headingLine2: 'de ceux qu\'on a accompagnés.',
      items: [
        { quote: "Honnêtement j'étais sceptique au début parce que notre dernière refonte n'avait rien donné. Mais ils ont vraiment creusé pourquoi les gens abandonnaient au paiement au lieu de juste rendre ça plus joli.", author: 'Sofia R.' },
        { quote: "Notre ancien site nous ramenait à peine une réservation par semaine. Le nouveau en fait plusieurs par jour maintenant. Je ne comprends pas tout ce qu'ils ont changé mais ça a marché.", author: 'James M.' },
        { quote: "On passait une demi-journée par semaine à recopier les leads des formulaires dans des tableurs et à relancer à la main. Ils nous ont monté une automatisation qui gère tout ça maintenant — routage, relances, tout. C'est une journée par semaine qu'on récupère.", author: 'Camille T.' },
        { quote: "Ils ont remis en question la moitié de mon brief, ça m'a agacé sur le moment. Mais ils avaient raison sur presque tout.", author: 'Marcus O.' },
        { quote: "Ce que j'ai apprécié c'est qu'ils répondaient vite, même aux questions un peu bêtes. On ne s'est jamais sentis laissés de côté.", author: 'Rayan B.' },
        { quote: "On avait une idée assez précise de ce qu'on voulait. Ils ont posé plein de questions embêtantes et on a fini par construire autre chose. Tant mieux qu'ils l'aient fait.", author: 'Lena W.' },
        { quote: "On avait moins l'impression d'avoir engagé une agence que d'avoir quelqu'un dans l'équipe qui tenait au résultat autant que nous.", author: 'Mehdi K.' },
        { quote: "L'engagement a augmenté après la refonte. Je ne vais pas vous sortir un chiffre précis mais assez pour que mon associé le remarque avant que je lui en parle.", author: 'Priya S.' },
        { quote: "Notre tableau de bord interne, c'était le truc que personne ne voulait ouvrir. L'équipe l'utilise sans râler maintenant, et c'est honnêtement le plus grand compliment que je puisse faire.", author: 'Yasmine A.' },
        { quote: "Chaque fois qu'ils prenaient une décision que je ne comprenais pas, je pouvais demander et ils expliquaient leur raisonnement. Je ne me suis jamais senti géré.", author: 'Daniel F.' },
        { quote: "On n'était pas un client à gros budget et je m'attendais sans cesse à le ressentir. Ce n'est jamais arrivé.", author: 'Amine D.' },
        { quote: "J'ai lancé plusieurs projets avec différentes agences. C'est le seul studio avec qui la remise s'est vraiment sentie complète.", author: 'Nora J.' },
        { quote: "Ils ont compris notre marché rapidement. On n'a pas eu à réexpliquer ce que font nos clients, ça nous a épargné un paquet de réunions.", author: 'Sofiane M.' },
        { quote: "Le mobile était solide dès le départ. D'habitude c'est là que tout s'effondre pour nous mais on n'a eu presque rien à signaler.", author: 'Bilal H.' },
        { quote: "Un investisseur a souligné à quel point le produit était réussi avant même qu'on l'ait présenté.", author: 'Emma C.' },
        { quote: "On avait une idée encore floue et ils en ont fait quelque chose de concret sans la dénaturer. C'est plus rare qu'on ne le croit.", author: 'Lydia O.' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      headingLine1: 'Questions',
      headingEm: 'fréquentes.',
      intro: "Une question sans réponse ? Contactez-nous directement, on revient vers vous sous 24 heures.",
      items: [
        { q: 'Quels types d\'applications développez-vous ?', a: "On développe des applications web, des apps mobiles (iOS et Android), des logiciels de gestion intégrant l'IA (CRM, ERP), des tableaux de bord sur mesure et des plateformes SaaS. Chaque solution est adaptée à vos besoins." },
        { q: 'À quoi ressemble le processus ?', a: "Tout commence par un appel découverte gratuit de 30 minutes. Ensuite, on avance en cinq étapes claires : stratégie & objectifs, rédaction, design UX/UI, développement, puis livraison avec prise en main. Vous validez chaque phase avant qu'on passe à la suivante." },
        { q: 'Combien de temps prend un projet ?', a: "Les délais dépendent de la complexité. Une landing page est livrée en 7 à 10 jours ouvrés, un site complet en 3 à 5 semaines, et les systèmes complexes comme les CRM ou ERP en 3 à 6 mois. Après l'appel découverte, vous recevez un planning précis — et on s'y tient." },
        { q: 'Comment se passe le paiement ?', a: "On propose un paiement en 2 ou 3 fois : 40 % au démarrage, 30 % à mi-parcours, et 30 % à la livraison." },
        { q: 'Suis-je propriétaire des designs et du code ?', a: "Oui — entièrement. Au solde final, le code, les designs et les données vous appartiennent. Aucun piège de licence, aucune prise en otage." },
        { q: 'Mon site sera-t-il bien classé sur Google (SEO) ?', a: "Oui — le SEO est intégré à chaque projet : structure sémantique propre, balises meta, temps de chargement rapides, design responsive et sitemap... Tout ce qui compte pour un bon positionnement sur Google. C'est un avantage technique concret dès le lancement." },
        // q was: 'Proposez-vous du support et de la maintenance dans la durée ?'
        { q: 'Proposez-vous du support et de la maintenance sur le long terme ?', a: "Oui. Pour les besoins récurrents, un forfait mensuel optionnel couvre la maintenance, les mises à jour et les points techniques qui gardent votre site sécurisé et à jour — une façon simple d'avoir un développeur dédié sous la main, sans avoir à en embaucher un." },
      ],
    },
    cta: {
      join: 'Rejoignez plus de 20 fondateurs qui ont lancé avec ArcaniStudio',
      headingLine1: 'Votre produit est à',
      headingEm: 'une conversation près.',
      subtitle: "Réservez un appel de 30 minutes. Pas de slides, aucun engagement — juste le chemin le plus rapide de l'idée au lancement.",
      primary: 'Réserver mon appel découverte',
      secondary: 'Voir nos services',
    },
    footer: {
      buildSomething: 'Parlons de Votre Projet',
      dropEmail: "Laissez votre e-mail et on vous recontacte pour parler de votre projet.",
      emailPlaceholder: 'Votre e-mail',
      emailSubject: 'Nouvelle demande de projet',
      getInTouch: 'Nous contacter',
      emailSent: 'Merci — on vous recontacte bientôt.',
      emailErrorRate: 'Trop de tentatives. Patientez une minute et réessayez.',
      emailErrorGeneric: 'Une erreur est survenue. Réessayez ou contactez-nous directement.',
      menu: 'Menu',
      legal: 'Légal',
      links: [
        { label: 'Accueil', href: '/' },
        { label: 'À propos', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Notre méthode', href: '#how-we-work' },
        { label: 'Projets', href: '#portfolio' },
        { label: 'Contact', href: '#contact' },
      ],
      legalLinks: [
        { label: 'Politique de confidentialité', href: '/privacy' },
        { label: "Conditions d'utilisation", href: '/terms' },
      ],
      rights: 'Arcani Studio. Tous droits réservés.',
    },
    contact: {
      step: 'Étape',
      of: 'sur',
      choiceSteps: [
        // alt considered: 'De quoi avez-vous besoin ?'
        { question: 'Quel est votre projet ?', options: ['Site vitrine / Landing page', 'Boutique en ligne', 'Logiciel de gestion sur mesure (ERP / CRM)', 'Application web / mobile', 'Autre chose'] },
        // alt considered: 'C'est pour quand ?'
        { question: 'Pour quand en avez-vous besoin ?', options: ['Le plus tôt possible', "D'ici 1 à 3 mois", "D'ici 3 à 6 mois", "Je m'informe pour l'instant"] },
        { question: 'Quel est votre objectif principal ?', options: ['Avoir plus de clients', 'Vendre en ligne', 'Paraître professionnel et crédible', 'Remplacer un site existant'] },
        // old: 'Quel est votre budget ?'
        { question: 'Quel est votre budget pour ce projet ?', options: ['Moins de 100 000 DZD', '100 000 – 300 000 DZD', '300 000 – 700 000 DZD', '700 000 DZD et plus'] },
      ],
      budgetQuestionManagement: 'Quel investissement prévoyez-vous pour ce projet ?',
      businessSizeStep: { question: 'Quelle est la taille de votre entreprise ?', options: ['Solo / Micro (1–5)', 'Petite (6–20)', 'Moyenne (21–50)', 'Grande (50+)'] },
      budgetByProject: {
        'Site vitrine / Landing page': ['Moins de 50 000 DZD', '50 000 – 120 000 DZD', '120 000 DZD et plus'],
        'Boutique en ligne': ['Moins de 100 000 DZD', '100 000 – 250 000 DZD', '250 000 – 400 000 DZD', '400 000 DZD et plus'],
        'Logiciel de gestion sur mesure (ERP / CRM)': ['Moins de 300 000 DZD', '300 000 – 600 000 DZD', '600 000 – 1 100 000 DZD', '1 100 000 DZD et plus'],
        'Application web / mobile': ['Moins de 600 000 DZD', '600 000 – 1 500 000 DZD', '1 500 000 – 3 000 000 DZD', '3 000 000 DZD et plus'],
      } as Record<string, string[]>,
      somethingElse: 'Autre chose',
      managementKey: 'Logiciel de gestion sur mesure (ERP / CRM)',
      otherPlaceholder: "Dites-nous brièvement ce qu'il vous faut",
      almostThere: 'Presque\nfini.',
      fields: {
        name: { label: 'Votre nom', placeholder: 'Nom complet' },
        email: { label: 'Adresse e-mail', placeholder: 'vous@entreprise.com' },
        phone: { label: 'Numéro de téléphone', placeholder: '+213 ...' },
        business: { label: "Nom de l'entreprise", placeholder: 'Entreprise ou marque' },
      },
      companyWebsiteLabel: "Site web de l'entreprise",
      back: 'Retour',
      continue: 'Continuer',
      send: 'Envoyer',
      sending: 'Envoi…',
      reassure: 'On vous recontacte sous 24 heures pour fixer votre appel.',
      sentHeading: 'On vous recontacte',
      sentBody: "C'est noté — votre demande est enregistrée. On vous contacte par WhatsApp ou téléphone sous 24 heures pour trouver un créneau.",
      expressEyebrow: 'Vous préférez réserver un créneau tout de suite ?',
      expressBody: "Pas d'attente — choisissez un créneau, votre nom et votre e-mail sont déjà préremplis.",
      bookNow: 'Réserver un créneau',
      validation: { intro: 'Veuillez vérifier votre ', name: 'nom', email: 'e-mail', phone: 'numéro de téléphone', and: ' et ', sep: ', ', suffixSingle: ' et réessayer.', suffixMulti: ', et réessayer.' },
      errorRate: 'Trop de tentatives. Patientez une minute et réessayez.',
      errorServer: "Impossible d'envoyer votre demande. Réessayez ou contactez-nous directement.",
      errorGeneric: 'Veuillez vérifier vos informations et réessayer.',
    },
    legal: {
      backHome: "Retour à l'accueil",
      privacy: {
        metaTitle: 'Politique de confidentialité — arcaniStudio',
        metaDescription:
          "Comment arcaniStudio collecte, utilise et protège vos données personnelles lorsque vous visitez arcanistudio.com, remplissez le formulaire de contact ou réservez un appel.",
        heading: 'Politique de confidentialité',
        lastUpdated: 'Dernière mise à jour : 12 juillet 2026',
        intro:
          "La présente politique de confidentialité décrit la manière dont arcaniStudio collecte, utilise et protège les données personnelles des utilisateurs du site arcanistudio.com, conformément au Règlement Général sur la Protection des Données (RGPD).",
        sections: [
          {
            heading: 'Responsable du traitement',
            content: [
              "Le site arcanistudio.com est édité et exploité par arcaniStudio, agence de développement web et mobile. arcaniStudio est responsable du traitement des données personnelles collectées sur le site.",
              'Pour toute question relative au traitement de vos données, vous pouvez nous contacter à l’adresse : contact@arcanistudio.com.',
            ],
          },
          {
            heading: 'Données personnelles collectées',
            content: [
              'Dans le cadre de son activité, arcaniStudio peut être amené à collecter les données personnelles suivantes :',
              [
                'Nom et prénom',
                'Adresse e-mail',
                'Numéro de téléphone',
                "Nom de l'entreprise (le cas échéant)",
                'Informations relatives à votre projet (type de projet, budget, délai) transmises via le formulaire de contact',
                'Toute information transmise volontairement via un formulaire ou par e-mail',
              ],
              "Aucune donnée sensible n'est collectée.",
            ],
          },
          {
            heading: 'Finalités du traitement',
            content: [
              'Les données personnelles sont collectées uniquement pour les finalités suivantes :',
              [
                'Répondre aux demandes de contact et de devis',
                'Gérer la relation client et les échanges commerciaux',
                'Établir des devis, factures et documents contractuels',
                'Assurer le suivi des prestations',
                'Respecter les obligations légales et comptables',
              ],
              'Les données ne sont jamais utilisées à des fins commerciales non sollicitées.',
            ],
          },
          {
            heading: 'Base légale du traitement',
            content: [
              'Les traitements effectués reposent :',
              [
                'sur le consentement de la personne concernée (formulaire de contact) ;',
                "sur la nécessité contractuelle (exécution d'un devis ou d'une prestation) ;",
                'sur une obligation légale (facturation, comptabilité).',
              ],
            ],
          },
          {
            heading: 'Destinataires des données',
            content: [
              'Les données personnelles sont destinées exclusivement à arcaniStudio. Elles ne sont ni vendues, ni louées, ni cédées à des tiers.',
              "Certaines données peuvent toutefois être transmises à des prestataires techniques strictement nécessaires à l'exécution des services, dans le respect du RGPD, notamment :",
              [
                "l'hébergement du site",
                "l'envoi d'e-mails",
                "les outils de communication interne à l'équipe",
                'la gestion interne des clients et prospects',
                'la prise de rendez-vous',
                'la surveillance technique des erreurs',
                "la mesure d'audience et l'analyse statistique",
              ],
            ],
          },
          {
            heading: 'Durée de conservation',
            content: [
              'Les données sont conservées :',
              [
                'pendant la durée de la relation commerciale ;',
                'puis archivées pour une durée maximale de 3 ans à compter du dernier contact, pour les prospects ;',
                'et 10 ans pour les données liées à la facturation (obligation légale).',
              ],
            ],
          },
          {
            heading: 'Sécurité des données',
            content: [
              "arcaniStudio met en œuvre toutes les mesures techniques et organisationnelles raisonnables afin de garantir la sécurité et la confidentialité des données personnelles et d'empêcher leur accès non autorisé, perte, altération ou divulgation. Le site fonctionne intégralement en HTTPS, et les formulaires sont limités en fréquence et filtrés contre le spam.",
            ],
          },
          {
            heading: 'Vos droits',
            content: [
              'Conformément au RGPD, toute personne dispose des droits suivants :',
              [
                "Droit d'accès",
                'Droit de rectification',
                "Droit d'effacement",
                'Droit à la limitation du traitement',
                "Droit d'opposition",
                'Droit à la portabilité des données',
              ],
              "Ces droits peuvent être exercés à tout moment par simple demande écrite à l'adresse suivante : contact@arcanistudio.com.",
            ],
          },
          {
            heading: 'Réclamation',
            content: [
              "En cas de difficulté relative au traitement de vos données personnelles, vous pouvez introduire une réclamation auprès de l'autorité de protection des données compétente.",
            ],
          },
          {
            heading: "Cookies et mesure d'audience",
            content: [
              "Le site utilise des cookies à des fins de mesure d'audience et pour enregistrer une activité de session anonymisée, afin de mieux comprendre l'utilisation du site. Les outils de suivi de performance utilisés séparément sur le site n'utilisent pas de cookies.",
              'Vous pouvez accepter, refuser ou supprimer les cookies à tout moment depuis les réglages de votre navigateur. Le site reste fonctionnel sans eux.',
            ],
          },
          {
            heading: 'Modification de la politique',
            content: [
              "La présente politique de confidentialité peut être modifiée à tout moment afin de rester conforme aux évolutions légales ou techniques. La version en vigueur est celle publiée sur le site au moment de la consultation.",
            ],
          },
        ],
      },
      terms: {
        metaTitle: "Conditions d'utilisation — arcaniStudio",
        metaDescription: "Les conditions générales qui régissent l'accès et l'utilisation du site arcanistudio.com.",
        heading: "Conditions d'utilisation",
        lastUpdated: 'Dernière mise à jour : 12 juillet 2026',
        intro:
          "Les présentes conditions générales d'utilisation (ci-après les « CGU ») régissent l'accès et l'utilisation du site arcanistudio.com. En accédant au site, l'utilisateur accepte sans réserve les présentes CGU.",
        sections: [
          {
            heading: 'Objet',
            content: [
              "Les présentes CGU définissent les conditions dans lesquelles arcaniStudio met le site à disposition et dans lesquelles l'utilisateur peut le consulter. Le site est informatif : il présente les services d'arcaniStudio et permet aux visiteurs de prendre contact.",
            ],
          },
          {
            heading: 'Accès au site',
            content: [
              "Le site est accessible gratuitement à tout utilisateur disposant d'un accès à internet. L'utilisateur s'engage à l'utiliser conformément à sa destination et à s'abstenir de tout comportement susceptible d'en perturber le fonctionnement, notamment l'aspiration à grande échelle et l'abus du formulaire de contact (spam, soumissions automatisées). Les soumissions sont limitées en fréquence et filtrées.",
            ],
          },
          {
            heading: 'Propriété intellectuelle',
            content: [
              "Le design, le code, les contenus et l'identité de marque de ce site sont la propriété d'arcaniStudio. Toute reproduction ou utilisation sans autorisation préalable est interdite. Les logos et travaux de clients présentés sur le site le sont à des fins de portfolio, avec leur autorisation ; leur présence ne constitue pas une approbation d'arcaniStudio, sauf mention explicite du client.",
            ],
          },
          {
            heading: 'Prestations et engagements',
            content: [
              "Ce site est purement informatif. Le périmètre, le prix, les délais et les livrables de tout projet client sont définis exclusivement dans un contrat signé séparément (devis et contrat), et jamais par le contenu de ce site.",
            ],
          },
          {
            heading: 'Absence de garantie de résultat',
            content: [
              "Les études de cas, témoignages et exemples présentés sur ce site illustrent des projets passés. Ils ne garantissent pas de résultats similaires pour un futur projet, chaque projet étant différent.",
            ],
          },
          {
            heading: 'Liens et services tiers',
            content: [
              "Ce site intègre un widget de réservation Cal.com et renvoie vers des sites externes (comme notre profil Instagram). arcaniStudio n'est pas responsable du contenu ou des pratiques de confidentialité des sites qu'elle n'exploite pas.",
            ],
          },
          {
            heading: 'Données personnelles',
            content: ['Le traitement des données personnelles collectées via ce site est décrit dans notre politique de confidentialité.'],
          },
          {
            heading: 'Limitation de responsabilité',
            content: [
              "Dans la mesure permise par la loi applicable, arcaniStudio ne saurait être tenue responsable des dommages indirects, accessoires ou consécutifs résultant de l'utilisation de ce site.",
            ],
          },
          {
            heading: 'Droit applicable',
            content: ["Les présentes CGU sont régies par le droit algérien, pays où arcaniStudio exerce son activité."],
          },
          {
            heading: 'Modification des CGU',
            content: [
              "arcaniStudio peut modifier les présentes CGU à mesure que le site évolue. Toute utilisation du site postérieure à une modification vaut acceptation des CGU mises à jour.",
            ],
          },
          {
            heading: 'Contact',
            content: ['Pour toute question relative aux présentes CGU : contact@arcanistudio.com.'],
          },
        ],
      },
    },
  },
}
