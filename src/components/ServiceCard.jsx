import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ModalForm from "./ModalForm";

// Content only. Card surface (running border, hover, scale) is owned
// by the parent <Services /> wrapper. Colors use daisyUI v5 semantic
// tokens (Tailwind v4 classes) so this matches whatever theme is active.
// No shadows anywhere — border/background only.

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function ServiceCard({ item }) {
  const {
    image,
    imageAlt = "Service image",
    title,
    description,
    badges = [],
    ctaLabel = "Learn More",
  } = item;

  // This ref is how we control the <dialog> element imperatively
  // (dialogs aren't opened/closed via normal React state — the browser
  // gives them their own .showModal() / .close() methods).
  const modalRef = useRef(null);

  return (
    <>
      <motion.div
        className="flex h-full w-full flex-col"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Image */}
        <motion.div variants={itemVariants} className="relative overflow-hidden">
          <motion.img
            src={image}
            alt={imageAlt}
            className="aspect-[16/10] w-full object-cover"
            initial={{ scale: 1.06, filter: "blur(3px)" }}
            whileInView={{ scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04 }}
            style={{ transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 via-base-100/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-base-content/10" />

          <motion.div
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-base-content/10 to-transparent"
            whileHover={{ x: "200%", transition: { duration: 0.9, ease: "easeInOut" } }}
          />
        </motion.div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
          {badges.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-wrap gap-1.5">
              {badges.map((badge) => {
                const Icon = badge.icon;

                return (
                  <motion.span
                    key={badge.label}
                    variants={badgeVariants}
                    whileHover={{ y: -1 }}
                    transition={{ duration: 0.15 }}
                    className="
                      inline-flex items-center gap-1
                      rounded-md
                      border border-base-300/70
                      bg-base-300/30
                      px-2 py-0.5
                      text-[11px] font-medium
                      leading-5
                      tracking-wide
                      text-base-content/80
                      transition-colors
                      hover:border-base-300
                      hover:bg-base-300/50
                      hover:text-base-content
                    "
                  >
                    {Icon && <Icon size={11} strokeWidth={2.25} />}
                    {badge.label}
                  </motion.span>
                );
              })}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="space-y-1.5">
            <h3 className="text-base font-semibold leading-tight tracking-tight text-base-content sm:text-[17px]">
              {title}
            </h3>
            <p className="text-[13px] leading-relaxed text-base-content/70 sm:text-[13.5px]">
              {description}
            </p>
          </motion.div>

          {/* CTA — opens the dialog */}
          <motion.button
            type="button"
            variants={itemVariants}
            onClick={() => modalRef.current?.showModal()}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
            className="
              group
              mt-1
              inline-flex
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-lg
              bg-base-content
              px-4
              py-2.5
              text-[13.5px]
              font-medium
              tracking-tight
              text-base-100
              transition-opacity
              duration-200
              hover:opacity-90
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
              focus-visible:ring-offset-base-100
            "
          >
            {ctaLabel}
            <motion.span
              className="inline-flex"
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
            >
              <ArrowRight size={15} strokeWidth={2.25} />
            </motion.span>
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box border border-base-300 bg-base-100 p-0 text-base-content">
          <form method="dialog">
            <button className="btn btn-circle btn-sm btn-ghost absolute top-3 right-3 z-10">
              ✕
            </button>
          </form>

          {/*
            We pass two props down to ModalForm:
            - serviceTitle: just so the form can show which service
              the enquiry is about (nice touch, totally optional).
            - onClose: a function ModalForm calls once the form has
              been submitted successfully, so IT decides *when* to
              close, but the dialog itself stays fully controlled by
              this parent component.
          */}
          <ModalForm
            serviceTitle={title}
            onClose={() => modalRef.current?.close()}
          />
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}