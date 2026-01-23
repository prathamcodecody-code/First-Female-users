"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaStar, FaHeart, FaBolt, FaFire } from "react-icons/fa";

export default function MainCharacterSection() {
  return (
    <section className="relative w-full bg-[#FCFAFA] py-16 md:py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative">

        {/* Floating Badge LEFT - Adjusted for mobile position */}
        <motion.div
          initial={{ rotate: -12, x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-6 left-0 md:left-20 bg-brandPink text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-bold text-[10px] md:text-sm shadow-lg flex items-center gap-2 z-20"
        >
          <FaStar className="text-white" />
          MAIN CHARACTER
        </motion.div>

        {/* Floating Icon RIGHT - Reduced size for mobile */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -top-16 -right-10 md:right-20 text-[100px] md:text-[140px] text-brandPink pointer-events-none z-0"
        >
          <FaHeart />
        </motion.div>

        {/* MAIN HEADING - Added flex-wrap for mobile alignment */}
        <h1 className="text-4xl md:text-8xl font-serif text-brandBlack leading-[1.1] tracking-tight relative z-10">
          FIRST FEMALE <br />
          <span className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-2">
            brings
            <motion.span
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="text-brandPink inline-block"
            >
              <FaFire />
            </motion.span>
            main-character
          </span>
          <span className="italic font-light block mt-2">
            confidence.
          </span>
        </h1>

        {/* Floating Badge RIGHT - Lowered z-index and adjusted mobile position */}
        <motion.div
          initial={{ rotate: 12, x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute -bottom-10 right-0 md:right-20 bg-[#FDECC8] text-[#8B6E32] px-4 py-2 md:px-8 md:py-3 rounded-sm font-bold text-[10px] md:text-sm tracking-widest shadow-sm flex items-center gap-2 z-20"
        >
          <FaBolt />
          BOLD ENERGY
        </motion.div>

        {/* SUBTEXT + CTA */}
        <div className="mt-14 space-y-6 md:space-y-8 relative z-10">
          <p className="text-gray-500 text-base md:text-xl max-w-xl mx-auto leading-relaxed px-4">
            Style that speaks first. Confidence that stays. <br className="hidden md:block" />
            Designed for women who don’t wait to be noticed.
          </p>

          <Link href="/all-products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-brandBlack text-white px-8 md:px-12 py-3 md:py-4 rounded-md font-bold uppercase tracking-widest text-[12px] md:text-sm shadow-xl hover:bg-brandPink transition-colors"
            >
              Shop the Moment
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}