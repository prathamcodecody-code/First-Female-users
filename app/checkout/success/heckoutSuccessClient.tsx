"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessClient() {
  const params = useSearchParams();
  const type = params.get("type"); // COD | ONLINE
  const orderId = params.get("orderId");

  const isCOD = type === "COD";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto text-green-500" size={72} />

        <h1 className="text-2xl font-bold mt-4">
          {isCOD ? "Order Placed Successfully 🎉" : "Payment Successful 🎉"}
        </h1>

        <p className="text-gray-600 mt-2">
          {isCOD
            ? "Your order has been placed successfully. Please pay at the time of delivery."
            : "Your payment has been received and your order is now confirmed."}
        </p>

        {orderId && (
          <p className="mt-2 text-sm text-gray-500">
            Order ID:{" "}
            <span className="font-semibold text-brandPink">
              #{orderId}
            </span>
          </p>
        )}

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
