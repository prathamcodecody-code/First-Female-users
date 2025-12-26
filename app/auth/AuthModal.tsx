"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AuthModal({ show, onClose }: AuthModalProps) {
  const { loginWithToken } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone || phone.length < 10) return;

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

      const res = await api.post("/auth/verify-otp", {
        phone,
        otp,
      });

      loginWithToken(res.data.token);

      // ✅ Proper refresh flow
      router.refresh(); // Next.js refresh
      window.location.reload(); // hard fallback

      onClose();
    } catch (err) {
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        {/* STEP 1: PHONE */}
        {step === "phone" && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Login / Sign Up
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter your mobile number to continue
            </p>

            <input
              type="tel"
              placeholder="Enter mobile number"
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-brandPink outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-brandPink text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Verify OTP
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Enter the 6-digit OTP sent to <b>{phone}</b>
            </p>

            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full border rounded-lg px-4 py-3 mb-4 tracking-widest text-center focus:ring-2 focus:ring-brandPink outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              disabled={loading || otp.length < 4}
              className="w-full bg-brandPink text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              onClick={() => setStep("phone")}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
            >
              Change phone number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
