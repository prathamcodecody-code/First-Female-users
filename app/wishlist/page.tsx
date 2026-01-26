"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import AuthModal from "../auth/AuthModal";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { FiTrash2, FiHeart } from "react-icons/fi";

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  /* -------- LOAD -------- */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    api
      .get("/wishlist")
      .then((res) => setItems(res.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  /* -------- REMOVE -------- */
  const removeItem = async (item: any) => {
    try {
      await api.post("/wishlist/toggle", {
        productId: item.productId,
        sizeId: item.sizeId ?? undefined,
      });

      setItems((prev) =>
        prev.filter(
          (i) =>
            !(
              i.productId === item.productId &&
              (i.sizeId ?? null) === (item.sizeId ?? null)
            )
        )
      );
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <FiHeart className="text-gray-200 w-16 h-16 mb-6" />
        <h2 className="text-3xl font-serif italic text-brandBlack mb-2">Save your faves.</h2>
        <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-8 text-center">
          Please sign in to view your saved items
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

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
           <FiHeart className="text-gray-300 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold uppercase tracking-tighter text-brandBlack mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500 text-sm mb-8">Start adding the looks you love!</p>
        <Link
          href="/"
          className="bg-brandBlack text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-brandPink transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brandBlack">Saved Looks</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
          {items.length} {items.length === 1 ? 'Item' : 'Items'} Ready to slay
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
        {items.map((item) => {
          const productUrl = `/products/${item.product.slug}-${item.productId}`;
          const originalPrice = Number(item.product.price);

const currentPrice = Number(
  item.size?.finalPrice ??
  item.product.finalPrice ??
  item.product.price
);

const hasDiscount = currentPrice < originalPrice;
const discountPercent = hasDiscount
  ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  : 0;
          return (
            <div key={item.id} className="group relative bg-white flex flex-col">
              {/* IMAGE BOX */}
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9] rounded-sm">
                <Link href={productUrl}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.img1}`}
                    alt={item.product.title}
                    className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110 cursor-pointer"
                  />
                </Link>
                
                <button
                  onClick={() => removeItem(item)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm z-10"
                  title="Remove from wishlist"
                >
                  <FiTrash2 size={16} />
                </button>

                {item.product.rating && (
                  <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm font-bold">
                    <span>{item.product.rating}</span>
                    <span className="text-yellow-500 text-xs">★</span>
                  </div>
                )}
              </div>

              {/* INFO SECTION */}
              <div className="mt-3 space-y-1 px-1 flex-1">
                {/* Brand Label */}
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  {item.product.brand || "New Arrival"}
                </p>

                {/* Title */}
                <Link href={productUrl}>
                  <h3 className="text-[13px] font-medium text-gray-800 leading-tight group-hover:text-brandPink transition-colors line-clamp-1 cursor-pointer">
                    {item.product.title}
                  </h3>
                </Link>

                {/* Price Section */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      ₹{currentPrice.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        Save {discountPercent}%
                      </span>
                    )}
                  </div>
                  {item.size && (
                    <span className="text-[9px] font-bold text-gray-400 uppercase border border-gray-100 px-1.5 py-0.5 rounded-sm">
                      Size: {item.size.size}
                    </span>
                  )}
                </div>

                {/* Signature Highlight */}
                {hasDiscount && (
                  <div className="inline-block bg-[#FDEFF4] px-2 py-1 mt-1 rounded-sm border border-[#FADDE9]">
                    <p className="text-[9px] font-extrabold text-brandPink uppercase tracking-tighter">
                      Best Price: ₹{currentPrice.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* Action Area */}
                <div className="pt-3">
                  <AddToCartButton
                    productId={item.productId}
                    sizeId={item.sizeId ?? undefined}
                    stock={item.size?.stock ?? item.product.stock}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
