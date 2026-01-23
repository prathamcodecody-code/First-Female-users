"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AnimatedLogo() {
  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{
    opacity: 1,
    y: [0, -1.5, 0],
  }}
      transition={{
    y: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}
      whileHover={{
        scale: 1.04,
        filter: "drop-shadow(0 0 6px rgba(236,72,153,0.25))",
      }}
      className="select-none"
    >
      <Image
        src="/first-female-logo.svg"
        alt="First Female"
        width={170}
        height={50}
        priority
        className="object-contain"
      />
    </motion.div>
  );
}
