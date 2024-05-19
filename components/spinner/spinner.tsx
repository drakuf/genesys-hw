import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import SpinnerImg from "@/public/images/spinner.png";

const pingVariants = {
  initial: {
    scale: 0.9,
    opacity: 1,
  },
  animate: {
    scale: 1.1,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

const Spinner = () => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div
      aria-label="spinner"
      className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-svh w-full items-center justify-center overflow-x-hidden overflow-y-hidden bg-[#97ce4c]"
    >
      <motion.div initial="initial" animate="animate" variants={pingVariants}>
        <Image src={SpinnerImg} alt="Rick and Morty spinner" />
      </motion.div>
    </div>
  );
};

export default Spinner;
