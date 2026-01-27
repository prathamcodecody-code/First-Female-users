"use client";

import Link from "next/link";
import { FiCheckCircle, FiPackage, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const type = params.get("type"); // COD | ONLINE
  const orderId = params.get("orderId");

  const isCOD = type === "COD";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#FCFAFA]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full bg-white border border-gray-100 p-10 md:p-12 text-center rounded-sm shadow-sm"
      >
        {/* SUCCESS ICON ANIMATION */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="mx-auto w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-8"
        >
          <FiCheckCircle className="text-emerald-500" size={40} />
        </motion.div>

        <header className="mb-6">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif leading-tight">
            {isCOD ? "Order Placed. \n It's Official!" : "Payment Received. \n It's Yours!"}
          </h1>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-4 leading-relaxed px-4">
            {isCOD
              ? "Your haul is being prepared. Keep your cash ready for delivery!"
              : "Your payment was a success. We're getting your look ready to ship."}
          </p>
        </header>

        {orderId && (
          <div className="bg-brandCream/50 inline-block px-6 py-2 rounded-full border border-brandPink/10 mb-10">
            <p className="text-[10px] font-black uppercase tracking-widest text-brandBlack">
              Order Ref: <span className="text-brandPink">#{orderId}</span>
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/orders"
            className="group flex items-center justify-center gap-3 w-full bg-brandBlack text-white py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] hover:bg-brandPink transition-all shadow-lg active:scale-95"
          >
            <FiPackage size={14} /> Track My Haul
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-3 w-full border border-gray-100 py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-brandBlack hover:border-gray-300 transition-all"
          >
            <FiShoppingBag size={14} /> Back to Shop
          </Link>
        </div>

        {/* GEN-Z SUBTLE FOOTER */}
        <footer className="mt-12 pt-8 border-t border-gray-50">
           <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">
             Tag us in your fits @Avnzalite #MainCharacterEnergy
           </p>
        </footer>
      </motion.div>
    </div>
  );
}
