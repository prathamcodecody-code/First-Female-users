"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import AuthModal from "../auth/AuthModal";
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/cart/CartItemCard";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  /* ---------------- LOAD CART ---------------- */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api
      .get("/cart")
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  /* ---------------- REMOVE ITEM ---------------- */
  const removeItem = async (id: number) => {
    setUpdatingId(id);
    await api.delete(`/cart/${id}`);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setUpdatingId(null);
  };

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQty = async (id: number, qty: number) => {
    if (qty < 1) return;

    setUpdatingId(id);
    await api.put(`/cart/${id}`, { quantity: qty });

    // ✅ SAFE UPDATE
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: qty } : i
      )
    );

    setUpdatingId(null);
  };

  /* ---------------- AUTH REQUIRED ---------------- */
  if (!user && !loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Please sign in to view your cart
        </h2>

        <button
          onClick={() => setShowAuth(true)}
          className="mt-4 bg-brandPink text-white px-8 py-3 rounded-lg"
        >
          Sign In
        </button>

        <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  /* ---------------- LOADER ---------------- */
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>

        <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
      </div>
    );
  }

  /* ---------------- EMPTY CART ---------------- */
  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-semibold mb-2">
          Your Cart is Empty
        </h2>
        <Link
          href="/"
          className="inline-block mt-4 bg-brandPink text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ---------------- TOTAL ---------------- */
  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT ITEMS */}
        {/* LEFT ITEMS */}
<div className="md:col-span-2 space-y-5">
  {items.map((item) => (
    <CartItemCard
      key={item.id}
      item={item}
      onIncrease={() =>
        updateQty(item.id, item.quantity + 1)
      }
      onDecrease={() =>
        updateQty(item.id, item.quantity - 1)
      }
      onRemove={() => removeItem(item.id)}
    />
  ))}
</div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white p-6 rounded-xl shadow sticky top-24 h-fit">
          <h3 className="text-xl font-semibold mb-4">
            Price Details
          </h3>

          <div className="flex justify-between mb-2">
            <span>Total Items</span>
            <span>{items.length}</span>
          </div>

          <div className="flex justify-between font-bold mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => router.push("/checkout/address")}
            className="w-full bg-brandPink text-white py-3 rounded-lg font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
