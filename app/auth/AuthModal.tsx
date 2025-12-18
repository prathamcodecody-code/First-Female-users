"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

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

    // Save token
    loginWithToken(res.data.token);

    // 🔴 ADD THIS LINE (CRITICAL)
    window.dispatchEvent(new Event("auth-changed"));

    onClose();
  } finally {
    setLoading(false);
  }
};


  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-8 w-[380px] rounded-xl shadow-lg relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* PHONE STEP */}
        {step === "phone" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Login / Sign Up
            </h2>

            <input
              type="text"
              placeholder="Enter Mobile Number"
              className="w-full border p-3 rounded mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="bg-brandPink text-white w-full py-3 rounded-lg font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Enter OTP
            </h2>

            <input
              type="text"
              placeholder="6-digit OTP"
              className="w-full border p-3 rounded mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="bg-brandPink text-white w-full py-3 rounded-lg font-semibold"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
