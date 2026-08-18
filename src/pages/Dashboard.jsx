import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Sample data — swap these for your API response, shape stays same   */
/* ------------------------------------------------------------------ */

const STATS = [
  { label: "Total Customers", value:250, change: 12, trend: "up", icon: "users" },
  { label: "New Leads", value: 95, change: 8, trend: "up", icon: "userPlus" },
  { label: "Deals Closed", value: 200, change: 12, trend: "up", icon: "check" },
  { label: "Lost Deals", value: 15, change: -3, trend: "down", icon: "trendDown" },
];

const REVENUE_DATA = [
  { month: "Jan", closed: 5200, pipeline: 17500 },
  { month: "Feb", closed: 9800, pipeline: 19800 },
  { month: "Mar", closed: 8600, pipeline: 18600 },
  { month: "Apr", closed: 6200, pipeline: 15200 },
  { month: "May", closed: 8900, pipeline: 19200 },
  { month: "Jun", closed: 7100, pipeline: 16800 },
  { month: "Jul", closed: 8300, pipeline: 17900 },
  { month: "Aug", closed: 6400, pipeline: 14400 },
  { month: "Sep", closed: 4600, pipeline: 12200 },
  { month: "Oct", closed: 1350, pipeline: 25600 },
  { month: "Nov", closed: 5700, pipeline: 14000 },
  { month: "Dec", closed: 9200, pipeline: 18000 },
];

const REVENUE_SOURCES = [
  { label: "Website", value: 4385, change: 4.7, color: "var(--color-secondary)" },
  { label: "Marketplace", value: 4590, change: 2.1, color: "var(--color-primary)" },
  { label: "Affiliate", value: 18356, change: -1.7, color: "var(--color-neutral)" },
];

const REVENUE_TOTAL = REVENUE_SOURCES.reduce((sum, s) => sum + s.value, 0);
const Y_TICKS = [30000, 25000, 20000, 15000, 10000, 5000, 0];

// viewBox space for the donut — this stays fixed. The *rendered* size is
// controlled purely by the responsive width/height Tailwind classes on its
// wrapping div (svg is set to width="100%" height="100%"), so the same
// geometry scales cleanly from phone to desktop with no JS/resize-listener
// needed.
const DONUT_SIZE = 220;
const DONUT_STROKE = 26;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;

// A single "premium" easing curve reused everywhere so every animation in
// the dashboard feels like it belongs to the same motion language.
const EASE = [0.16, 1, 0.3, 1];

// Shared glow-border hover style for every card — amber ring + soft glow,
// driven off the daisyUI `primary` token so it follows your theme.
const glowHover = {
  y: -4,
  borderColor: "var(--color-primary)",
  boxShadow:
    "0 0 0 1px var(--color-primary), 0 0 0 5px color-mix(in oklab, var(--color-primary) 18%, transparent), 0 18px 34px -14px color-mix(in oklab, var(--color-primary) 55%, transparent)",
  transition: { duration: 0.25, ease: EASE },
};

/* ------------------------------------------------------------------ */
/*  Icons — tiny inline SVGs, zero icon-library dependency             */
/* ------------------------------------------------------------------ */

function Icon({ name, className }) {
  const common = { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.6, className };

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M13.5 17v-1.5a3 3 0 0 0-3-3h-5a3 3 0 0 0-3 3V17" strokeLinecap="round" />
        <circle cx="8" cy="6.5" r="2.75" />
        <path d="M16.5 17v-1.5a3 3 0 0 0-2-2.83" strokeLinecap="round" />
        <path d="M12.5 3.2a2.75 2.75 0 0 1 0 5.35" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "userPlus") {
    return (
      <svg {...common}>
        <circle cx="8" cy="6.5" r="3" />
        <path d="M2.5 17v-1.2A4.3 4.3 0 0 1 6.8 11.5h2.4A4.3 4.3 0 0 1 13.5 15.8V17" strokeLinecap="round" />
        <path d="M15.5 6v4.5M17.75 8.25h-4.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "check") {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="7.25" />
        <path d="M7 10.2l2 2 4-4.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // trendDown
  return (
    <svg {...common}>
      <path d="M3 6l5.2 5.2 3-3L17 13.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 13.5h4v-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  StatCard — load-in stagger, count-up number, glow-border hover     */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.1, ease: "easeOut" });
    return controls.stop;
  }, [value, motionValue]);

  return <motion.span>{rounded}</motion.span>;
}

function StatCard({ icon, label, value, change, trend, period = "Last 7 days", index = 0 }) {
  const isPositive = trend === "up";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      whileHover={glowHover}
      className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-base-content/60 sm:text-sm">{label}</p>
        <motion.span
          whileHover={{ rotate: 12, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-base-300 text-base-content/70 sm:h-9 sm:w-9"
        >
          <Icon name={icon} className="h-4 w-4 sm:h-5 sm:w-5" />
        </motion.span>
      </div>

      <div className="mt-3 text-2xl font-semibold tracking-tight text-base-content sm:text-3xl">
        <AnimatedNumber value={value} />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
        <span className="text-base-content/50">{period}</span>
        <span
          className={
            "badge badge-sm border-none font-medium " +
            (isPositive ? "bg-success/15 text-success" : "bg-error/15 text-error")
          }
        >
          {isPositive ? "+" : ""}
          {change}%
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  RevenueOverview — capsule bar chart: fills the card height,        */
/*  grows in view, hover tooltip, glow-border on the card itself.      */
/*  On small screens the bar track scrolls horizontally instead of     */
/*  squashing 12 months into an unreadable strip.                      */
/* ------------------------------------------------------------------ */

function RevenueOverview({ data, total, growth, max = 30000 }) {
  const [hoveredMonth, setHoveredMonth] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
      whileHover={glowHover}
      className="flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-base-content sm:text-base">Revenue Overview</h3>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight text-base-content sm:text-3xl">
              ${total.toLocaleString()}
            </span>
            <span className="badge badge-sm border-none bg-success/15 font-medium text-success">
              +{growth}%
            </span>
            <span className="text-xs text-base-content/50 sm:text-sm">vs last month</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-base-content/60 sm:gap-4 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neutral" />
            Closed Deals
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-base-300" />
            Pipeline Revenue
          </span>
        </div>
      </div>

      {/* chart area — explicit heights on small/medium screens keep the
          bars visible even though the card's own height is auto there;
          from lg up the row is stretched (items-stretch on the parent
          grid) so h-full takes over and matches RevenueSources. */}
      <div className="mt-6 flex h-56 gap-2 sm:mt-8 sm:h-64 sm:gap-3 md:h-72 lg:h-full lg:flex-1">
        {/* y-axis labels */}
        <div className="flex shrink-0 flex-col justify-between pb-6 text-[10px] text-base-content/40 sm:text-xs">
          {Y_TICKS.map((t) => (
            <span key={t}>{t === 0 ? "0k" : `${t / 1000}k`}</span>
          ))}
        </div>

        {/* bars — scrolls horizontally on very narrow viewports instead of
            crushing 12 bars into an unreadable strip; from sm up there's
            enough room and the min-width relaxes so bars fill the card. */}
        <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:thin]">
          <div className="flex h-full min-w-[520px] items-end justify-between gap-1.5 sm:min-w-0 sm:gap-2 md:gap-3">
            {data.map((m, i) => {
              const isHovered = hoveredMonth === m.month;
              return (
                <div
                  key={m.month}
                  onMouseEnter={() => setHoveredMonth(m.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  onTouchStart={() => setHoveredMonth(m.month)}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2 sm:gap-3"
                >
                  <div className="relative h-full w-full">
                    {/* hover tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.92 }}
                          transition={{ duration: 0.15, ease: EASE }}
                          className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-base-300 bg-base-100 px-2 py-1.5 text-[11px] shadow-lg sm:px-2.5 sm:text-xs"
                        >
                          <p className="font-medium text-base-content">${m.closed.toLocaleString()} closed</p>
                          <p className="text-base-content/50">${m.pipeline.toLocaleString()} pipeline</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* pipeline track */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${Math.min((m.pipeline / max) * 100, 100)}%` }}
                      viewport={{ once: true }}
                      animate={{ opacity: isHovered ? 0.7 : 1 }}
                      transition={{
                        height: { duration: 0.6, delay: i * 0.04, ease: EASE },
                        opacity: { duration: 0.15 },
                      }}
                      className="absolute inset-x-0 bottom-0 mx-auto w-1.5 rounded-full bg-base-300 sm:w-2"
                    />
                    {/* closed deals fill */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${Math.min((m.closed / max) * 100, 100)}%` }}
                      viewport={{ once: true }}
                      animate={{ filter: isHovered ? "brightness(1.3)" : "brightness(1)" }}
                      transition={{
                        height: { duration: 0.6, delay: i * 0.04 + 0.12, ease: EASE },
                        filter: { duration: 0.15 },
                      }}
                      className="absolute inset-x-0 bottom-0 mx-auto w-2.5 rounded-full bg-neutral sm:w-3"
                    />
                  </div>
                  <span
                    className={
                      "text-[10px] transition-colors sm:text-xs " +
                      (isHovered ? "text-base-content" : "text-base-content/50")
                    }
                  >
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  RevenueSources — donut: draws in view, arc <-> legend hover sync,  */
/*  glow-border on hover. The donut itself is now rendered at 100%     */
/*  width/height inside a responsively-sized wrapper, so it shrinks    */
/*  cleanly on phones instead of overflowing the card.                 */
/* ------------------------------------------------------------------ */

function RevenueSources({ data, total }) {
  const [hovered, setHovered] = useState(null);

  // Precompute each slice's start angle with reduce instead of mutating a
  // `let cumulative` variable inside the render-time .map() below — that
  // mutation-during-render pattern is what your linter was flagging.
  const segments = data.reduce((acc, d) => {
    const cumulativeBefore = acc.length ? acc[acc.length - 1].cumulativeAfter : 0;
    acc.push({
      ...d,
      fraction: d.value / total,
      startDeg: (cumulativeBefore / total) * 360,
      cumulativeAfter: cumulativeBefore + d.value,
    });
    return acc;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
      whileHover={glowHover}
      className="flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:p-6"
    >
      <h3 className="text-sm font-semibold text-base-content sm:text-base">Revenue Sources</h3>

      <div className="relative mx-auto mt-4 grid h-[170px] w-[170px] place-items-center sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
          className="-rotate-90"
        >
          {/* base track */}
          <circle
            cx={DONUT_SIZE / 2}
            cy={DONUT_SIZE / 2}
            r={DONUT_RADIUS}
            fill="none"
            stroke="var(--color-base-300)"
            strokeWidth={DONUT_STROKE}
          />

          {segments.map((d, i) => {
            const isHovered = hovered === d.label;
            const isDimmed = hovered && !isHovered;

            return (
              <motion.circle
                key={d.label}
                cx={DONUT_SIZE / 2}
                cy={DONUT_SIZE / 2}
                r={DONUT_RADIUS}
                fill="none"
                stroke={d.color}
                strokeWidth={DONUT_STROKE}
                strokeLinecap="round"
                onMouseEnter={() => setHovered(d.label)}
                onMouseLeave={() => setHovered(null)}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: d.fraction }}
                viewport={{ once: true }}
                animate={{
                  strokeWidth: isHovered ? DONUT_STROKE + 6 : DONUT_STROKE,
                  opacity: isDimmed ? 0.35 : 1,
                }}
                transition={{
                  pathLength: { duration: 0.8, delay: i * 0.15, ease: EASE },
                  strokeWidth: { duration: 0.2, ease: EASE },
                  opacity: { duration: 0.2, ease: EASE },
                }}
                style={{ rotate: d.startDeg, transformOrigin: "50% 50%", cursor: "pointer" }}
              />
            );
          })}
        </svg>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.div
            key={hovered ?? "total"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="text-center"
          >
            {hovered ? (
              <>
                <p className="text-[11px] text-base-content/50 sm:text-xs">{hovered}</p>
                <p className="text-lg font-semibold text-base-content sm:text-xl">
                  ${segments.find((d) => d.label === hovered).value.toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] text-base-content/50 sm:text-xs">Total</p>
                <p className="text-lg font-semibold text-base-content sm:text-xl">${total.toLocaleString()}</p>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* fills remaining card height and centers itself, so when this card
          matches RevenueOverview's height on large screens the legend sits
          nicely in the middle instead of leaving blank space underneath */}
      <ul className="mt-6 flex flex-1 flex-col justify-center space-y-1">
        {segments.map((d, i) => {
          const isPositive = d.change >= 0;
          return (
            <motion.li
              key={d.label}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.6 + i * 0.08, ease: EASE }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHovered(d.label)}
              onMouseLeave={() => setHovered(null)}
              className={
                "-mx-2 flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors sm:text-sm " +
                (hovered === d.label ? "bg-base-200" : "")
              }
            >
              <span className="flex items-center gap-2 text-base-content/80">
                <span className="h-2.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                {d.label}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-medium text-base-content">${d.value.toLocaleString()}</span>
                <span
                  className={
                    "badge badge-sm border-none font-medium " +
                    (isPositive ? "bg-success/15 text-success" : "bg-error/15 text-error")
                  }
                >
                  {isPositive ? "+" : ""}
                  {d.change}%
                </span>
              </span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard — top-level export                                       */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* stat cards — 2-up on phones so the row isn't a tall single
          column, 4-up from md (tablet landscape) upward */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      {/* charts — items-stretch (grid default) makes both columns share
          the row's height once they're side by side; the switch to a
          2-column layout now happens at lg (1024px) so tablets in
          portrait still get the taller, more readable single-column
          stack, while landscape tablets/laptops get the split view. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2">
          <RevenueOverview data={REVENUE_DATA} total={640000} growth={18} />
        </div>
        <div>
          <RevenueSources data={REVENUE_SOURCES} total={REVENUE_TOTAL} />
        </div>
      </div>
    </div>
  );
}