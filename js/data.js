/* ============================================================
   PROJECT DATA — clearly marked examples until replaced
   ============================================================ */
window.PROJECTS = [
  {
    id: "lumen-studio",
    title: "Lumen Studio",
    category: "Agency Website",
    theme: "theme-violet",
    url: "lumenstudio.example.com",
    summary: "A cinematic marketing site for a digital design studio, rebuilt for speed and presence.",
    problem: "Lumen's old site took 6+ seconds to load and looked identical to every template-based competitor. Bounce rate on mobile was over 70%.",
    role: "Lead frontend developer — I owned the rebuild end to end: technical direction, animation system, and performance budget.",
    solution: "Rebuilt as a lightweight static experience with a WebGL hero, scroll-driven storytelling, and a strict 150KB JavaScript budget.",
    tech: ["React", "GSAP", "Tailwind CSS", "Vite"],
    features: ["WebGL hero scene", "Scroll-driven case studies", "98+ Lighthouse scores", "CMS-powered blog"],
    result: { stat: "+64%", label: "contact inquiries in 90 days (example)" },
    liveUrl: "#",
    sourceUrl: "#",
    isExample: true
  },
  {
    id: "northpeak",
    title: "Northpeak Outfitters",
    category: "Landing Experience",
    theme: "theme-cyan",
    url: "northpeak.example.com",
    summary: "A high-converting product landing experience for an outdoor gear brand.",
    problem: "Paid traffic landed on a generic product grid. Conversion sat at 0.8% and the brand story was invisible.",
    role: "Frontend developer — I designed the conversion flow and built the interactive product storytelling.",
    solution: "A single-scroll narrative: sticky product visuals, comparison sliders, and social proof placed exactly where hesitation happens.",
    tech: ["Next.js", "TypeScript", "Stripe", "Framer Motion"],
    features: ["Interactive product explorer", "One-page checkout flow", "A/B tested hero variants", "Sub-second LCP"],
    result: { stat: "2.4x", label: "conversion rate vs. old pages (example)" },
    liveUrl: "#",
    sourceUrl: "#",
    isExample: true
  },
  {
    id: "pulseboard",
    title: "Pulseboard",
    category: "Web App UI",
    theme: "theme-rose",
    url: "pulseboard.example.com",
    summary: "A real-time analytics dashboard redesigned around clarity and speed.",
    problem: "The legacy dashboard buried key metrics under clutter. Users needed training just to read their own data.",
    role: "Frontend developer — I rebuilt the UI layer and the interactive charting system.",
    solution: "A calm, glanceable interface with live-updating charts, keyboard-first navigation, and a design system the team still uses.",
    tech: ["React", "D3.js", "WebSockets", "Sass"],
    features: ["Live data streaming", "Custom chart library", "Dark/light themes", "Full keyboard navigation"],
    result: { stat: "-38%", label: "support tickets about reporting (example)" },
    liveUrl: "#",
    sourceUrl: "#",
    isExample: true
  }
];
