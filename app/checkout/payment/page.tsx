"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useState } from "react";

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
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span>Address</span>
        <span>›</span>
        <span className="font-semibold text-brandPink">Payment</span>
        <span>›</span>
        <span>Review</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">Select Payment Method</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        {/* COD */}
        <div
          onClick={() => setPaymentMethod("COD")}
          className={`border rounded-lg p-4 cursor-pointer flex justify-between items-center transition ${
            paymentMethod === "COD"
              ? "border-brandPink bg-brandPink/10"
              : "hover:border-brandPink"
          }`}
        >
          <div>
            <p className="font-semibold">Cash on Delivery</p>
            <p className="text-sm text-gray-500">
              Pay when your order is delivered
            </p>
          </div>
          {paymentMethod === "COD" && (
            <span className="text-brandPink font-bold text-lg">✔</span>
          )}
        </div>

        {/* RAZORPAY */}
        <div
          onClick={() => setPaymentMethod("RAZORPAY")}
          className={`border rounded-lg p-4 cursor-pointer flex justify-between items-center transition ${
            paymentMethod === "RAZORPAY"
              ? "border-brandPink bg-brandPink/10"
              : "hover:border-brandPink"
          }`}
        >
          <div>
            <p className="font-semibold">Online Payment</p>
            <p className="text-sm text-gray-500">
              UPI / Cards / Net Banking
            </p>
          </div>
          {paymentMethod === "RAZORPAY" && (
            <span className="text-brandPink font-bold text-lg">✔</span>
          )}
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={continueToReview}
          className="mt-4 w-full bg-brandPink text-white py-3 rounded-lg font-semibold hover:bg-brandPinkLight transition"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
