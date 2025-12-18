"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        
        <CheckCircle className="mx-auto text-green-500" size={72} />

        <h1 className="text-2xl font-bold mt-4">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you for your order. Your payment has been received and your order
          is now confirmed.
        </p>

        <div className="mt-6 space-y-3">
          <Link
            href="/orders"
            className="block w-full bg-brandPink text-white py-3 rounded-lg font-semibold hover:bg-brandPinkLight transition"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="block w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
