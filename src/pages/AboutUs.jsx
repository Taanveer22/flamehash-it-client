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
// This file is split into 3 clear parts, top to bottom:
//   1. DATA        -> plain JS objects/arrays that feed the UI (easy to edit)
//   2. ANIMATION   -> Framer Motion variants (how things move on screen)
//   3. UI PIECES   -> reusable card component + the main AboutUs component
//
// If you're new to this codebase: you almost never need to touch parts 2/3.
// Most day-to-day changes (new team member, new stat, new quote) only
// require editing the DATA section below.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DATA
// -----------------------------------------------------------------------------

// Small stats shown in the "At a glance" card.
const companyStats = [
  { icon: Calendar, label: "Founded", value: "2021" },
  { icon: MapPin, label: "HQ", value: "Remote-first" },
  { icon: Globe2, label: "Countries", value: "18+" },
  { icon: Star, label: "Client rating", value: "4.9/5" },
];

// Steps shown in the "Our approach" checklist card.
// `done: true` renders a checked box, `done: false` renders an empty one.
const workflow = [
  { label: "Discovery workshop", done: true },
  { label: "UI/UX strategy", done: true },
  { label: "Development sprint", done: false },
];

// The founder / lead — shown with a quote in its own card.
const teamLead = {
  initials: "AR",
  name: "Atiqur Rahman",
  role: "Founder & Lead Developer",
  quote:
    "Great products come from small teams with strong execution and clear communication.",
  gradient: "from-indigo-500 to-violet-500",
};

// Rest of the team — shown in the "The team" list card.
const team = [
  {
    initials: "SA",
    name: "Sarah Ahmed",
    role: "UI/UX Designer",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    initials: "RK",
    name: "Rakib Khan",
    role: "Frontend Engineer",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    initials: "MJ",
    name: "Mehedi Jaman",
    role: "Backend Engineer",
    gradient: "from-emerald-500 to-green-500",
  },
];

// Documentation links shown in the "Our documentation" card.
const docs = [
  {
    title: "Development handbook",
    subtitle: "Coding standards and workflow",
  },
  {
    title: "Project playbook",
    subtitle: "Delivery process and milestones",
  },
  {
    title: "Quality checklist",
    subtitle: "Testing and deployment guidelines",
  },
];

// Little floating avatar bubbles in the "Always in sync" card.
const cluster = [
  { initials: "UI", gradient: "from-teal-500 to-emerald-500" },
  { initials: "FE", gradient: "from-amber-500 to-orange-500" },
  { initials: "BE", gradient: "from-sky-500 to-blue-500" },
  { initials: "QA", gradient: "from-fuchsia-500 to-purple-500" },
];

// -----------------------------------------------------------------------------
// 2. ANIMATION (Framer Motion + the traveling border spotlight)
// -----------------------------------------------------------------------------

// There are 7 cards total in this section (4 in the first grid, 3 in the
// second). The spotlight moves through them in this exact order: 0, 1, 2,
// 3, 4, 5, 6, then back to 0 — forever.
const CARD_COUNT = 7;

// How long the glowing comet takes to complete ONE full lap around a
// card's border, in seconds. This single number controls BOTH how long
// the CSS animation runs AND how long the JS timer waits before moving
// the spotlight to the next card — keeping them in sync.
const LAP_SECONDS = 3.5;

// Parent variant: staggers its children in one after another instead of
// everything appearing at once — this is what makes a grid of cards feel
// choreographed rather than just "on/off".
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Each card fades in, rises up slightly, and grows to full size.
// This runs on every card because every card uses `cardVariants` below.
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.97,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// -----------------------------------------------------------------------------
// 3. UI PIECES
// -----------------------------------------------------------------------------

/**
 * ShimmerBorder
 * -------------
 * Draws TWO rounded rectangles on top of a card, using SVG:
 *
 *   1. A dim, always-visible outline — this is the normal "resting" border,
 *      shown on every card, always.
 *   2. A short, bright, glowing "comet" segment — but ONLY while this
 *      specific card has been told it's `active`. When a card is not
 *      active, the comet simply isn't rendered, so it sits there quiet
 *      and dim like all the others.
 *
 * The comet is drawn with a transparent -> white -> transparent gradient
 * and animates its `stroke-dashoffset` exactly ONCE (not on a loop) —
 * one full lap around the border — which is what lets the parent
 * component hand the spotlight to the next card right as this one
 * finishes.
 *
 * `pathLength={100}` tells the browser "treat this rectangle's outline as
 * exactly 100 units long", no matter the card's real pixel size — so the
 * same dash numbers below work identically on every card shape.
 *
 * @param {number}  radius        - corner roundness in px (24 = rounded-3xl,
 *                                  a big number like 999 gives a full circle).
 * @param {boolean} active        - true while this card currently holds
 *                                  the spotlight.
 * @param {number}  activationKey - changes every time this card becomes
 *                                  active again; forces React to mount a
 *                                  brand-new <rect>, which restarts the
 *                                  CSS animation from the very start.
 * @param {string}  gradientId    - unique id for this card's <linearGradient>,
 *                                  since SVG ids must be unique on the page.
 */
function ShimmerBorder({ radius = 24, active = false, activationKey, gradientId }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        {/* transparent -> bright white -> transparent = the "comet" look */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 1. dim base outline — visible on every card, all the time */}
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

      {/* 2. bright comet — only exists while this card is active, and
             remounts (via `key`) every time it becomes active again so
             the animation always restarts from the beginning */}
      {active && (
        <rect
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
          className="fill-none shimmer-comet"
          style={{ animationDuration: `${LAP_SECONDS}s` }}
        />
      )}
    </svg>
  );
}

/**
 * MotionCard
 * -----------
 * A single reusable "card" wrapper used by every box in this section
 * (stats, workflow, team count, quote, docs, sync, team).
 *
 * Putting the shared look (border, background, rounded corners, hover
 * animation) in ONE component means:
 *   - every card automatically stays visually consistent
 *   - if you want to change the look of ALL cards, you only edit it here
 *
 * SPOTLIGHT BORDER:
 * Every card renders a `ShimmerBorder`, but only the card whose `index`
 * matches the section's current `activeIndex` actually shows the moving
 * comet — see `AboutUs` below for where that state lives.
 *
 * @param {number} index - this card's position in the spotlight order
 *   (0, 1, 2, ...). Must be unique per card and match the order you want
 *   the spotlight to travel in.
 * @param {number} activeIndex - which card index currently has the
 *   spotlight, passed down from `AboutUs`.
 * @param {number} radius - passed straight through to ShimmerBorder so the
 *   glowing outline matches this card's actual corner shape (the circular
 *   "team count" card passes a big radius to get a full circle).
 */
function MotionCard({
  children,
  className = "",
  radius = 24,
  index,
  activeIndex,
}) {
  const isActive = index === activeIndex;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -6,
        scale: 1.01,
        transition: { duration: 0.2 },
      }}
      className={`
        group relative overflow-hidden rounded-3xl
        bg-base-200
        shadow-sm
        transition-shadow duration-300
        hover:shadow-2xl hover:shadow-primary/10
        ${className}
      `}
    >
      {/* Hairline: a faint light line along the very top edge of the card.
          Barely visible, but it's what makes a flat card feel like it has
          a physical top edge catching light. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-base-content/15 to-transparent"
      />

      {/* The glowing border — only "lit up" while this card is active.
          `pointer-events-none` so it never blocks clicks/hovers. */}
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
 * The main exported section. Two card grids:
 *   Grid 1: company stats, workflow, team count, founder quote
 *   Grid 2: docs, sync illustration, team list
 */
export default function AboutUs() {
  // -----------------------------------------------------------------------
  // The spotlight: one shared "which card index is glowing right now"
  // value, owned right here and passed down to every card. A `setInterval`
  // moves it forward by 1 every `LAP_SECONDS`, and `% CARD_COUNT` wraps it
  // back to 0 once it passes the last card — so the sequence is always
  // 0 -> 1 -> 2 -> ... -> 6 -> 0 -> 1 -> ... forever.
  // -----------------------------------------------------------------------
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % CARD_COUNT);
    }, LAP_SECONDS * 1000);

    // Always clean up timers in useEffect, or they'd keep running (and
    // pile up) even after this component is removed from the page.
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full">
      {/*
        This <style> tag defines the ONE animation every card's comet uses.
        It says: "slide the dash pattern along the path one time, then
        stay at the end." Because the comet <rect> is only ever mounted
        while its card is active (see ShimmerBorder), "runs once" is
        exactly what we want — the JS timer above is what decides when to
        unmount it here and mount a fresh one on the next card.
      */}
      <style>{`
        @keyframes shimmer-travel {
          to {
            stroke-dashoffset: -100;
          }
        }
        .shimmer-comet {
          animation-name: shimmer-travel;
          animation-timing-function: linear;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          filter:
            drop-shadow(0 0 4px var(--color-primary))
            drop-shadow(0 0 10px rgba(255, 255, 255, 0.55));
        }
      `}</style>

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
            title="Less Hype. Proven Outcomes."
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
              <span className="font-normal text-base-content/60">
                {" "}
                The short version.
              </span>
            </h3>

            <div className="mt-6 space-y-3">
              {companyStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-sm text-base-content/60">
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </div>

                  <span className="text-sm font-medium text-base-content">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </MotionCard>

          {/* --- Card: workflow / approach --- */}
          <MotionCard index={1} activeIndex={activeIndex} className="p-6">
            <h3 className="text-base font-semibold text-base-content">
              Our approach.
              <span className="font-normal text-base-content/60">
                {" "}
                Ship every week.
              </span>
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

                  <span className="text-sm text-base-content/80">
                    {step.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </MotionCard>

          {/* --- Card: team count (circular) --- */}
          {/* radius={999} makes the shimmer border trace a full circle
              instead of rounded-rectangle corners, matching rounded-full */}
          <MotionCard
            index={2}
            activeIndex={activeIndex}
            radius={999}
            className="flex aspect-square flex-col items-center justify-center rounded-full p-6"
          >
            {/* Soft glow tied to the theme's primary color instead of a flat
                white glare — reads as intentional on any color theme. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, color-mix(in oklch, var(--color-primary) 35%, transparent), transparent 65%)",
              }}
            />

            <motion.span
              whileHover={{ scale: 1.08 }}
              className="relative text-6xl font-bold text-base-content"
            >
              48
            </motion.span>

            <span className="relative mt-2 text-sm text-base-content/60">
              Team members
            </span>

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

            <p className="mt-4 text-sm leading-relaxed text-base-content/80">
              "{teamLead.quote}"
            </p>

            <div className="mt-6 flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${teamLead.gradient}`}
              >
                <span className="text-xs font-semibold text-white">
                  {teamLead.initials}
                </span>
              </motion.div>

              <div>
                <p className="text-sm font-medium text-base-content">
                  {teamLead.name}
                </p>
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
              <span className="font-normal text-base-content/60">
                {" "}
                Everything is documented.
              </span>
            </h3>

            <div className="mt-6 space-y-4">
              {docs.map((doc) => (
                <div key={doc.title}>
                  <p className="text-sm font-medium text-base-content">
                    {doc.title}
                  </p>
                  <p className="text-xs text-base-content/50">{doc.subtitle}</p>
                </div>
              ))}
            </div>
          </MotionCard>

          {/* --- Card: "always in sync" illustration --- */}
          <MotionCard
            index={5}
            activeIndex={activeIndex}
            className="p-6 lg:col-span-2"
          >
            <h3 className="text-base font-semibold text-base-content">
              Always in sync.
              <span className="font-normal text-base-content/60">
                {" "}
                Daily collaboration across time zones.
              </span>
            </h3>

            <div className="relative mt-8 flex h-32 items-center justify-center">
              <div className="absolute h-28 w-28 rounded-full bg-primary/20 blur-2xl" />

              {cluster.map((person, index) => {
                // Each floating avatar has a fixed corner position so they
                // form a loose ring around the center microphone icon.
                const positions = [
                  "left-6 top-2",
                  "right-10 top-0",
                  "bottom-2 left-14",
                  "bottom-0 right-14",
                ];

                return (
                  <motion.div
                    key={person.initials}
                    whileHover={{ scale: 1.1 }}
                    className={`absolute ${positions[index]}`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-base-200 bg-gradient-to-br ${person.gradient}`}
                    >
                      <span className="text-xs font-semibold text-white">
                        {person.initials}
                      </span>
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
              <span className="font-normal text-base-content/60">
                {" "}
                Meet the people.
              </span>
            </h3>

            <div className="mt-6 space-y-4">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient}`}
                  >
                    <span className="text-[10px] font-semibold text-white">
                      {member.initials}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-base-content">
                      {member.name}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {member.role}
                    </p>
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