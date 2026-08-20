import { motion } from "motion/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.jpg";
import DynamicSlide from "./DynamicSlide";

// ── Slide data ───────────────────────────────────────────────────────
// Kept as an array (instead of copy-pasting 3 <SwiperSlide> blocks) so
// adding a 4th banner later is just "add one more object here".
// `id` is used as the React key below — using `heading` as a key would
// break if two slides ever shared the same title, so a stable id is safer.
const slides = [
  {
    id: "transform-business",
    image: banner1,
    heading: "Transform Your Business",
    description:
      "We build scalable web applications, AI solutions, and digital experiences that help companies grow faster and smarter",
  },
  {
    id: "build-faster",
    image: banner2,
    heading: "Build Faster",
    description:
      "Scale your business faster with custom web apps, smart AI tools, and great digital experiences",
  },
  {
    id: "scale-smarter",
    image: banner3,
    heading: "Scale Smarter",
    description:
      "We engineer high-growth web apps, AI solutions, and digital tools to scale your brand",
  },
];

// ── Swiper styling, broken into small named pieces ─────────────────
// Swiper renders its own arrow/dot HTML outside our JSX, so we can't
// just add a className prop to "the arrow" directly. Instead, Tailwind's
// arbitrary-variant syntax [&_.swiper-x]:utility lets us reach into
// Swiper's own class names from the outside. Splitting it into a few
// small strings (instead of one giant one) makes each piece readable
// and easy to tweak on its own.

// Round, semi-transparent circle buttons for the next/prev arrows.
// Hidden on phones (max-sm) since swipe gestures already work there
// and small arrow buttons tend to just get in the way on touch.
const arrowStyles = `
  [&_.swiper-button-next]:h-9 [&_.swiper-button-next]:w-9
  [&_.swiper-button-next]:rounded-full [&_.swiper-button-next]:bg-black/30
  [&_.swiper-button-next]:text-white [&_.swiper-button-next]:backdrop-blur-sm
  [&_.swiper-button-next]:transition-colors [&_.swiper-button-next]:duration-200
  [&_.swiper-button-next]:after:text-sm [&_.swiper-button-next]:hover:bg-black/50

  [&_.swiper-button-prev]:h-9 [&_.swiper-button-prev]:w-9
  [&_.swiper-button-prev]:rounded-full [&_.swiper-button-prev]:bg-black/30
  [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:backdrop-blur-sm
  [&_.swiper-button-prev]:transition-colors [&_.swiper-button-prev]:duration-200
  [&_.swiper-button-prev]:after:text-sm [&_.swiper-button-prev]:hover:bg-black/50

  max-sm:[&_.swiper-button-next]:hidden
  max-sm:[&_.swiper-button-prev]:hidden

  sm:[&_.swiper-button-next]:h-10 sm:[&_.swiper-button-next]:w-10
  sm:[&_.swiper-button-next]:after:text-base
  sm:[&_.swiper-button-prev]:h-10 sm:[&_.swiper-button-prev]:w-10
  sm:[&_.swiper-button-prev]:after:text-base
`;

// The little dots at the bottom — dim white dots, with the active one
// growing into a wider pill shape so it's easy to spot at a glance.
const paginationStyles = `
  [&_.swiper-pagination-bullet]:bg-white/50
  [&_.swiper-pagination-bullet]:opacity-100
  [&_.swiper-pagination-bullet]:transition-all
  [&_.swiper-pagination-bullet]:duration-200

  [&_.swiper-pagination-bullet-active]:w-5
  [&_.swiper-pagination-bullet-active]:rounded-full
  [&_.swiper-pagination-bullet-active]:bg-white
`;

// Final className passed to <Swiper> — just combines the pieces above.
const swiperClassName = `h-full w-full ${arrowStyles} ${paginationStyles}`;

const Carousel = () => {
  return (
    // Entrance animation: fades + rises into place once it scrolls into view.
    // whileHover gives it the tiny shadcn-card "lift" on hover.
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      // clamp(floor, preferred, ceiling) — the banner scales fluidly with
      // the viewport height, but never gets too short on small phones or
      // too tall on ultra-wide monitors. This replaces a fixed "75vh".
      className="h-[clamp(420px,70vh,720px)] w-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className={swiperClassName}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <DynamicSlide {...slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default Carousel;
