"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloating() {
  return (
    <a
      href="https://wa.me/919654764464"
      target="_blank"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14
        bg-green-500
        rounded-full
        flex items-center justify-center
        text-white text-2xl
        shadow-lg
        hover:scale-105
        transition
      "
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}
