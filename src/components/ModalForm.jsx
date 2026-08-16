import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import axiosInstance from "../api/api";

// ===================================================================
// ANIMATION SETTINGS
// These control how the form fields "fade in" one after another.
// You don't need to touch these unless you want to change the timing.
// ===================================================================

// This tells the form: "wait 0.1s, then reveal each child field
// one by one, 0.06s apart" — that's what creates the staggered effect.
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// This tells each individual field HOW to animate in:
// start invisible and slightly lower (y: 10), end fully visible at y: 0.
const fieldFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Every text input/textarea shares this same styling, so instead of
// typing the same long string 4 times, we save it once here.
const inputStyles = `
  input w-full rounded-lg border-base-300
  bg-base-100 text-sm
  focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
`;

// ===================================================================
// THE COMPONENT
// ===================================================================

const ModalForm = ({ serviceTitle, onClose }) => {
  // ---- 1. STATE ----------------------------------------------------
  // We keep every field's text in one object. This is the same
  // approach the Contact page uses — one state object, one updater.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  // ---- 2. HANDLE TYPING ---------------------------------------------
  // This one function runs every time ANY input changes.
  // It looks at which input fired the event (e.target.name) and
  // updates just that field in formData, leaving the rest untouched.
  function handleChange(event) {
    const fieldName = event.target.name; // e.g. "name", "email", ...
    const newValue = event.target.value; // whatever the user typed

    setFormData((previousFormData) => {
      return {
        ...previousFormData, // keep all the other fields as they were
        [fieldName]: newValue, // overwrite just the one that changed
      };
    });
  }

  // ---- 3. HANDLE SUBMIT ----------------------------------------------
  // Runs when the form is submitted (button click or pressing Enter).
  async function handleSubmit(event) {
    event.preventDefault(); // stops the page from doing a full reload

    console.log("Current Form Data Object:", formData);

    try {
      // Send the form data to your backend. Change the URL below to
      // whatever endpoint actually handles consultation requests.
      await axiosInstance.post("/services", {
        service: serviceTitle,
        ...formData,
      });

      // Let the user know it worked, clear the form, and close the modal
      toast.success("Request submitted successfully!");
      setFormData({ name: "", email: "", mobile: "", message: "" });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      // Let the user know it failed instead of failing silently
      toast.error("Something went wrong. Please try again.");
      console.error("Something went wrong sending the form:", error);
    }
  }
  console.log(import.meta.env.VITE_API_URL);
  console.log("modal form", formData);
  // ---- 4. WHAT TO SHOW -------------------------------------------------
  return (
    <div className="p-6 sm:p-8">
      <motion.form
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {/* Title */}
        <motion.div variants={fieldFadeIn} className="mb-2 space-y-1">
          {serviceTitle && (
            <p className="text-lg text-base-content/60 text-center">
              Service : <span className="font-medium">{serviceTitle}</span>
            </p>
          )}
        </motion.div>
        {/* Name field */}
        <motion.div variants={fieldFadeIn}>
          <label className="label text-sm font-medium text-base-content">
            Name
          </label>
          <input
            type="text"
            name="name"
            className={inputStyles}
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </motion.div>
        {/* Email field */}
        <motion.div variants={fieldFadeIn}>
          <label className="label text-sm font-medium text-base-content">
            Email
          </label>
          <input
            type="email"
            name="email"
            className={inputStyles}
            placeholder="john@mail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </motion.div>
        {/* Mobile field (optional) */}
        <motion.div variants={fieldFadeIn}>
          <label className="label text-sm font-medium text-base-content">
            Mobile / Whatsapp
          </label>
          <input
            type="text"
            name="mobile"
            className={inputStyles}
            placeholder="Please enter number with country code"
            value={formData.mobile}
            onChange={handleChange}
          />
        </motion.div>
        {/* Message field */}
        <motion.div variants={fieldFadeIn}>
          <label className="label text-sm font-medium text-base-content">
            Message
          </label>
          <textarea
            name="message"
            className={`${inputStyles} textarea h-24 resize-none`}
            placeholder="Do you have any inquiries regarding our IT services?"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </motion.div>

        {/* Submit button */}
        <motion.button
          variants={fieldFadeIn}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          type="submit"
          className="btn btn-neutral mt-2 w-full rounded-lg"
        >
          Book Free Consultation
        </motion.button>
      </motion.form>
    </div>
  );
};

export default ModalForm;