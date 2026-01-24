"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { FiX, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
  const { loginWithToken } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone) return;
    try {
      setLoading(true);
      await api.post("/auth/send-otp", { phone });
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", { phone, otp });
      
      // 1. Save the token
      loginWithToken(res.data.token);
      
      // 2. Dispatch event for existing listeners
      window.dispatchEvent(new Event("auth-changed"));
      
      // 3. Close the modal
      onClose();

      // 4. 🔥 Force window refresh to sync all states
      window.location.reload();
      
    } catch (error) {
       console.error("Verification failed", error);
       // You could add a toast here for "Invalid OTP"
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-[420px] overflow-hidden rounded-sm shadow-2xl flex flex-col"
          >
            <div className="h-2 bg-brandPink w-full" />

            <button
              onClick={onClose}
              className="absolute right-4 top-6 text-gray-400 hover:text-brandBlack transition-colors z-10"
            >
              <FiX size={24} />
            </button>

            <div className="p-8 md:p-10">
              {step === "otp" && (
                <button 
                  onClick={() => setStep("phone")}
                  className="mb-6 flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brandPink uppercase tracking-widest transition-colors"
                >
                  <FiArrowLeft /> Back
                </button>
              )}

              <header className="mb-8">
                <h2 className="text-3xl font-serif font-bold text-brandBlack leading-tight">
                  {step === "phone" ? "Join the Vibe." : "Check your Phone."}
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-medium">
                  {step === "phone" 
                    ? "Login or Sign Up to unlock your main character energy." 
                    : `We sent a code to +91 ${phone}`}
                </p>
              </header>

              <div className="space-y-6">
                {step === "phone" && (
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        className="w-full border-b-2 border-gray-100 p-4 pl-12 outline-none focus:border-brandPink transition-all text-lg font-medium tracking-wider"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                      />
                    </div>

                    <button
                      onClick={sendOtp}
                      disabled={loading || phone.length < 10}
                      className="w-full bg-brandBlack text-white py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-brandPink transition-all disabled:bg-gray-200 disabled:text-gray-400 active:scale-95"
                    >
                      {loading ? "Sending..." : "Get OTP"}
                    </button>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    initial={{ x: 10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="6-Digit Code"
                        className="w-full border-b-2 border-gray-100 p-4 pl-12 outline-none focus:border-brandPink transition-all text-center text-2xl font-bold tracking-[0.5em]"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                    </div>

                    <button
                      onClick={verifyOtp}
                      disabled={loading || otp.length < 6}
                      className="w-full bg-brandPink text-white py-4 rounded-sm font-bold uppercase tracking-[0.2em] text-xs shadow-lg hover:bg-brandBlack transition-all disabled:bg-gray-100 disabled:text-gray-400 active:scale-95"
                    >
                      {loading ? "Verifying..." : "Verify & Shop"}
                    </button>
                  </motion.div>
                )}
              </div>

              <footer className="mt-10 pt-6 border-t border-gray-50 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                  By continuing, you agree to First Female's <br />
                  <span className="text-gray-600 underline cursor-pointer">Terms of Service</span> & <span className="text-gray-600 underline cursor-pointer">Privacy Policy</span>.
                </p>
              </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
