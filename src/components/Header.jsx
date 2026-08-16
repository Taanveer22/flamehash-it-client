import { useState } from "react";
import { NavLink } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/aboutUs" },
  { name: "Contact", path: "/contact" },
];

// A reusable "springy" feel for hover/tap — see Projects.jsx for the same
// constant and a longer explanation of why springs feel nicer than a
// straight linear CSS transition for interactive elements.
const SPRING = { type: "spring", stiffness: 300, damping: 20 };

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  // Shared style logic for both desktop and mobile links. Active links get
  // the theme's primary color so it's immediately obvious where you are.
  function getNavClass(isActive) {
    const base =
      "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100";

    if (isActive) {
      return `${base} bg-primary text-primary-content`;
    }

    return `${base} text-base-content/60 hover:bg-base-200 hover:text-base-content`;
  }

  return (
    // `relative` is required here so the hairline border below (which uses
    // `absolute`) positions itself against THIS header, not the whole page.
    <motion.header
      // "When the user sees it first": the header is at the very top of the
      // page, so there's no scrolling involved — it just needs to animate
      // in once, right when the page loads. A quick slide-down + fade does
      // that without being distracting on every reload.
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 relative bg-base-100/95 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo — a small whileHover spin gives it a bit of personality
            without needing any extra state or JS logic. */}
        <NavLink to="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.05 }}
            transition={SPRING}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-base-300 bg-base-200 font-semibold text-base-content"
          >
            L
          </motion.div>

          <div>
            <h1 className="text-sm font-semibold leading-none text-base-content">
              Lab7
            </h1>
            <p className="mt-1 text-xs text-base-content/50">IT Agency</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            // Framer Motion can't wrap <NavLink> directly (it isn't a plain
            // DOM tag), so we wrap it in a motion.div instead. The div
            // handles the hover "lift", the NavLink inside keeps all its
            // routing behavior untouched.
            <motion.div
              key={link.path}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) => getNavClass(isActive)}
              >
                {link.name}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Desktop Button — filled with the theme's primary color so it
            reads as the one action on the page you most want clicked. */}
        <motion.div
          // Named variants ("rest" / "hover") instead of inline objects —
          // this is what lets the arrow span below react to ITS PARENT's
          // hover state. Framer Motion only propagates hover down to
          // children automatically when both sides share variant names.
          initial="rest"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          variants={{ rest: { y: 0 }, hover: { y: -2 } }}
          transition={SPRING}
          className="hidden lg:inline-flex"
        >
          <NavLink
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100"
          >
            Dashboard
            <motion.span
              className="inline-flex"
              variants={{ rest: { x: 0 }, hover: { x: 3 } }}
            >
              <ArrowRight size={16} />
            </motion.span>
          </NavLink>
        </motion.div>

        {/* Mobile Menu Button — the icon itself crossfades + rotates
            between Menu and X instead of just swapping instantly. */}
        <button
          onClick={toggleMenu}
          className="rounded-md border border-base-300 p-2 text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-base-100 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={menuOpen ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Navigation — AnimatePresence lets the menu play an exit
          animation before it actually leaves the DOM (a plain `{menuOpen &&
          ...}` would just yank it away instantly on close). The links
          inside stagger in one after another for a smoother feel. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t border-base-300 bg-base-100 lg:hidden"
          >
            <motion.nav
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.05 },
                },
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-1 p-4"
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <NavLink
                    to={link.path}
                    onClick={closeMenu}
                    className={({ isActive }) => getNavClass(isActive)}
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-content shadow-sm transition-opacity hover:opacity-90"
                >
                  Dashboard
                  <ArrowRight size={16} />
                </NavLink>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hairline gradient accent along the bottom edge — same technique as
          the footer's top border, just flipped to `bottom-0` here. This
          replaces the old solid `border-b border-base-300` with a softer,
          fading line instead of a hard edge all the way across. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
    </motion.header>
  );
}