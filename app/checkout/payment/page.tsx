"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useState } from "react";
// ✅ IMPORT ADDED BELOW
import { motion } from "framer-motion"; 
import { FiArrowLeft } from "react-icons/fi";

export default function CheckoutPaymentPage() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod } = useCheckout();
  const [error, setError] = useState("");

  const continueToReview = () => {
    if (!paymentMethod) {
      setError("Please select a payment method to continue");
      return;
    }
    setError("");
    router.push("/checkout/review");
  };

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        
        {/* PROGRESS STEPPER */}
        <header className="mb-16 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full border border-brandPink text-brandPink flex items-center justify-center text-[10px] font-black">1</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Shipping</span>
          </div>
          <div className="h-[1px] w-12 bg-brandPink" />
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-brandPink text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-brandPink/20">2</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-brandBlack">Payment</span>
          </div>
          <div className="h-[1px] w-12 bg-gray-200" />
          <div className="flex items-center gap-2 opacity-30">
             <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-black">3</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Review</span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => router.push("/checkout/address")} 
            className="mb-6 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brandPink transition-colors"
          >
            <FiArrowLeft /> Edit Shipping
          </button>

          <header className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
              Payment Method
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Secure your order</p>
          </header>

          <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-sm shadow-sm transition-all space-y-6">
            
            <PaymentCard 
              id="RAZORPAY" 
              label="Online Payment" 
              sub="UPI / Cards / Net Banking" 
              selected={paymentMethod === "RAZORPAY"} 
              onClick={() => setPaymentMethod("RAZORPAY")} 
            />

            <PaymentCard 
              id="COD" 
              label="Cash on Delivery" 
              sub="Pay when your order is delivered" 
              selected={paymentMethod === "COD"} 
              onClick={() => setPaymentMethod("COD")} 
            />

            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-8 bg-red-50 p-3 text-center border border-red-100 font-sans">
                {error}
              </p>
            )}

            <button
              onClick={continueToReview}
              className="mt-12 w-full bg-brandBlack text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl hover:bg-brandPink transition-all active:scale-[0.98]"
            >
              Continue to Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PAYMENT CARD COMPONENT ---------------- */

function PaymentCard({ label, sub, selected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`relative p-6 border-2 cursor-pointer flex items-center justify-between transition-all duration-300 rounded-sm ${
        selected 
          ? "border-brandPink bg-brandPink/5" 
          : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
      }`}
    >
      <div className="space-y-1">
        <p className={`text-[13px] font-black uppercase tracking-widest ${selected ? "text-brandPink" : "text-brandBlack"}`}>
          {label}
        </p>
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-tight">
          {sub}
        </p>
      </div>
      
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? "border-brandPink" : "border-gray-200"
      }`}>
        {selected && (
          // ✅ THIS PART WORKS NOW BECAUSE MOTION IS IMPORTED
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-2.5 h-2.5 bg-brandPink rounded-full shadow-sm" 
          />
        )}
      </div>
    </div>
  );
}
