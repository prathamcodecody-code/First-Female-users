"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import AuthModal from "../auth/AuthModal";
import { useRouter } from "next/navigation";
import CartItemCard from "@/components/cart/CartItemCard";
import { FiShoppingBag, FiLock, FiArrowLeft } from "react-icons/fi";

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiShoppingBag className="text-gray-200 w-16 h-16 mb-6" />
        <h2 className="text-3xl font-serif italic text-brandBlack mb-2">Your bag is empty.</h2>
        <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-8 text-center">
          Sign in to see the looks you&apos;ve saved
        </p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-brandBlack text-white px-12 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-brandPink transition-all active:scale-95"
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
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-20 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-sm" />
          ))}
        </div>
        <div className="lg:col-span-4 h-64 bg-gray-50 animate-pulse rounded-sm" />
      </div>
    );
  }

  /* ---------------- EMPTY CART ---------------- */
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-brandBlack mb-4">
          Bag is empty
        </h2>
        <p className="text-gray-500 text-sm mb-8 font-medium">Ready to fill it with something iconic?</p>
        <Link
          href="/"
          className="bg-brandBlack text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-brandPink transition-all"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  /* ---------------- TOTALS ---------------- */
  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 md:py-20">
        
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
            Shopping Bag
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Ready to haul
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* LEFT: CART ITEMS */}
          <div className="lg:col-span-8 space-y-6">
            <div className="divide-y divide-gray-100 bg-white border border-gray-100 rounded-sm overflow-hidden">
              {items.map((item) => (
                <div key={item.id} className="p-4 md:p-8">
                  <CartItemCard
                    item={item}
                    onIncrease={() => updateQty(item.id, item.quantity + 1)}
                    onDecrease={() => updateQty(item.id, item.quantity - 1)}
                    onRemove={() => removeItem(item.id)}
                  />
                </div>
              ))}
            </div>
            
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brandBlack transition-colors"
            >
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>

          {/* RIGHT: ORDER SUMMARY STICKY */}
          <aside className="lg:col-span-4 h-fit lg:sticky lg:top-24">
            <div className="bg-white border border-brandPink/10 p-8 rounded-sm shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50 pb-4 mb-8">
                Order Summary
              </h3>

              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-gray-400">Items Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-emerald-600 font-black text-[10px] tracking-widest">CALCULATED AT NEXT STEP</span>
                </div>
                <div className="flex justify-between text-xl pt-8 border-t border-gray-50">
                  <span className="font-black uppercase tracking-tighter">Subtotal</span>
                  <span className="font-black text-brandPink">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/checkout/address")}
                className="w-full bg-brandBlack text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl hover:bg-brandPink transition-all active:scale-95"
              >
                Checkout Securely
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300">
                 <FiLock size={12} /> SSL Encrypted Checkout
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
