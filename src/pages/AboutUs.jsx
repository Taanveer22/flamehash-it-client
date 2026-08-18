import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  CheckSquare,
  Square,
  Plus,
  Mic,
  Calendar,
  MapPin,
  Globe2,
  Star,
  Quote,
} from "lucide-react";
import Heading from "../components/Heading";

// =============================================================================
// ABOUT US SECTION
// -----------------------------------------------------------------------------
// 1. DATA      -> plain JS objects/arrays that feed the UI
// 2. ANIMATION -> Framer Motion variants + spotlight timing
// 3. UI PIECES -> card component + main AboutUs component
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DATA
// -----------------------------------------------------------------------------

const companyStats = [
  { icon: Calendar, label: "Founded", value: "2026" },
  { icon: MapPin, label: "HQ", value: "Dhaka, Bangladesh" },
  { icon: Globe2, label: "Countries", value: "10+" },
  { icon: Star, label: "Client rating", value: "4.9/5" },
];

const workflow = [
  { label: "Discovery workshop", done: true },
  { label: "UI/UX strategy", done: true },
  { label: "Development sprint", done: false },
];

const teamLead = {
  initials: "SS",
  name: "Sumit Saha",
  role: "Founder, Analygen",
  quote:
    "Great products come from small teams with strong execution and clear communication.",
  gradient: "from-indigo-500 to-violet-500",
};

const team = [
  {
    initials: "TI",
    name: "Tanvir Islam",
    role: "Full Stack Web Developer",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    initials: "SJ",
    name: "Shifat Jesun",
    role: "Digital Marketing Specialist",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    initials: "AFZ",
    name: "Al Fattah Zisun",
    role: "Graphics Designer",
    gradient: "from-emerald-500 to-green-500",
  },
];

const docs = [
  { title: "Development handbook", subtitle: "Coding standards and workflow" },
  { title: "Project playbook", subtitle: "Delivery process and milestones" },
  { title: "Quality checklist", subtitle: "Testing and deployment guidelines" },
];

const cluster = [
  { initials: "UI", gradient: "from-teal-500 to-emerald-500" },
  { initials: "FE", gradient: "from-amber-500 to-orange-500" },
  { initials: "BE", gradient: "from-sky-500 to-blue-500" },
  { initials: "QA", gradient: "from-fuchsia-500 to-purple-500" },
];

// -----------------------------------------------------------------------------
// 2. ANIMATION
// -----------------------------------------------------------------------------

// Total cards the spotlight travels through (4 in grid 1, 3 in grid 2).
const CARD_COUNT = 7;

// Seconds for one full lap of the comet around a card's border.
// Also used as the interval delay, so the spotlight hands off right
// as the previous card's comet finishes its lap.
const LAP_SECONDS = 3.5;

// Staggers each card's entrance instead of showing them all at once.
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// Fade + rise + grow entrance, used by every card.
const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// -----------------------------------------------------------------------------
// 3. UI PIECES
// -----------------------------------------------------------------------------

/**
 * ShimmerBorder
 * -------------
 * Draws two things on top of a card:
 *   1. A dim outline, always visible on every card.
 *   2. A bright "comet" segment that travels once around the border,
 *      only while this card is `active`.
 *
 * `pathLength={100}` makes the rectangle's outline always equal "100
 * units", no matter the card's real size, so the same numbers work on
 * every card shape.
 *
 * The comet's animation is handled entirely by Framer Motion — it
 * animates `strokeDashoffset` from 0 to -100 once, then the card stops
 * being active and the comet unmounts (see `key` below).
 */
function ShimmerBorder({ radius = 24, active = false, activationKey, gradientId }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        {/* transparent -> bright -> transparent = the "comet" look.
            Uses theme variables so it looks right in light or dark mode. */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-base-content)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* dim resting outline, always on */}
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        rx={radius}
        pathLength={100}
        className="fill-none stroke-base-content/20"
        strokeWidth="2"
      />

      {/* bright comet — only exists while active. `key` forces a fresh
          mount each time this card becomes active again, so the
          animation always restarts from the beginning. */}
      {active && (
        <motion.rect
          key={activationKey}
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={radius}
          pathLength={100}
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="22 78"
          className="fill-none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: LAP_SECONDS, ease: "linear" }}
          style={{
            filter: `
              drop-shadow(0 0 4px var(--color-primary))
              drop-shadow(0 0 10px color-mix(in oklch, var(--color-base-content) 55%, transparent))
            `,
          }}
        />
      )}
    </svg>
  );
}

/**
 * MotionCard
 * -----------
 * Shared wrapper for every card in this section (border, background,
 * rounded corners, hover lift). Change the look here once, and every
 * card updates together.
 *
 * @param index       this card's position in the spotlight order (0-6)
 * @param activeIndex which card currently has the spotlight
 * @param radius      passed to ShimmerBorder so the glow matches the
 *                    card's actual shape (the circular card uses 999)
 */
function MotionCard({ children, className = "", radius = 24, index, activeIndex }) {
  const isActive = index === activeIndex;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
      className={`
        group relative overflow-hidden rounded-3xl
        bg-base-200
        shadow-sm
        transition-shadow duration-300
        hover:shadow-2xl hover:shadow-primary/10
        ${className}
      `}
    >
      {/* thin light line along the top edge, gives a "physical edge" feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-base-content/15 to-transparent"
      />

      {/* glowing border — lit up only while this card is active */}
      <ShimmerBorder
        radius={radius}
        active={isActive}
        activationKey={activeIndex}
        gradientId={`shimmer-gradient-${index}`}
      />

      {children}
    </motion.div>
  );
}

/**
 * AboutUs
 * -------
 * Two card grids:
 *   Grid 1: company stats, workflow, team count, founder quote
 *   Grid 2: docs, sync illustration, team list
 */
export default function AboutUs() {
  // Which card index currently holds the spotlight. A timer advances it
  // every LAP_SECONDS, wrapping back to 0 with `% CARD_COUNT`.
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % CARD_COUNT);
    }, LAP_SECONDS * 1000);

    // Clean up the timer so it doesn't keep running after unmount.
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      <div className="font-body">
        {/* ----------------------------- Header ----------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <Heading
            title="Our Teams"
            description="We don't rely on big-name logos to prove our worth—our software speaks for itself"
          />
        </motion.div>

        {/* --------------------------- First grid --------------------------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* --- Card: company stats --- */}
          <MotionCard index={0} activeIndex={activeIndex} className="p-6">
            <h3 className="text-base font-semibold text-base-content">
              At a glance.
              <span className="font-normal text-base-content/60"> The short version.</span>
            </h3>

            <div className="mt-6 space-y-3">
              {companyStats.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </div>
                  <span className="text-sm font-medium text-base-content">{item.value}</span>
                </div>
              ))}
            </div>
          </MotionCard>

          {/* --- Card: workflow / approach --- */}
          <MotionCard index={1} activeIndex={activeIndex} className="p-6">
            <h3 className="text-base font-semibold text-base-content">
              Our approach.
              <span className="font-normal text-base-content/60"> Ship every week.</span>
            </h3>

            <div className="mt-6 space-y-2">
              {workflow.map((step) => (
                <motion.div
                  key={step.label}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 rounded-lg border border-base-content/10 bg-base-content/5 px-3 py-2"
                >
                  {step.done ? (
                    <CheckSquare className="h-4 w-4 text-success" />
                  ) : (
                    <Square className="h-4 w-4 text-base-content/40" />
                  )}
                  <span className="text-sm text-base-content/80">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </MotionCard>

          {/* --- Card: team count (circular) --- */}
          <MotionCard
            index={2}
            activeIndex={activeIndex}
            radius={999}
            className="flex aspect-square flex-col items-center justify-center rounded-full p-6"
          >
            {/* soft glow tied to the theme's primary color */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--color-primary) 35%, transparent), transparent 65%)",
              }}
            />

            <motion.span whileHover={{ scale: 1.08 }} className="relative text-6xl font-bold text-base-content">
              25
            </motion.span>

            <span className="relative mt-2 text-sm text-base-content/60">Team members</span>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-content shadow-md shadow-primary/30"
            >
              <Plus className="h-4 w-4" />
            </motion.button>
          </MotionCard>

          {/* --- Card: founder quote --- */}
          <MotionCard index={3} activeIndex={activeIndex} className="p-6">
            <Quote className="h-5 w-5 text-base-content/30" />

            <p className="mt-4 text-sm leading-relaxed text-base-content/80">"{teamLead.quote}"</p>

            <div className="mt-6 flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${teamLead.gradient}`}
              >
                <span className="text-xs font-semibold text-white">{teamLead.initials}</span>
              </motion.div>

              <div>
                <p className="text-sm font-medium text-base-content">{teamLead.name}</p>
                <p className="text-xs text-base-content/50">{teamLead.role}</p>
              </div>
            </div>
          </MotionCard>
        </motion.div>

        {/* -------------------------- Second grid --------------------------- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* --- Card: documentation list --- */}
          <MotionCard index={4} activeIndex={activeIndex} className="p-6">
            <h3 className="text-base font-semibold text-base-content">
              Our documentation.
              <span className="font-normal text-base-content/60"> Everything is documented.</span>
            </h3>

            <div className="mt-6 space-y-4">
              {docs.map((doc) => (
                <div key={doc.title}>
                  <p className="text-sm font-medium text-base-content">{doc.title}</p>
                  <p className="text-xs text-base-content/50">{doc.subtitle}</p>
                </div>
              ))}
            </div>
          </MotionCard>

          {/* --- Card: "always in sync" illustration --- */}
          <MotionCard index={5} activeIndex={activeIndex} className="p-6 lg:col-span-2">
            <h3 className="text-base font-semibold text-base-content">
              Always in sync.
              <span className="font-normal text-base-content/60"> Daily collaboration across time zones.</span>
            </h3>

            <div className="relative mt-8 flex h-32 items-center justify-center">
              <div className="absolute h-28 w-28 rounded-full bg-primary/20 blur-2xl" />

              {cluster.map((person, index) => {
                // fixed corner spots so the avatars form a loose ring
                const positions = [
                  "left-6 top-2",
                  "right-10 top-0",
                  "bottom-2 left-14",
                  "bottom-0 right-14",
                ];

                return (
                  <motion.div key={person.initials} whileHover={{ scale: 1.1 }} className={`absolute ${positions[index]}`}>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-base-200 bg-gradient-to-br ${person.gradient}`}
                    >
                      <span className="text-xs font-semibold text-white">{person.initials}</span>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative flex h-16 w-16 items-center justify-center rounded-full border border-base-content/15 bg-base-100/10 backdrop-blur"
              >
                <Mic className="h-6 w-6 text-base-content" />
              </motion.div>
            </div>
          </MotionCard>

          {/* --- Card: team list --- */}
          <MotionCard index={6} activeIndex={activeIndex} className="p-6">
            <h3 className="text-base font-semibold text-base-content">
              The team.
              <span className="font-normal text-base-content/60"> Meet the people.</span>
            </h3>

            <div className="mt-6 space-y-4">
              {team.map((member) => (
                <motion.div key={member.name} whileHover={{ x: 4 }} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient}`}>
                    <span className="text-[10px] font-semibold text-white">{member.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">{member.name}</p>
                    <p className="text-xs text-base-content/50">{member.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </MotionCard>
        </motion.div>
      </div>
    </section>
  );
}