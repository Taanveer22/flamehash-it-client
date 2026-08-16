import { motion } from "motion/react";
import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const socials = [
  { icon: FaGithub, label: "GitHub", href: "#" },
  { icon: FaXTwitter, label: "Twitter", href: "#" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "#" },
  { icon: FaFacebookF, label: "Facebook", href: "#" },
];

// ---- Framer Motion variants -------------------------------------------

const containerStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const iconStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const iconItem = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// -------------------------------------------------------------------------

const Footer = () => {
  return (
    <footer className="relative border-t border-base-300 bg-base-100">
      {/* Hairline gradient accent along the top edge — the one "signature"
          premium touch, kept subtle so it doesn't fight the rest of the
          page's borders. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />

      <motion.div
        variants={containerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto flex min-h-16 max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 lg:flex-row lg:px-8"
      >
        {/* Brand */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-base-300 bg-base-200 text-sm font-semibold text-base-content"
          >
            L
          </motion.div>

          <div>
            <h3 className="text-sm font-medium tracking-tight text-base-content">
              Lab<span className="text-base-content/40">7</span>
            </h3>
            <p className="text-xs text-base-content/45">IT Agency</p>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.p
          variants={fadeUp}
          className="text-center text-sm text-base-content/45"
        >
          © {new Date().getFullYear()} Lab7. All rights reserved.
        </motion.p>

        {/* Social Icons */}
        <motion.div
          variants={iconStagger}
          className="flex items-center gap-2"
        >
          {socials.map(({ icon: Icon, label, href }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              variants={iconItem}
              whileHover={{ y: -2, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="
                inline-flex h-9 w-9 items-center justify-center
                rounded-md border border-base-300 bg-base-200
                text-base-content/50
                transition-colors duration-200
                hover:border-primary/40 hover:bg-base-300 hover:text-primary
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-primary focus-visible:ring-offset-2
                focus-visible:ring-offset-base-100
              "
            >
              <Icon size={16} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;