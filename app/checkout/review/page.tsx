"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/context/CheckoutContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { address, paymentMethod } = useCheckout();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) router.push("/checkout/address");
    if (!paymentMethod) router.push("/checkout/payment");
  }, []);

  useEffect(() => {
    api.get("/cart").then((res) => {
      setCartItems(res.data.items || []);
    });
  }, []);

const totalAmount = cartItems.reduce(
  (sum, item) => sum + Number(item.price) * item.quantity,
  0
);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError("");

      // ================= COD =================
      if (paymentMethod === "COD") {
        const res = await api.post("/orders", { address });
        router.push(`/checkout/success?orderId=${res.data.orderId}&type=${paymentMethod}`);
        return;
      }

      // ================= RAZORPAY =================
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Failed to load Razorpay");
        return;
      }

      // 1️⃣ Create order (PENDING)
      const orderRes = await api.post("/orders", { address });
      const orderId = orderRes.data.orderId;

      // 2️⃣ Create Razorpay order
      const rpRes = await api.post(
        "/payments/razorpay/create-order",
        { orderId }
      );

      const options = {
        key: rpRes.data.key,
        amount: rpRes.data.amount * 100,
        currency: "INR",
        name: "FirstFemale",
        order_id: rpRes.data.razorpayOrderId,
        handler: async (response: any) => {
          await api.post("/payments/razorpay/verify", response);
          router.push(`/checkout/success?orderId=${orderId}&type=${paymentMethod}`);
        },
        theme: { color: "#ec4899" },
      };

      new (window as any).Razorpay(options).open();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!address || !paymentMethod) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Review Your Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">Delivery Address</h2>
            <p>{address.name}</p>
            <p>{address.street}</p>
            <p>
              {address.city}, {address.state} - {address.pincode}
            </p>
            <p>Phone: {address.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
            <p>{paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
          </div>

<div className="bg-white p-6 rounded-xl shadow">
  <h2 className="text-lg font-semibold mb-4">Items</h2>

  {cartItems.map((item) => {
    const unitPrice = Number(item.price);

    return (
      <div
        key={item.id}
        className="flex justify-between border-b py-3"
      >
        <div>
          <p className="font-medium">
            {item.product.title}
          </p>

          {item.size && (
            <p className="text-sm text-gray-500">
              Size: {item.size.size}
            </p>
          )}

          <p className="text-sm text-gray-500">
            Qty: {item.quantity}
          </p>
        </div>

        <p className="font-semibold">
          ₹{unitPrice * item.quantity}
        </p>
      </div>
    );
  })}
</div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">
          <h2 className="text-lg font-semibold mb-4">Price Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={placeOrder}
            disabled={loading}
            className="mt-6 w-full bg-brandPink text-white py-3 rounded-xl font-semibold text-lg hover:bg-brandPinkLight"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
