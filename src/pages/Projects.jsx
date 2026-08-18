import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Heading from "../components/Heading";

/* ----------------------------------------------------------------------- */
/*  A NOTE ON THE TWO KINDS OF ANIMATION IN THIS FILE (for beginners)      */
/*  -----------------------------------------------------------------------*/
/*  1. Simple hovers (an icon nudging, an image zooming) use plain         */
/*     Tailwind `group` / `group-hover:` classes. That's pure CSS — no    */
/*     JavaScript needed for something this small, and it's the fastest.  */
/*                                                                         */
/*  2. Bigger interactions (a card lifting, a button reacting to a click)  */
/*     use Framer Motion's `whileHover` / `whileTap` props. These use     */
/*     spring physics under the hood, which feels bouncier and more       */
/*     "alive" than a linear CSS transition — and it's one readable prop  */
/*     instead of writing manual mouse-enter/mouse-leave state.           */
/*                                                                         */
/*  3. "On first view" animation uses `useInView`, a Framer Motion hook   */
/*     that returns `true` the moment an element scrolls into the         */
/*     viewport. We flip a single boolean (`isInView`) and every chart,   */
/*     bar, and ring below reacts to that same boolean — that's what      */
/*     makes the whole card "wake up" together instead of separately.     */
/* ----------------------------------------------------------------------- */

// A reusable "springy" feel — used anywhere something should feel bouncy.
const SPRING = { type: "spring", stiffness: 300, damping: 20 };

// Stagger helper: makes a group of children animate in one-after-another
// instead of all at once. Attach `container` to the parent and `item` to
// each child — Framer Motion handles the timing for you.
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

/* ----------------------------------------------------------------------- */
/*  DATA                                                                   */
/* ----------------------------------------------------------------------- */

const accuracyBenchmarks = [
  { label: "v1.0", value: 3.8 },
  { label: "v1.4", value: 4.1 },
  { label: "v2.0", value: 4.35 },
  { label: "v2.3", value: 4.5 },
  { label: "v3.0", value: 4.7 },
  { label: "v3.2", value: 4.86 },
];

const regionalUsage = [
  { label: "North America", value: 38 },
  { label: "Europe", value: 27 },
  { label: "Asia Pacific", value: 21 },
  { label: "Latin America", value: 14 },
];

const projectStack = ["Next.js", "Go", "PostgreSQL", "Kubernetes"];

const projects = [
  {
    id: "fintech-copilot",
    eyebrow: "Case study — fintech",
    title: "Underwriting copilot for a lending platform",
    description:
      "Rebuilt the risk-scoring pipeline around a fine-tuned model, cutting manual review time by 42% while improving approval accuracy.",
    visual: "benchmark",
  },
  {
    id: "retail-insights",
    eyebrow: "Case study — retail",
    title: "Real-time demand forecasting for a retail chain",
    description:
      "Unified store, warehouse, and supplier data into one pipeline, giving planners a live view that cut stockouts by 31% across 200+ locations.",
    visual: "regional",
  },
  {
    id: "cloud-replatform",
    eyebrow: "Case study — logistics",
    title: "Cloud replatform for a logistics network",
    description:
      "Migrated a legacy monolith to a containerised, multi-region cloud setup, reducing deployment time from days to minutes with zero downtime.",
    visual: "migration",
  },
  {
    id: "saas-mvp",
    eyebrow: "Case study — SaaS",
    title: "Zero-to-one build for a B2B SaaS startup",
    description:
      "Took a product from spec to MVP in 8 weeks with an embedded engineering pod, shipping a launch-ready platform investors could see live.",
    visual: "sprint",
  },
];

/* ----------------------------------------------------------------------- */
/*  REUSABLE ANIMATED PIECES                                               */
/*  Every bar / progress / ring in this file uses one of these three.      */
/*  Colors come from `var(--color-primary)` / `var(--color-secondary)`    */
/*  so they repaint themselves automatically when the DaisyUI theme        */
/*  changes — that's the whole fix for the "abyss" mismatch.               */
/* ----------------------------------------------------------------------- */

function AnimatedBar({ label, value, max, active, delay = 0 }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="text-xs font-medium text-base-content/60">
        {value.toFixed(2)}
      </span>

      <div className="flex h-32 w-full items-end overflow-hidden rounded-md bg-primary/10">
        <motion.div
          className="w-full origin-bottom rounded-md"
          style={{
            background:
              "linear-gradient(to top, var(--color-primary), var(--color-secondary))",
          }}
          initial={{ height: 0 }}
          animate={{ height: active ? `${(value / max) * 100}%` : 0 }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          // Hovering a single bar scales it up slightly, from its bottom edge.
          whileHover={{ scaleY: 1.06, filter: "brightness(1.15)" }}
        />
      </div>

      <span className="text-[10px] text-base-content/50">{label}</span>
    </div>
  );
}

function AnimatedProgressBar({ label, value, active, delay = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-base-content/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
          }}
          initial={{ width: 0 }}
          animate={{ width: active ? `${value}%` : 0 }}
          transition={{ duration: 0.6, delay, ease: "easeOut" }}
          whileHover={{ filter: "brightness(1.15)" }}
        />
      </div>
    </div>
  );
}

function AnimatedRing({ percentage, active }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      whileHover={{ scale: 1.08 }}
      transition={SPRING}
    >
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="var(--color-base-300)"
        strokeWidth="6"
      />
      <motion.circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ rotate: -90, transformOrigin: "32px 32px" }}
        initial={{ strokeDashoffset: circumference }}
        animate={{
          strokeDashoffset: active
            ? circumference - (percentage / 100) * circumference
            : circumference,
        }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

/* ----------------------------------------------------------------------- */
/*  Small pieces                                                           */
/* ----------------------------------------------------------------------- */

function ViewProjectButton() {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }} // gives the click a little "press" feedback
      transition={SPRING}
      className="group inline-flex w-fit items-center gap-1.5 rounded-lg border border-base-300 bg-primary/10 px-4 py-2 text-sm font-medium text-base-content transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-primary-content"
    >
      View project
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
    </motion.button>
  );
}

// A tiny continuous "glimmer" — loops forever, independent of hover/scroll.
// This is what makes the eyebrow icon feel alive even before you interact.
function GlimmerIcon() {
  return (
    <motion.span
      animate={{ rotate: [0, 15, 0, -15, 0], scale: [1, 1.15, 1] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
      className="inline-flex"
    >
      <Sparkles className="h-3.5 w-3.5" />
    </motion.span>
  );
}

/* ----------------------------------------------------------------------- */
/*  Project visuals — one small graphic per case study.                    */
/* ----------------------------------------------------------------------- */

function BenchmarkVisual({ active }) {
  return (
    <div className="flex h-full items-end gap-3 px-5 pb-5 pt-6">
      {accuracyBenchmarks.map((item, i) => (
        <AnimatedBar
          key={item.label}
          label={item.label}
          value={item.value}
          max={5}
          active={active}
          delay={i * 0.07}
        />
      ))}
    </div>
  );
}

function RegionalVisual({ active }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-base-content/60">
          Forecast accuracy by region
        </p>
        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
          +31% vs. baseline
        </span>
      </div>

      <p className="text-2xl font-semibold tracking-tight text-base-content">
        96.2% on-shelf rate
      </p>

      <div className="flex flex-col gap-3">
        {regionalUsage.map((row, i) => (
          <AnimatedProgressBar
            key={row.label}
            label={row.label}
            value={row.value}
            active={active}
            delay={i * 0.08}
          />
        ))}
      </div>
    </div>
  );
}

function MigrationVisual({ active }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="rounded-xl border border-base-300 bg-primary/5 p-4">
        <AnimatedProgressBar
          label="Legacy → cloud migration"
          value={100}
          active={active}
        />
      </div>

      <div className="flex flex-1 items-center justify-center gap-4 rounded-xl border border-base-300 bg-primary/5 p-4">
        <AnimatedRing percentage={99.98} active={active} />
        <div>
          <p className="text-lg font-semibold text-base-content">99.98%</p>
          <p className="text-[11px] text-base-content/60">
            Uptime since launch
          </p>
        </div>
      </div>
    </div>
  );
}

function SprintVisual({ active }) {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex-1 rounded-xl border border-base-300 bg-primary/5 p-4">
        <p className="mb-3 text-xs font-medium text-base-content">
          Embedded engineering pod
        </p>
        <div className="mb-3 flex -space-x-2">
          {[0.4, 0.55, 0.7, 0.85].map((opacity, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.15, zIndex: 10 }}
              transition={SPRING}
              className="h-8 w-8 rounded-full border-2 border-base-100 bg-primary"
              style={{ opacity }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {projectStack.map((tech) => (
            <motion.span
              key={tech}
              whileHover={{ scale: 1.08 }}
              transition={SPRING}
              className="rounded-md bg-base-200 px-2 py-1 text-[10px] font-medium text-base-content/70 hover:bg-primary/15"
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-base-300 bg-primary/5 p-4">
        <AnimatedProgressBar
          label="MVP launch — delivered in 8 weeks"
          value={100}
          active={active}
        />
      </div>
    </div>
  );
}

const visualComponents = {
  benchmark: BenchmarkVisual,
  regional: RegionalVisual,
  migration: MigrationVisual,
  sprint: SprintVisual,
};

/* ----------------------------------------------------------------------- */
/*  One project card                                                       */
/*  `useInView` tells us when the card has scrolled into view — that one   */
/*  boolean drives the card's fade-in, the staggered text reveal inside    */
/*  it, AND the chart. That's why everything wakes up together.            */
/*                                                                         */
/*  On hover, the whole card lifts and gets a colored glow (via Tailwind's */
/*  `shadow-{color}` utility, which — like everything else here — reads    */
/*  the current DaisyUI theme automatically). A soft "shine" sweep plays   */
/*  across the visual panel using a plain CSS `group-hover` transform, no  */
/*  extra JS needed for that part.                                        */
/* ----------------------------------------------------------------------- */

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });
  const Visual = visualComponents[project.visual];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 28, scale: 0.97 }
      }
      transition={{ duration: 0.55, delay: index * 0.12, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-lg transition-shadow duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20"
    >
      {/* Visual panel — chart zooms in slightly + a light "shine" sweeps
          across it on hover, both pure CSS via group-hover. */}
      <div className="relative h-56 overflow-hidden bg-base-200 sm:h-60">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
          <Visual active={isInView} />
        </div>

        {/* The shine: a diagonal light band that starts off-screen to the
            left and slides across on hover. */}
        <div
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-base-content/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
          aria-hidden="true"
        />
      </div>

      {/* Text block: staggered reveal, driven by the same isInView flag. */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="flex flex-1 flex-col gap-3 p-6"
      >
        <motion.span
          variants={staggerItem}
          className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-primary"
        >
          <GlimmerIcon />
          {project.eyebrow}
        </motion.span>

        <motion.h3
          variants={staggerItem}
          className="text-base font-semibold leading-snug text-base-content"
        >
          {project.title}
        </motion.h3>

        <motion.p
          variants={staggerItem}
          className="text-sm leading-relaxed text-base-content/60"
        >
          {project.description}
        </motion.p>

        <motion.div variants={staggerItem} className="mt-2">
          <ViewProjectButton />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------- */
/*  Section — no background, no outer padding. Drop this straight into    */
/*  your own `max-w-7xl mx-auto w-11/12 my-8` wrapper and it will fit.    */
/* ----------------------------------------------------------------------- */

export default function Projects() {
  return (
    <div>
      <div className="mb-8">
        <Heading
          title="Our Projects"
          description="Explore how we turn technical challenges into scalable products that drive real revenue"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}