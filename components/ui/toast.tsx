"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: "success" | "error"; // Add this line!
}

export default function Toast({ message, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2000); // auto-hide in 2 sec
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="
        fixed top-5 right-5 bg-black text-white px-4 py-2 
        rounded-lg shadow-lg text-sm z-50 animate-slide
      "
    >
      {message}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
