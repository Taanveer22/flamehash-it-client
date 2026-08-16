import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../api/api";
import Heading from "../components/Heading";

// Simple list of contact info cards.
// To edit info, just change the values below.
const infoCards = [
  {
    icon: Mail,
    title: "Email",
    subtitle: "Get a response within 24 hours",
    value: "hello@mobile.com",
    href: "mailto:hello@mobile.com",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    subtitle: "Instant support available now",
    value: "Start chatting",
    href: "#chat",
  },
  {
    icon: Phone,
    title: "Phone",
    subtitle: "Mon–Fri, 9AM–6PM EST",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Office",
    subtitle: "Schedule an in-person meeting",
    value: "123 Innovation St, Tech City",
  },
];

// ---------------------------------------------------------------------
// Shared hover animation for every box on this page (info cards + form).
// "rest" = normal state, "hover" = when the mouse is over the box.
//
// How it works:
//  1. The OUTER motion.div gets `whileHover="hover"` — this tells Framer
//     Motion "when hovered, switch to the hover variant".
//  2. Any motion.div INSIDE it that also uses `variants={...}` will
//     automatically follow along (this is called "variant propagation").
//     That's how the border-ring fades in at the same time the card
//     scales up, without any extra state or event handlers.
// ---------------------------------------------------------------------
const cardVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.25, ease: "easeOut" } },
};

const ringVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

// A small wrapper so we don't repeat the "card + glowing ring" markup
// four/five times. Wrap any box in this to get the hover effect.
// `h-full` is passed through so the wrapper never shrinks below the
// height its parent (a flex/grid container) gives it — that's the key
// piece that lets the cards + form match height.
const HoverGlowBox = ({ className = "", children }) => (
  <motion.div
    variants={cardVariants}
    initial="rest"
    whileHover="hover"
    className="relative h-full"
  >
    {/* The actual content box */}
    <div className={className}>{children}</div>

    {/* The glowing border ring — starts invisible, fades in on hover.
        pointer-events-none so it never blocks clicks on the content. */}
    <motion.div
      variants={ringVariants}
      className="pointer-events-none absolute inset-0 rounded-xl border-2 border-primary"
    />
  </motion.div>
);

// A single info card.
// `flex-1` here is what makes the 4 cards share the left column's
// height EQUALLY, instead of each card just being as tall as its text.
const InfoCard = ({ icon: Icon, title, subtitle, value, href }) => {
  const cardContent = (
    <div className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </span>
      <div>
        <p className="font-semibold text-base-content">{title}</p>
        <p className="text-sm text-base-content/60">{subtitle}</p>
        <p className="mt-1 text-sm font-semibold text-base-content">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex-1">
      <HoverGlowBox className="flex h-full items-center rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm">
        {href ? <a href={href}>{cardContent}</a> : cardContent}
      </HoverGlowBox>
    </div>
  );
};

const Contact = () => {
  // -----------------------------------------------------------------
  // FORM STATE — the React-recommended way to handle multiple inputs
  // -----------------------------------------------------------------
  // Instead of one useState per field, we keep ONE object that holds
  // every field's value. Each input's `name` attribute must match a
  // key in this object.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  console.log("contact form", formData);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Runs on every keystroke in any input/textarea.
  // e.target.name  -> which field triggered the change (e.g. "email")
  // e.target.value -> the new value the user typed
  //
  // We use the "computed property name" syntax [e.target.name]: value
  // so ONE function can update ANY field, instead of writing a
  // separate handler for name, email, mobile, message, etc.
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData, // keep all the other fields as they are
      [name]: value, // overwrite just the one field that changed
    }));
  }

  // Runs when the form is submitted.
  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page

    setIsSending(true);

    try {
      await axiosInstance.post("/contacts", formData);

      toast.success("Message sent successfully!");
      setIsSent(true);
      setFormData({ name: "", email: "", mobile: "", message: "" }); // reset form
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Something went wrong sending the form:", error);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-10 max-w-2xl text-center"
      >
        <Heading
          title="Contact Us"
          description="Ready to start your next project? Our team is here to help you succeed. Reach out and let's discuss how we can bring your ideas to life."
        />
      </motion.div>

      {/* items-stretch makes both grid columns equal height (this is
          actually the grid default, but writing it explicitly makes
          the intent obvious to anyone reading the code later). */}
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        {/* Left column: info cards.
            h-full + flex-col means this column stretches to match the
            grid row's height, and its 4 children (each wrapped in
            flex-1 above) share that height equally. On small screens
            h-full has no effect since the grid row just wraps to
            content — so mobile still looks like a normal stacked list. */}
        <div className="flex h-full flex-col gap-4">
          {infoCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>

        {/* Right column: the form, wrapped in the same hover-glow box.
            h-full here matches the left column's stretched height. */}
        <HoverGlowBox className="flex h-full flex-col rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
          <AnimatePresence mode="wait">
            {isSent ? (
              // Success message shown after submitting.
              // flex-1 + centered content so it fills the same space
              // the form was using, instead of collapsing to a small box.
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col items-center justify-center gap-3 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 size={28} />
                </span>
                <h4 className="text-lg font-semibold text-base-content">
                  Message sent
                </h4>
                <p className="text-sm text-base-content/60">
                  Thanks for reaching out — we'll reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="btn btn-link btn-sm text-primary"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              // The actual form.
              // flex-1 + flex-col so the fieldset can grow and push the
              // submit button toward the bottom, matching the left
              // column's bottom edge.
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col"
              >
                <fieldset className="fieldset flex flex-1 flex-col">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input w-full"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input w-full"
                    placeholder="john@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <label className="label">Mobile / Whatsapp</label>
                  <input
                    type="text"
                    name="mobile"
                    className="input w-full"
                    placeholder="Please enter number with country code"
                    value={formData.mobile}
                    onChange={handleChange}
                  />

                  <label className="label">Message</label>
                  {/* flex-1 on the textarea lets it stretch to fill any
                      leftover space, so the button below still lands
                      near the bottom instead of floating mid-box. */}
                  <textarea
                    name="message"
                    className="textarea w-full flex-1"
                    placeholder="Do you have any inquiries regarding our IT services?"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSending}
                    className="btn btn-neutral mt-4"
                  >
                    {isSending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Book Free Consultation"
                    )}
                  </motion.button>
                </fieldset>
              </motion.form>
            )}
          </AnimatePresence>
        </HoverGlowBox>
      </div>
    </div>
  );
};

export default Contact;