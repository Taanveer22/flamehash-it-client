import { useEffect, useState } from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { Calendar, Globe, Mic, Quote, Star } from "lucide-react";
import Heading from "../components/Heading";

// =============================================================================
// ABOUT US — bento grid, everything in one file
// -----------------------------------------------------------------------------
// Packages used (nothing else):
//   react 19, tailwindcss 4, daisyui 5, framer motion (imported from
//   "motion/react"), lucide-react
//   -> if your package is called "framer-motion", change line 2 to:
//      import { motion, MotionConfig, useReducedMotion } from "framer-motion";
//
// CSS file needs:  @import "tailwindcss";   @plugin "daisyui";
//
// How to read this file (top to bottom):
//   1. DATA           the people and the 13 quotes
//   2. ANIMATION      timings for the glow and the entrance
//   3. CARD PARTS     small building blocks, same idea as shadcn's <Card>
//   4. TILE PARTS     border glow, name tag, the tile itself
//   5. CONTENT PARTS  what can go inside a tile (big number, text, quotes...)
//   6. TILES          the list of boxes — edit THIS to change the page
//   7. AboutUs        the page that draws everything
//
// Tailwind tip: classes like `lg:col-span-4` only apply on large screens.
// Without a prefix a class applies everywhere; `sm:` = tablets and up.
// =============================================================================

// -----------------------------------------------------------------------------
// 1. DATA
// -----------------------------------------------------------------------------
// The center box now shows 13 quotes only (no names, no avatars).
// PLACEHOLDER = made-up text. Replace each line with a real quote.
// Want more or fewer quotes? Just add or remove a line — nothing else to change.

const quotes = [
  "Great products come from small teams with strong execution and clear communication.",
  "We ship small, learn fast and keep improving every single week.",
  "Clear documentation saves more time than any clever shortcut.",
  "Good design is invisible: users just feel that everything works.",
  "Quality is not a final step, it is part of every step.",
  "Our clients are partners, not tickets in a queue.",
  "A calm, well-planned sprint beats a stressful last-minute rush.",
  "Clean code today means happy teammates tomorrow.",
  "Marketing works best when it tells the honest story of the product.",
  "Every pixel should have a reason to be there.",
  "Automate the boring parts so we can focus on the creative parts.",
  "Testing early is cheaper than fixing late.",
  "Hire kind people, trust them, and give them room to do great work.",
];

// The people shown at the bottom of the OTHER boxes.
const team = {
  approach: {
    initials: "TI",
    name: "Tanvir Islam",
    role: "Full Stack Web Developer",
    gradient: "from-pink-500 to-rose-500",
  },
  hq: {
    initials: "SJ",
    name: "Shifat Jesun",
    role: "Digital Marketing Specialist",
    gradient: "from-sky-500 to-cyan-500",
  },
  sync: {
    initials: "AFZ",
    name: "Al Fattah Zisun",
    role: "Graphics Designer",
    gradient: "from-emerald-500 to-green-500",
  },

  // ---- PLACEHOLDERS ----
  founded: {
    initials: "FA",
    name: "Farhana Akter",
    role: "Operations Manager",
    gradient: "from-rose-500 to-orange-500",
  },
  rating: {
    initials: "SR",
    name: "Sadia Rahman",
    role: "Client Success",
    gradient: "from-amber-500 to-yellow-500",
  },
  countries: {
    initials: "AC",
    name: "Arif Chowdhury",
    role: "Sales Lead",
    gradient: "from-cyan-500 to-blue-500",
  },
  headcount: {
    initials: "MS",
    name: "Mim Sultana",
    role: "HR & Talent Lead",
    gradient: "from-fuchsia-500 to-purple-500",
  },
  discovery: {
    initials: "MK",
    name: "Mahmudul Karim",
    role: "Product Lead",
    gradient: "from-teal-500 to-emerald-500",
  },
  design: {
    initials: "NJ",
    name: "Nusrat Jahan",
    role: "UI/UX Designer",
    gradient: "from-orange-500 to-amber-500",
  },
  sprint: {
    initials: "RH",
    name: "Rafiul Hasan",
    role: "Backend Developer",
    gradient: "from-violet-500 to-purple-500",
  },
  handbook: {
    initials: "RM",
    name: "Rakib Mahmud",
    role: "DevOps Engineer",
    gradient: "from-lime-500 to-green-500",
  },
  playbook: {
    initials: "TA",
    name: "Tasnim Ahmed",
    role: "Project Manager",
    gradient: "from-blue-500 to-indigo-500",
  },
  checklist: {
    initials: "AZ",
    name: "Arshad Zaman",
    role: "Digital Marketer",
    gradient: "from-red-500 to-pink-500",
  },
};

// The little round avatars in the "Always in sync" box.
const syncCluster = [
  { initials: "UI", label: "UI", gradient: "from-teal-500 to-emerald-500" },
  {
    initials: "FE",
    label: "Frontend",
    gradient: "from-amber-500 to-orange-500",
  },
  { initials: "BE", label: "Backend", gradient: "from-sky-500 to-blue-500" },
  { initials: "QA", label: "QA", gradient: "from-fuchsia-500 to-purple-500" },
];

// -----------------------------------------------------------------------------
// 2. ANIMATION
// -----------------------------------------------------------------------------

// How many seconds the glowing "comet" takes to run once around a box.
// The glow moves to the next box after the same amount of time.
const LAP_SECONDS = 2.4;

// Put on the grid: makes the boxes appear one after another.
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// Put on every box: fade in, rise up and grow slightly.
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
// 3. CARD PARTS (shadcn style)
// -----------------------------------------------------------------------------
// shadcn splits a card into small pieces: Card, CardTitle, CardContent...
// We do the same. Each piece has a few default classes, and any `className`
// you pass is ADDED after them. (`data-slot` is just a label, like in shadcn.)

function Card({ className = "", ...props }) {
  return (
    <div
      data-slot="card"
      className={`relative flex flex-col overflow-hidden rounded-3xl bg-base-200 text-base-content shadow-sm ${className}`}
      {...props}
    />
  );
}

function CardTitle({ className = "", ...props }) {
  return (
    <h3
      data-slot="card-title"
      className={`font-semibold tracking-tight ${className}`}
      {...props}
    />
  );
}

function CardDescription({ className = "", ...props }) {
  return (
    <p
      data-slot="card-description"
      className={`text-base-content/60 ${className}`}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }) {
  return (
    <div
      data-slot="card-content"
      className={`relative flex flex-1 flex-col p-5 ${className}`}
      {...props}
    />
  );
}

function CardFooter({ className = "", ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={`relative px-5 pb-5 ${className}`}
      {...props}
    />
  );
}

// A round badge with initials. `size` picks one of these class sets.
const avatarSizes = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-xs",
  lg: "size-14 text-sm",
};

function Avatar({ initials, gradient, size = "sm", className = "", ...props }) {
  return (
    <span
      data-slot="avatar"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full bg-linear-to-br font-semibold text-white ${avatarSizes[size]} ${gradient} ${className}`}
      {...props}
    >
      {initials}
    </span>
  );
}

// -----------------------------------------------------------------------------
// 4. TILE PARTS
// -----------------------------------------------------------------------------

/**
 * ShimmerBorder
 * Draws a dim outline on every box, plus a bright "comet" that runs once
 * around the border while the box is `active` (it has the spotlight).
 *
 * `pathLength={100}` tells SVG "this outline is 100 units long", whatever
 * the real size, so the same animation numbers work on every box.
 * `activationKey` is used as the React `key`: when it changes, React
 * creates a fresh comet, so the animation restarts from the beginning.
 */
function ShimmerBorder({ active = false, activationKey, gradientId }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        {/* transparent -> bright -> transparent = the "comet" look.
            var(--color-...) are daisyUI theme colors, so it fits any theme. */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0" />
          <stop
            offset="50%"
            stopColor="var(--color-base-content)"
            stopOpacity="1"
          />
          <stop
            offset="100%"
            stopColor="var(--color-primary)"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {/* the dim outline, always visible */}
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        rx="24"
        pathLength={100}
        className="fill-none stroke-base-content/20"
        strokeWidth="2"
      />

      {/* the bright comet, only drawn while this box is active */}
      {active && (
        <motion.rect
          key={activationKey}
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="24"
          pathLength={100}
          stroke={`url(#${gradientId})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="22 78" // 22 units visible, 78 hidden = a short comet
          className="fill-none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }} // slide the dash once around the box
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

/** The small "avatar + name + position" row at the bottom of a box. */
function TeamMemberTag({ member }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex min-w-0 items-center gap-2.5"
    >
      <Avatar
        initials={member.initials}
        gradient={member.gradient}
        aria-hidden="true"
      />

      <div className="min-w-0">
        <p className="text-sm font-medium leading-tight text-base-content">
          {member.name}
        </p>
        <p className="text-xs leading-tight text-base-content/50">
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * BentoTile — one box in the grid.
 *
 *   index       this box's number in the spotlight order
 *   activeIndex the number of the box that has the spotlight right now
 *   member      the teammate shown at the bottom (leave it out = no footer)
 *   className   where the box sits in the grid, e.g. "lg:col-span-4"
 *   children    what's inside the box
 *
 * The outer motion.div is the grid item: it handles the entrance and the
 * hover lift. The <Card> inside it is the visible box.
 */
function BentoTile({ index, activeIndex, member, className = "", children }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
      className={`group ${className}`}
    >
      <Card className="h-full transition-shadow duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10">
        {/* thin light line along the top edge, gives a "physical edge" feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-base-content/15 to-transparent"
        />

        <ShimmerBorder
          active={index === activeIndex}
          activationKey={activeIndex}
          gradientId={`shimmer-gradient-${index}`}
        />

        <CardContent>{children}</CardContent>

        {/* only draw the footer when a member was given */}
        {member && (
          <CardFooter>
            <TeamMemberTag member={member} />
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// 5. CONTENT PARTS — things you can put inside a box
// -----------------------------------------------------------------------------

// Gradient text (like the purple text in the Apple design).
// It uses your daisyUI theme colors: primary -> secondary.
const gradientText =
  "bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent";

// Small uppercase label that sits above a title.
const eyebrow = "text-xs font-medium uppercase tracking-wider";

// Text sizes you can pick with the `size` prop below.
const statSizes = { md: "text-5xl", lg: "text-6xl" };
const titleSizes = { md: "text-xl sm:text-2xl", lg: "text-3xl" };

/** Icon + big value + caption. Used for the small boxes in the first row. */
function IconStat({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      <p className={`${gradientText} text-4xl font-bold leading-tight`}>
        {value}
      </p>
      <CardDescription className="text-sm">{label}</CardDescription>
    </div>
  );
}

/** Big centered number or word, with optional text above and below it. */
function StatContent({ top, value, label, size = "md" }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
      {top && <CardDescription className="text-xs">{top}</CardDescription>}
      <p
        className={`${gradientText} ${statSizes[size]} font-bold leading-tight`}
      >
        {value}
      </p>
      {label && <CardDescription className="text-sm">{label}</CardDescription>}
    </div>
  );
}

/** Left-aligned gradient title with an optional label above and text below. */
function TextContent({ label, title, text, size = "md", children }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-1.5">
      {label && <CardDescription className={eyebrow}>{label}</CardDescription>}
      <CardTitle className={`${gradientText} ${titleSizes[size]} leading-snug`}>
        {title}
      </CardTitle>
      {text && <CardDescription className="text-xs">{text}</CardDescription>}
      {children}
    </div>
  );
}

/**
 * A decorative grid of small squares (like the chip drawings in the Apple
 * design). The opacity comes from simple math instead of Math.random(), so
 * it looks the same every time the page loads.
 */
function PatternGrid({ cols = 5, rows = 5 }) {
  const cells = Array.from({ length: cols * rows }, (_, i) => i);

  return (
    <div
      aria-hidden="true"
      className="mt-5 grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {cells.map((i) => (
        <span
          key={i}
          className="aspect-square rounded-[3px] bg-primary"
          style={{ opacity: 0.12 + ((i * 7) % 11) / 16 }}
        />
      ))}
    </div>
  );
}

/**
 * QuoteBubble — ONE quote in a speech bubble (no name, no avatar).
 *
 * The hover effect copies the screenshot you sent:
 *   - a bright white outline appears around the bubble
 *   - the bubble background gets a little lighter
 *   - the bubble lifts up a few pixels
 *
 * `group/quote` gives this bubble its OWN hover group. That way, hovering the
 * bubble does not trigger the hover of the big tile around it.
 * The small tail under the bubble is a rotated square that follows the same
 * hover colors.
 */

// Normal and hovered bubble colors. `color-mix` blends two theme colors,
// so it works with any daisyUI theme (light or dark).
const bubbleBase = "bg-base-100";
const bubbleHover =
  "hover:bg-[color-mix(in_oklch,var(--color-base-100),var(--color-base-content)_14%)]";
const tailHover =
  "group-hover/quote:bg-[color-mix(in_oklch,var(--color-base-100),var(--color-base-content)_14%)]";

function QuoteBubble({ text }) {
  return (
    <motion.li
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group/quote relative"
    >
      {/* the bubble */}
      <div
        className={`relative rounded-2xl p-4 text-sm leading-relaxed text-base-content/80 ring-1 ring-base-content/10 transition-all duration-200 hover:text-base-content hover:ring-2 hover:ring-base-content ${bubbleBase} ${bubbleHover}`}
      >
        “{text}”
      </div>

      {/* the little tail under the bubble (a square turned 45 degrees) */}
      <span
        aria-hidden="true"
        className={`absolute -bottom-1.75 left-6 z-10 size-3 rotate-45 border-b-2 border-r-2 border-transparent transition-colors duration-200 group-hover/quote:border-base-content ${bubbleBase} ${tailHover}`}
      />
    </motion.li>
  );
}

/**
 * QuotesContent — the big centre box.
 * It shows every quote from the `quotes` list (13 of them) in a scrollable
 * column. Only the quote text is shown: no names, no avatars.
 *
 * Why the extra `relative` + `absolute inset-0` wrapper?
 * It gives the list a fixed area to scroll inside, so 13 quotes do not
 * stretch the whole grid taller.
 */
function QuotesContent({ items }) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2">
        <Quote className="size-5 text-primary" aria-hidden="true" />
        <CardDescription className={eyebrow}>
          {items.length} voices, one team
        </CardDescription>
      </div>

      {/* scroll area (min-h keeps it tall enough on phones and tablets) */}
      <div className="relative min-h-88 flex-1">
        <ul
          className="absolute inset-0 flex flex-col gap-5 overflow-y-auto px-1 pb-4 pt-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
          style={{
            // fade the top and bottom edges so quotes slide in/out softly
            maskImage:
              "linear-gradient(to bottom, transparent 0, black 12px, black calc(100% - 24px), transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0, black 12px, black calc(100% - 24px), transparent 100%)",
          }}
        >
          {items.map((text) => (
            <QuoteBubble key={text} text={text} />
          ))}
        </ul>
      </div>
    </div>
  );
}

/** "Always in sync" box: a softly pulsing mic next to overlapping team avatars. */
function SyncContent({ people }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <div className="space-y-1.5">
        <CardDescription className={eyebrow}>Always in sync</CardDescription>
        <CardTitle
          className={`${gradientText} text-xl leading-snug sm:text-2xl`}
        >
          Daily collaboration across time zones.
        </CardTitle>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-150 rounded-full bg-primary/20 blur-xl"
          />

          {/* scale: [1, 1.06, 1] = grow a little, then shrink back, forever */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative flex size-12 items-center justify-center rounded-full border border-base-content/15 bg-base-100/10 backdrop-blur"
          >
            <Mic className="size-5 text-base-content" aria-hidden="true" />
          </motion.div>
        </div>

        {/* -space-x-2 pulls each avatar left so they overlap */}
        <div className="flex -space-x-2">
          {people.map((person) => (
            <Avatar
              key={person.initials}
              initials={person.initials}
              gradient={person.gradient}
              title={person.label}
              className="border-2 border-base-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 6. TILES — edit this list to change the page
// -----------------------------------------------------------------------------
// One object per box, in reading order (left to right, top to bottom).
// To add or remove a box, add or remove an object.
//
//   id        a unique name
//   member    the teammate shown at the bottom (from `team` above).
//             The "quotes" box has NO member, so it has no name footer.
//   className where the box sits in the grid
//   content   what's inside the box
//
// The grid has 12 columns on large screens. `lg:col-span-4` = 4 columns wide,
// `lg:row-span-2` = 2 rows tall. The numbers in each row add up to 12:
//
//   row 1   | founded 2 | rating 2 | countries 2 | approach 3  | headcount 3 |
//   row 2-3 | hq 4        | quotes 4 (2 rows)    | discovery 2 | design 2    |
//   row 3   | sprint 2 | handbook 2 |  (quotes, discovery, design continue)
//   row 4   | playbook 4  | sync 4               | checklist 4               |
//
// On phones every box is full width. On tablets there are 2 columns.

const tiles = [
  // ------------------------------- Row 1 -------------------------------------
  {
    id: "founded",
    member: team.founded,
    className: "lg:col-span-2",
    content: <IconStat icon={Calendar} value="2026" label="Founded" />,
  },
  {
    id: "rating",
    member: team.rating,
    className: "lg:col-span-2",
    content: <IconStat icon={Star} value="4.9/5" label="Client rating" />,
  },
  {
    id: "countries",
    member: team.countries,
    className: "lg:col-span-2",
    content: <IconStat icon={Globe} value="10+" label="Countries" />,
  },
  {
    id: "approach",
    member: team.approach,
    className: "sm:col-span-2 lg:col-span-3",
    content: (
      <TextContent label="Our approach" title="Ship every week." size="lg" />
    ),
  },
  {
    id: "headcount",
    member: team.headcount,
    className: "lg:col-span-3",
    content: <StatContent value="13" label="Team members" size="lg" />,
  },

  // ------------------------------- Row 2 -------------------------------------
  {
    id: "hq",
    member: team.hq,
    className: "sm:col-span-2 lg:col-span-4",
    content: (
      <StatContent top="Marketing through" value="Advanced" label="Tools" />
    ),
  },
  {
    // The centre box: 13 quotes, NO member info.
    id: "quotes",
    className: "sm:col-span-2 lg:col-span-4 lg:row-span-2",
    content: <QuotesContent items={quotes} />,
  },
  {
    id: "discovery",
    member: team.discovery,
    className: "lg:col-span-2 lg:row-span-2",
    content: (
      <TextContent label="Step 01" title="Discovery workshop">
        <PatternGrid cols={4} rows={4} />
      </TextContent>
    ),
  },
  {
    id: "design",
    member: team.design,
    className: "lg:col-span-2 lg:row-span-2",
    content: (
      <TextContent label="Step 02" title="UI/UX strategy">
        <PatternGrid cols={5} rows={5} />
      </TextContent>
    ),
  },

  // ------------------------------- Row 3 -------------------------------------
  {
    id: "sprint",
    member: team.sprint,
    className: "lg:col-span-2",
    content: <TextContent label="Step 03" title="Development sprint" />,
  },
  {
    id: "handbook",
    member: team.handbook,
    className: "lg:col-span-2",
    content: (
      <TextContent
        label="Documentation"
        title="Development handbook"
        text="Coding standards and workflow"
      />
    ),
  },

  // ------------------------------- Row 4 -------------------------------------
  {
    id: "playbook",
    member: team.playbook,
    className: "sm:col-span-2 lg:col-span-4",
    content: (
      <TextContent
        label="Documentation"
        title="Project playbook"
        text="Delivery process and milestones"
      />
    ),
  },
  {
    id: "sync",
    member: team.sync,
    className: "sm:col-span-2 lg:col-span-4",
    content: <SyncContent people={syncCluster} />,
  },
  {
    id: "checklist",
    member: team.checklist,
    className: "sm:col-span-2 lg:col-span-4",
    content: (
      <TextContent
        label="Documentation"
        title="Quality checklist"
        text="Testing and deployment guidelines"
      />
    ),
  },
];

// -----------------------------------------------------------------------------
// 7. AboutUs — the page
// -----------------------------------------------------------------------------

export default function AboutUs() {
  // The number of the box that has the glowing spotlight right now.
  const [activeIndex, setActiveIndex] = useState(0);

  // true if the visitor asked their device for less motion.
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return; // no moving spotlight for those visitors

    // Every LAP_SECONDS, move the spotlight to the next box.
    // The `%` makes it jump back to box 0 after the last one.
    const id = setInterval(() => {
      setActiveIndex((current) => (current + 1) % tiles.length);
    }, LAP_SECONDS * 1000);

    // Stop the timer when the component leaves the page.
    return () => clearInterval(id);
  }, [reduceMotion]);

  // -1 means "no box is active"
  const spotlight = reduceMotion ? -1 : activeIndex;

  return (
    // reducedMotion="user" also softens the other animations for those visitors
    <MotionConfig reducedMotion="user">
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

          {/* ------------------------------ Grid ------------------------------ */}
          {/* 1 column on phones, 2 on tablets, 12 on large screens */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid auto-rows-[minmax(9rem,auto)] grid-cols-1 gap-4 sm:grid-flow-dense sm:grid-cols-2 lg:grid-flow-row lg:grid-cols-12 lg:gap-5"
          >
            {tiles.map((tile, index) => (
              <BentoTile
                key={tile.id}
                index={index}
                activeIndex={spotlight}
                member={tile.member}
                className={tile.className}
              >
                {tile.content}
              </BentoTile>
            ))}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
