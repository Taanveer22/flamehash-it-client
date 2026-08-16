import { motion } from "motion/react";
import Heading from "../components/Heading";
import ServiceCard from "../components/ServiceCard";
import { servicesData } from "../data/servicesData";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
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
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Services = () => {
  return (
    <section className="w-full bg-base-100">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mb-10 max-w-2xl text-center sm:mb-12"
      >
        <Heading
          title="Real problems, real outcomes."
          description="We don't showcase logos — we showcase results."
        />
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3"
      >
        {servicesData.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{
              y: -4,
              scale: 1.015,
              transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
            }}
            whileTap={{ scale: 0.99 }}
            className="group relative h-full rounded-2xl"
          >
            {/* Outer shell: clips the oversized rotating gradient behind it
                down to just a thin 2px edge (via p-[2px] + overflow-hidden).
                No mask-composite anywhere — this only relies on overflow
                clipping, so it can't silently fail to render. */}
            <div className="relative h-full overflow-hidden rounded-2xl p-[2px]">
              {/* Gradient layer — deliberately oversized (inset -100%) and
                  always rotating. At rest it's opacity-0 so nothing shows;
                  on hover it fades in already mid-spin, reading as "running". */}
              <motion.div
                className="
                  absolute -inset-full
                  opacity-0
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
                style={{
                  background:
                    "conic-gradient(from 0deg, var(--color-primary), var(--color-secondary), var(--color-primary))",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              {/* Card surface sits on top, covering everything except the
                  2px edge reserved by the outer shell's padding */}
              <div
                className="
                  relative flex h-full
                  overflow-hidden rounded-[14px]
                  border border-base-300/70
                  bg-base-200/95
                  backdrop-blur-sm
                  transition-colors duration-300
                  group-hover:border-transparent
                  group-hover:bg-base-200
                "
              >
                <ServiceCard item={item} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Services;
