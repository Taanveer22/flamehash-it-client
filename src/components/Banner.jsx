import { useMemo } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import {
  Code2,
  Database,
  CloudCog,
  GitBranch,
  TerminalSquare,
  Boxes,
  Globe2,
  ShieldCheck,
  Sparkles,
  Cpu,
  Rocket as RocketIcon,
  Layers as LayersIcon,
  ArrowUpRight,
} from "lucide-react";

/**
 * ============================================================================
 * ORBIT HERO BANNER — v8 (full-width grid layout, bigger center circle)
 * ============================================================================
 *
 * Stack: React 19, Tailwind CSS v4, daisyUI v5 (for the `base-100` /
 * `base-content` / `primary` / `success` CSS-variable color tokens used
 * below) and Motion v13 (imported as "motion/react").
 *
 * THIS COMPONENT OWNS NO OUTER SPACING ON PURPOSE.
 * You've already wrapped it in your root layout with something like:
 *
 *     <div className="mx-auto my-8 w-11/12 max-w-7xl">
 *       <Banner />
 *     </div>
 *
 * so this file never adds its own margin, padding, or max-width — that
 * would fight with the wrapper and cause double-spacing bugs. Everything
 * below only cares about what happens *inside* whatever box it's given,
 * and fills 100% of that width on every screen size.
 *
 * WHAT'S NEW IN THIS PASS
 * --------------------------
 * 1. THE ROW LAYOUT IS NOW CSS GRID, NOT FLEXBOX. The previous flexbox
 *    approach (percentage widths + `justify-between`) is what caused the
 *    uneven spacing you saw — flex has to be told an exact width for each
 *    circle and then guesses how to spread the leftover space, which gets
 *    inconsistent at in-between screen sizes. Grid's `fr` (fraction) units
 *    solve this properly: they divide the *container's* actual width into
 *    proportional columns natively, so the spacing scales smoothly with no
 *    special-casing. Full explanation at the `ORBIT_SIZE_CLASS` constant
 *    below.
 * 2. The center orbit circle is bigger relative to the two stat circles.
 * 3. The center panel now shows ONLY the glowing "Innovative Solutions"
 *    heading — the "Live" badge and the subtitle line underneath it were
 *    removed.
 * 4. Shimmering borders remain on the orbit circle's outer edge and on
 *    each of its orbiting icons (the two side stat circles intentionally
 *    stay plain/quiet — see `ShimmerBorder` below).
 *
 * HOW THE LAYOUT KEEPS THE CENTER CIRCLE CENTERED (read this if you're new)
 * ----------------------------------------------------------------------------
 * Below `lg`, `Banner` renders a flex column:
 *
 *     <div className="flex flex-col items-center ...">
 *
 * `items-center` centers every child *horizontally* — automatically, for
 * any child width — so the orbit circle (and both stat circles) always
 * sit in the exact horizontal center of the available space, on a 320px
 * phone or a 1000px tablet, with zero manual margin math.
 *
 * At `lg:` and up, it switches to a 3-column CSS grid instead
 * (`lg:grid lg:grid-cols-[1fr_1.9fr_1fr]`). The middle grid column IS the
 * mathematical center of the row, so the orbit circle sitting in it is
 * always centered — and each circle additionally sits inside its own
 * `flex justify-center` wrapper, so it stays centered within its column
 * even when its own max-width cap makes it narrower than the column.
 *
 * HOW THE SHIMMER BORDER WORKS (read this if you're new to CSS masks)
 * ------------------------------------------------------------------------
 * `ShimmerBorder` draws a thin, glowing ring that races around an element
 * forever — like a comet chasing its own tail. It needs to work on BOTH a
 * perfect circle (the orbit's outer edge) and a rounded square (each icon
 * node), so it can't use a simple round gradient. Instead it uses the
 * classic "gradient border" CSS trick:
 *
 *   1. The wrapper element gets `padding: <thickness>px` and TWO mask
 *      layers: one covering its full box, one covering only its
 *      `content-box` (i.e. everything *inside* the padding).
 *   2. `mask-composite: exclude` (and the `-webkit-` equivalent, `xor`,
 *      for Safari) subtracts the second mask from the first — so only the
 *      padding band itself stays visible. Whatever is drawn inside the
 *      wrapper (a spinning conic-gradient "comet") only ever shows up in
 *      that thin band, which automatically follows whatever `border-radius`
 *      you give the wrapper — a full circle, a rounded square, anything.
 *   3. A faint, non-spinning ring sits underneath so the shape always
 *      reads even while the bright comet is on the opposite side.
 *
 * Because the visible area is controlled entirely by the mask (not by
 * covering the middle with a solid color), this also works when the
 * inside of the shape needs to stay fully transparent — exactly what we
 * need for the orbit circle's outer edge, where icons and dashed paths
 * must still show through the middle.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// 1. STATIC DATA — keeping data separate from markup makes it easy to swap
//    icons or copy without touching any layout code below.
// ---------------------------------------------------------------------------

const INNER_RING_ICONS = [Code2, TerminalSquare, GitBranch, ShieldCheck];
const MIDDLE_RING_ICONS = [Database, Globe2, CloudCog, Boxes];
const OUTER_RING_ICONS = [RocketIcon, Sparkles, Cpu, LayersIcon];

const LEFT_STAT = {
  icon: RocketIcon,
  label: "Sprint Velocity",
  value: "82%",
  trend: "+24% this week",
};

const RIGHT_STAT = {
  icon: LayersIcon,
  label: "Project Overview",
  value: "$38.5k",
  trend: "+18.2% delivered",
};

// A soft colored shadow used ONLY on hover — no shadow at rest anywhere in
// this file, only on interaction, which keeps things feeling calm and
// intentional instead of busy.
const HOVER_SHADOW = "0 16px 40px -12px var(--color-primary)";

// ---------------------------------------------------------------------------
// 2. SMALL HELPERS
// ---------------------------------------------------------------------------

// Percentage-based circular layout for icons riding on a ring.
// `radius` (0–50) controls how far from the container's center the ring
// sits. Kept a little inside the very edge (max 46) so icons never clip.
function buildRingPositions(count, radius, offsetDeg = 0) {
  return Array.from({ length: count }, (_, i) => {
    const angle = ((360 / count) * i + offsetDeg) * (Math.PI / 180);
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
}

// ---------------------------------------------------------------------------
// 3. REUSABLE PIECES
// ---------------------------------------------------------------------------

/**
 * Badge
 * A tiny pill label: soft tinted background, no border, small text.
 * Reused for the center panel's "Live" indicator and the stat cards'
 * trend line.
 */
function Badge({ icon: Icon, children, tone = "primary" }) {
  const toneClasses =
    tone === "success"
      ? "bg-success/10 text-success"
      : "bg-primary/10 text-primary";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${toneClasses}`}
    >
      {Icon ? <Icon size={11} strokeWidth={2.5} /> : null}
      {children}
    </span>
  );
}

/**
 * ShimmerBorder
 * A thin ring that races around its parent forever, built with the CSS
 * mask trick explained in the file-level comment above. Works on any
 * `border-radius` — pass `radiusClass="rounded-full"` for a circle or
 * `radiusClass="rounded-xl"` (etc.) for a rounded square.
 *
 * HOW TO USE IT: place it as an absolutely-positioned child that fills its
 * parent (the parent must be `relative`). If the parent also needs a
 * solid-filled interior (like an icon node), inset that content by a few
 * pixels — see `IconNode` below — so the ring peeks out around it. If the
 * parent's interior should stay fully transparent (like the orbit circle's
 * outer edge), no inset is needed; the ring already only occupies its own
 * thin band.
 */
function ShimmerBorder({ radiusClass = "rounded-full", thickness = 2, duration = 4, reverse = false }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${radiusClass} overflow-hidden`}
      style={{
        padding: thickness,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    >
      {/* Faint static ring — keeps the shape visible even while the bright
          comet below is on the opposite side. */}
      <div className={`absolute inset-0 ${radiusClass} bg-base-content/20`} />

      {/* The comet: bright near the end of its sweep, transparent
          everywhere else, spinning forever. */}
      <motion.div
        className="absolute inset-[-50%]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 268deg, color-mix(in oklch, var(--color-primary) 60%, transparent) 320deg, white 345deg, var(--color-primary) 360deg)",
        }}
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/**
 * OrbitPath
 * The dashed circular "track" that shows where an orbit ring travels.
 * `inset` should match the radius used for that ring's icon positions
 * (formula: `inset = 50 - radius`, in percent).
 */
function OrbitPath({ inset }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-full border border-dashed border-base-content/15"
      style={{ inset }}
    />
  );
}

/**
 * IconNode
 * One orbiting icon. Has an always-on `ShimmerBorder` racing around its
 * edge, and on hover it lifts slightly, gains a soft colored shadow, and
 * its icon picks up the primary color.
 *
 * `sizeClass` is a *responsive* Tailwind size string (e.g.
 * "h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10") so the icon shrinks in step with
 * the orbit circle on small screens instead of overflowing it.
 */
function IconNode({ icon: Icon, sizeClass }) {
  return (
    <motion.div
      whileHover={{ scale: 1.18, y: -2, boxShadow: HOVER_SHADOW }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 16 }}
      className={`group/node relative rounded-xl ${sizeClass}`}
    >
      <ShimmerBorder radiusClass="rounded-xl" thickness={1.5} duration={3} />

      {/* Content sits inset by the ring's thickness (2px on each side) so
          the shimmering ring stays visible around it instead of being
          covered up. */}
      <div className="relative z-10 m-[2px] flex h-[calc(100%-4px)] w-[calc(100%-4px)] items-center justify-center rounded-[10px] bg-base-100 text-base-content/50 transition-colors duration-200 group-hover/node:text-primary">
        <Icon className="h-[45%] w-[45%]" strokeWidth={2} />
      </div>
    </motion.div>
  );
}

/**
 * OrbitRing
 * One ring of orbiting IconNodes. The whole ring spins together, and each
 * icon counter-rotates by the same amount so it stays upright as it
 * travels — like a gondola on a ferris wheel.
 */
function OrbitRing({ icons, positions, duration, direction, nodeSizeClass }) {
  return (
    // pointer-events-none on the rotating wrapper lets hover/clicks pass
    // through the empty parts of the ring to whatever sits underneath it.
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ transformOrigin: "50% 50%" }}
      animate={{ rotate: direction * 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {icons.map((Icon, i) => (
        <div
          key={i}
          className="pointer-events-auto absolute"
          style={{
            left: `${positions[i].x}%`,
            top: `${positions[i].y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            style={{ transformOrigin: "50% 50%" }}
            animate={{ rotate: direction * -360 }}
            transition={{ duration, repeat: Infinity, ease: "linear" }}
          >
            <IconNode icon={Icon} sizeClass={nodeSizeClass} />
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

/**
 * StatCircle
 * A perfect circle showing one stat, floating gently up and down. Kept
 * deliberately quiet — a plain 1px border, shadow only on hover, muted
 * label text — so the shimmering orbit circle in the middle stays the
 * page's one focal point.
 *
 * Sizing: `sizeClass` comes from `Banner` so both stat circles and the
 * center orbit circle share one consistent, responsive sizing system.
 */
function StatCircle({ stat, sizeClass, delay = 0 }) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={`shrink-0 ${sizeClass}`}
    >
      {/* Gentle continuous float */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        className="relative aspect-square w-full"
      >
        <motion.div
          whileHover={{ scale: 1.04, boxShadow: HOVER_SHADOW }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="relative h-full w-full overflow-hidden rounded-full border border-base-content/10 bg-base-100 shadow-sm shadow-black/[0.03] transition-colors duration-200 hover:border-primary/30"
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 px-5 text-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon size={16} strokeWidth={2} />
            </div>
            <p className="text-[10px] font-medium text-base-content/45">
              {stat.label}
            </p>
            <p className="text-xl font-bold text-base-content sm:text-2xl">
              {stat.value}
            </p>
            <Badge icon={ArrowUpRight} tone="success">
              {stat.trend}
            </Badge>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/**
 * TitlePanel
 * The center "planet" — no border, no shadow, ever. Two things make it
 * feel alive instead:
 *   1. INTERACTIVE TILT — the panel tilts slightly toward your cursor.
 *   2. GLOWING TITLE — a soft blurred copy of the heading sits behind the
 *      real text and gently breathes; the real text scales up on hover.
 *
 * Why the tilt and the centering live in one `style` object: Motion takes
 * full ownership of the `transform` CSS property whenever you animate a
 * Motion-managed value like `rotateX`. If centering were done with a
 * Tailwind class such as `-translate-x-1/2` instead, Motion would silently
 * overwrite it the moment the tilt kicks in, and the panel would drift
 * off-center. Putting `x: "-50%"` and `y: "-50%"` in the same `style`
 * object as `rotateX`/`rotateY` means Motion computes one single,
 * consistent `transform` from all four values together, every frame.
 */
function TitlePanel() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const rotateX = useTransform(cursorY, [-60, 60], [8, -8]);
  const rotateY = useTransform(cursorX, [-60, 60], [-8, 8]);

  function handleMouseMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    cursorX.set(event.clientX - bounds.left - bounds.width / 2);
    cursorY.set(event.clientY - bounds.top - bounds.height / 2);
  }

  function handleMouseLeave() {
    cursorX.set(0);
    cursorY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: "-50%", y: "-50%", rotateX, rotateY, transformPerspective: 700 }}
      className="absolute left-1/2 top-1/2 z-10 flex aspect-square w-[38%] min-w-28 flex-col items-center justify-center rounded-full text-center"
    >
      {/* Only the glowing heading lives here now — no badge, no subtitle.
          A blurred duplicate of the same text sits behind the real text
          and gently breathes, which is what creates the glow. */}
      <div className="relative px-4">
        <motion.p
          aria-hidden="true"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute inset-0 select-none text-sm font-bold leading-tight tracking-tight text-primary blur-md sm:text-base md:text-lg lg:text-xl"
        >
          Innovative Solutions
        </motion.p>

        <motion.p
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="relative cursor-default text-sm font-bold leading-tight tracking-tight text-base-content sm:text-base md:text-lg lg:text-xl"
        >
          Innovative <span className="text-primary">Solutions</span>
        </motion.p>
      </div>
    </motion.div>
  );
}

/**
 * OrbitCircle
 * The center "planet" (`TitlePanel`) with three rings of orbiting
 * `IconNode`s, plus a shimmering `ShimmerBorder` marking the circle's own
 * outer edge. Because `ShimmerBorder`'s visible ring is created entirely
 * by a CSS mask (not by covering the middle with a solid fill), the
 * circle's interior stays fully transparent — the ambient glow, dashed
 * paths, orbiting icons, and title panel all still show straight through.
 *
 * `sizeClass` comes from `Banner` — see the file-level comment for how
 * sizing stays consistent with the two stat circles across every screen.
 */
function OrbitCircle({ sizeClass }) {
  const innerPositions = useMemo(() => buildRingPositions(4, 21, -45), []);
  const middlePositions = useMemo(() => buildRingPositions(4, 34, 20), []);
  const outerPositions = useMemo(() => buildRingPositions(4, 46, 0), []);

  return (
    <div className={`relative aspect-square shrink-0 ${sizeClass}`}>
      {/* Soft ambient glow behind the whole circle */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-[-15%] -z-10 rounded-full bg-primary/10 blur-3xl"
      />

      {/* The orbit circle's own shimmering outer edge */}
      <ShimmerBorder radiusClass="rounded-full" thickness={2} duration={6} />

      {/* Dashed orbit-path guides — one per ring, inset = 50 - radius */}
      <OrbitPath inset="29%" />
      <OrbitPath inset="16%" />
      <OrbitPath inset="4%" />

      {/* Inner ring — smallest icons, fastest spin, closest to center */}
      <OrbitRing
        icons={INNER_RING_ICONS}
        positions={innerPositions}
        duration={16}
        direction={1}
        nodeSizeClass="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10"
      />
      {/* Middle ring — medium icons, medium speed, spins the other way */}
      <OrbitRing
        icons={MIDDLE_RING_ICONS}
        positions={middlePositions}
        duration={26}
        direction={-1}
        nodeSizeClass="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12"
      />
      {/* Outer ring — biggest icons, slowest spin, rides the circle's edge */}
      <OrbitRing
        icons={OUTER_RING_ICONS}
        positions={outerPositions}
        duration={38}
        direction={1}
        nodeSizeClass="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
      />

      <TitlePanel />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. THE BANNER — lays out all three circles and owns their shared sizing.
// ---------------------------------------------------------------------------

// Below `lg` the layout is a single stacked column, so each circle's
// available width is basically "however wide the screen is" — `vw`
// (viewport width) tracks that well, and `clamp(min, vw, max)` keeps it
// from ever getting too small or too large.
//
// At `lg:` the row switches to CSS GRID instead of flexbox. This is the
// key fix: grid's `fr` (fraction) units divide up the CONTAINER's actual
// width — not the viewport — so a `1fr / 1.9fr / 1fr` column split always
// gives the middle column ~1.9x the width of each side column, whether
// the container is 950px (a small laptop) or 1173px (the capped width of
// your `max-w-7xl w-11/12` root wrapper on a huge monitor). That's what
// makes this both full-width AND smooth: there's no viewport-vs-container
// mismatch left to cause uneven jumps in spacing.
//
// Each circle still gets its own `max-w-[...]` cap so it never grows
// past a sensible size even in a very wide column, and every circle sits
// inside a `flex justify-center` wrapper (see `Banner` below) so it's
// always centered within its own column — including the stat circles,
// and especially the orbit circle in the middle.
const ORBIT_SIZE_CLASS =
  "w-[clamp(240px,60vw,360px)] lg:w-full lg:max-w-[500px]";
const STAT_SIZE_CLASS =
  "w-[clamp(160px,42vw,220px)] lg:w-full lg:max-w-[260px]";

function Banner() {
  return (
    // This section adds zero margin, padding, or max-width of its own —
    // the root layout you already have (max-w-7xl w-11/12 mx-auto my-8)
    // is what positions this whole block on the page, and everything here
    // fills 100% of whatever width that wrapper provides.
    <section className="relative w-full">
      {/*
        Below `lg`: `flex flex-col items-center` stacks the three circles
        vertically. `items-center` centers every child horizontally no
        matter its width — this is what keeps the orbit circle perfectly
        centered on every small/medium screen.

        At `lg:` and up: `lg:grid lg:grid-cols-[1fr_1.9fr_1fr]` replaces
        the flex column with a 3-column grid that spans the FULL width of
        the container. The middle column is ~1.9x each side column, so it
        automatically fills the exact width the orbit circle needs while
        the two side columns automatically fill the width the stat circles
        need — with no hard-coded pixel math and no gaps that grow oddly
        at any particular screen size (see the constants above for the
        full explanation). Because the middle column is mathematically the
        center of the grid, the orbit circle is always centered — on a
        laptop, an ultrawide monitor, everywhere.

        The `order-*` classes control stacking order without duplicating
        markup: the orbit shows first on small screens, then the two stat
        circles below it; at `lg:` the natural left / center / right order
        is restored. Each column's inner `flex justify-center` keeps that
        column's circle centered even when its `max-w-[...]` cap makes it
        narrower than the column itself.
      */}
      <div className="flex w-full flex-col items-center gap-10 lg:grid lg:grid-cols-[1fr_1.9fr_1fr] lg:items-center lg:gap-6">
        <div className="order-2 flex w-full justify-center lg:order-1">
          <StatCircle stat={LEFT_STAT} sizeClass={STAT_SIZE_CLASS} delay={0.15} />
        </div>

        <div className="order-1 flex w-full justify-center lg:order-2">
          <OrbitCircle sizeClass={ORBIT_SIZE_CLASS} />
        </div>

        <div className="order-3 flex w-full justify-center lg:order-3">
          <StatCircle stat={RIGHT_STAT} sizeClass={STAT_SIZE_CLASS} delay={0.3} />
        </div>
      </div>
    </section>
  );
}

export default Banner;