import {
  Code2,
  Megaphone,
  Palette,
  Rocket,
  Smartphone,
  Video,
} from "lucide-react";

import wd1 from "../assets/web-development.jpg";
import ad2 from "../assets/app-development.jpg";
import uiux3 from "../assets/ui-ux-design.jpg";
import gd4 from "../assets/graphics-design.jpg";
import dm5 from "../assets/digital-marketing.jpg";
import ve5 from "../assets/video-editing.jpg";

export const servicesData = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Building fast, responsive, and scalable websites with modern technologies like React, Node.js, and industry-standard development practices.",
    image: wd1,
    badges: [
      { label: "React & Node.js", icon: Code2 },
      { label: "SEO Optimized", icon: Rocket },
    ],
    ctaLabel: "Let's Build Your Website",
  },

  {
    id: 2,
    title: "App Development",
    description:
      "Creating high-performance mobile applications with intuitive interfaces, smooth experiences, and reliable cross-platform functionality.",
    image: ad2,
    badges: [
      { label: "Mobile Apps", icon: Smartphone },
      { label: "Cross Platform", icon: Rocket },
    ],
    ctaLabel: "Let's Build Your App",
  },

  {
    id: 3,
    title: "UI/UX Design",
    description:
      "Designing user-centered digital experiences with clean interfaces, thoughtful interactions, and engaging visual systems.",
    image: uiux3,
    badges: [
      { label: "Figma Design", icon: Palette },
      { label: "User Experience", icon: Rocket },
    ],
    ctaLabel: "Let's Create Your Design",
  },

  {
    id: 4,
    title: "Graphics Design",
    description:
      "Delivering creative visual solutions including brand identity, marketing materials, and digital graphics that strengthen your brand presence.",
    image: gd4,
    badges: [
      { label: "Brand Identity", icon: Palette },
      { label: "Creative Design", icon: Rocket },
    ],
    ctaLabel: "Let's Design Your Brand",
  },

  {
    id: 5,
    title: "Digital Marketing",
    description:
      "Developing result-driven marketing strategies through SEO, social media, and online campaigns to increase visibility and business growth.",
    image: dm5,
    badges: [
      { label: "SEO Marketing", icon: Megaphone },
      { label: "Growth Strategy", icon: Rocket },
    ],
    ctaLabel: "Let's Grow Your Business",
  },

  {
    id: 6,
    title: "Video Editing",
    description:
      "Producing engaging video content for social media, advertisements, and online platforms with professional editing techniques.",
    image: ve5,
    badges: [
      { label: "Video Production", icon: Video },
      { label: "Creative Editing", icon: Rocket },
    ],
    ctaLabel: "Let's Edit Your Videos",
  },
];
