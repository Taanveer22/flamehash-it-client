import { useEffect } from "react";
import { motion, useAnimationControls } from "motion/react";
import {
  Sparkles,
  Zap,
  Orbit,
  Waves,
  Flame,
  Leaf,
  Compass,
  Gem,
} from "lucide-react";
import Heading from "../components/Heading";

// Static class strings (not template-built) so Tailwind's JIT scanner
// picks them up — dynamic `bg-${color}/15` strings would be invisible to it.
const colorMap = {
  primary: "bg-primary/15",
  secondary: "bg-secondary/15",
  accent: "bg-accent/15",
  info: "bg-info/15",
  warning: "bg-warning/15",
  success: "bg-success/15",
};

const testimonials = [
  {
    name: "Brad Hanna",
    handle: "@Marko",
    company: "Nimbus",
    icon: Sparkles,
    color: "secondary",
    quote:
      "Studio has improved my workflow. The components are appealing and perform well right out of the box.",
  },
  {
    name: "Brad Hanna",
    handle: "@Marko",
    company: "Orbital",
    icon: Orbit,
    color: "success",
    quote:
      "Using Studio has made my projects intuitive and efficient. The documentation is clear and thorough.",
  },
  {
    name: "Brad Hanna",
    handle: "@Marko",
    company: "Flux",
    icon: Zap,
    color: "info",
    quote:
      "The community around Studio is fantastic! I've received support, making my experience so much smoother.",
  },
  {
    name: "Ella Johnson",
    handle: "@EllaJ",
    company: "Verve",
    icon: Flame,
    color: "warning",
    quote:
      "Using Studio has made my projects more efficient, with clear documentation and a great component set.",
  },
  {
    name: "Marcus Lee",
    handle: "@mlee",
    company: "Solace",
    icon: Waves,
    color: "accent",
    quote:
      "The build quality is outstanding. Every component just works, and the theming system saved us weeks.",
  },
  {
    name: "Priya Nair",
    handle: "@priyan",
    company: "Compass",
    icon: Compass,
    color: "primary",
    quote:
      "Support response time is incredible. We shipped our redesign twice as fast using this component set.",
  },
  {
    name: "Tom Reyes",
    handle: "@treyes",
    company: "Meadow",
    icon: Leaf,
    color: "success",
    quote:
      "Clean, accessible, and genuinely well thought out. It's rare to find a kit this polished out of the box.",
  },
  {
    name: "Aiko Sato",
    handle: "@aikos",
    company: "Facet",
    icon: Gem,
    color: "secondary",
    quote:
      "The attention to detail in every state — hover, focus, loading — is what sold the whole team on this.",
  },
];

// ---------------------------------------------------------------------
// Shared hover animation (same idea as the Contact page cards):
//  1. The OUTER motion.div gets `whileHover="hover"` — this switches
//     every motion element inside it to the "hover" variant.
//  2. The border-ring div just declares `variants={ringVariants}` and
//     automatically follows along — no extra state needed.
// ---------------------------------------------------------------------
const cardVariants = {
  rest: { y: 0 },
  hover: { y: -6, transition: { type: "spring", stiffness: 300, damping: 22 } },
};

const ringVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

const TestimonialCard = ({ item }) => {
  const Icon = item.icon;
  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    item.name
  )}&backgroundType=solid`;

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="w-[280px] shrink-0 px-3 sm:w-[300px]"
    >
      {/* Wrap the colored panel in a "relative" box so we can place
          the glowing border ring exactly on top of it. */}
      <div className="relative">
        {/* Colored panel: logo + speech bubble */}
        <div
          className={`relative rounded-2xl border border-base-300/50 p-5 pb-6 ${colorMap[item.color]}`}
        >
          <div className="flex items-center gap-2 text-base-content">
            <Icon size={20} strokeWidth={2.25} />
            <span className="text-base font-bold tracking-tight">
              {item.company}
            </span>
          </div>

          <div className="relative mt-5 rounded-xl bg-neutral p-4 text-sm leading-6 text-neutral-content shadow-sm">
            {item.quote}
            {/* Speech-bubble tail */}
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-6 h-4 w-4 rotate-45 rounded-[3px] bg-neutral"
            />
          </div>
        </div>

        {/* Glowing border ring — invisible until hovered.
            pointer-events-none so it never blocks clicks. */}
        <motion.div
          variants={ringVariants}
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-primary"
        />
      </div>

      {/* Avatar row — sits below the colored panel, on the page background */}
      <div className="mt-5 flex items-center gap-3 px-1">
        <img
          src={avatarUrl}
          alt={item.name}
          className="h-9 w-9 shrink-0 rounded-full border border-base-300 bg-base-200"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-base-content">
            {item.name}
          </p>
          <p className="truncate text-xs text-base-content/45">
            {item.handle}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  // Duplicated once so the loop from 0% to -50% looks seamless
  // (when the first copy scrolls fully out of view, the second
  // copy is sitting exactly where the first one started).
  const track = [...testimonials, ...testimonials];

  // -----------------------------------------------------------------
  // MARQUEE ANIMATION — done with Framer Motion instead of CSS
  // @keyframes.
  // -----------------------------------------------------------------
  // `useAnimationControls` gives us an object we can manually tell to
  // "start" or "stop" an animation, which is exactly what we need to
  // pause the scroll on hover.
  const controls = useAnimationControls();

  // The actual scroll animation: slide from 0% to -50%, forever,
  // at a constant speed (linear = no easing/acceleration).
  const scrollAnimation = {
    x: ["0%", "-50%"],
    transition: { duration: 30, ease: "linear", repeat: Infinity },
  };

  // Start the animation once, when the component first appears.
  useEffect(() => {
    controls.start(scrollAnimation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mouse enters the track -> stop scrolling.
  const pauseScroll = () => controls.stop();

  // Mouse leaves the track -> start scrolling again from the beginning.
  // (Simple approach for beginners: it restarts at 0% instead of
  // resuming from the exact spot it paused at.)
  const resumeScroll = () => controls.start(scrollAnimation);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-12 max-w-2xl px-4 text-center sm:text-left"
      >
        <Heading
          title="Testimonials"
          description="Predictive analytics has really made our processes smoother and boosted our business results a ton!"
        />
      </motion.div>

      {/* Marquee — edge-fade mask keeps the cutoff cards from looking
          abrupt at the container edges. This "mask" is just a static
          gradient (not an animation), so it stays as a style prop. */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        {/* animate={controls} hands control of this element over to
            the `controls` object above, so pauseScroll/resumeScroll
            can start and stop it. */}
        <motion.div
          animate={controls}
          onHoverStart={pauseScroll}
          onHoverEnd={resumeScroll}
          className="flex w-max py-2"
        >
          {track.map((item, i) => (
            <TestimonialCard key={`${item.name}-${i}`} item={item} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Testimonials;