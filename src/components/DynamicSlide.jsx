import { motion } from "motion/react";

// ── Animation variants ──────────────────────────────────────────────
// Parent variants just control timing (stagger/delay); child variants
// control the actual motion. Keeping them here, instead of writing
// animation objects inline on every element, keeps the JSX below clean.

// Wraps heading + description + button — fades each one in, one after
// another, instead of all three popping in at once.
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// Used by the heading, description, and button wrapper.
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// Wraps the 3 stat blocks at the bottom — a separate stagger group so
// its timing (and its delay before starting) can be tuned on its own,
// without affecting the heading/button animation above it.
const statGroupVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.4 },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// Shared shadcn-style button look, pulled out as a plain string so the
// JSX stays readable. If this button ends up reused elsewhere, turn it
// into a real <Button /> component later.
const primaryButtonClasses =
  "inline-flex h-11 items-center justify-center rounded-lg bg-white px-7 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-black/5 transition-colors duration-200 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:h-12 sm:px-8 sm:text-base";

// ── Data for the stats row ──────────────────────────────────────────
// Same trick as the slides array in Carousel.jsx — looping over data
// instead of hand-writing 3 near-identical <motion.div> blocks means
// adding a 4th stat later is a one-line change.
const stats = [
  { id: "users", value: "10K+", label: "Active Users" },
  { id: "uptime", value: "99.9%", label: "Uptime" },
  { id: "support", value: "24/7", label: "Support" },
];

const DynamicSlide = ({ image, heading, description }) => {
  return (
    // h-full / w-full — Carousel already fixes the height, this
    // component just fills whatever space it's given.
    <section className="relative isolate h-full w-full overflow-hidden">
      {/* Background image — starts slightly zoomed, eases down to normal */}
      <motion.img
        src={image}
        alt={heading}
        className="absolute inset-0 size-full object-cover"
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Dark overlay so white text stays readable over any photo */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80" />

      {/* Purely decorative glow behind the text */}
      <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl sm:h-72 sm:w-72 lg:h-96 lg:w-96" />

      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.6 }}
          variants={containerVariants}
        >
          <motion.h1
            variants={itemVariants}
            className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          >
            {heading}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-7 text-white/70 sm:mt-5 sm:text-base sm:leading-8 md:text-lg lg:text-xl"
          >
            {description}
          </motion.p>

          {/* Single CTA — centered, same size on every breakpoint */}
          <motion.div
            variants={itemVariants}
            className="mt-6 flex items-center justify-center sm:mt-10"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              // Soft glow that gently pulses forever, drawing the eye to
              // this one button since it's the only action on the slide.
              animate={{
                boxShadow: [
                  "0 0 0px rgba(255,255,255,0.0)",
                  "0 0 18px rgba(255,255,255,0.35)",
                  "0 0 0px rgba(255,255,255,0.0)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className={primaryButtonClasses}
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* Stats row — loops over the `stats` array above instead of
              repeating the same markup 3 times by hand */}
          <motion.div
            variants={statGroupVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-5 text-white/70 sm:mt-16 sm:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                className="flex items-center gap-5 sm:gap-8"
              >
                {/* Divider before every stat except the first one */}
                {index > 0 && <div className="h-8 w-px bg-white/20" />}

                <motion.div variants={statItemVariants}>
                  <p className="text-xl font-semibold text-white sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default DynamicSlide;