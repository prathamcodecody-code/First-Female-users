"use client";

import { api } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import AuthModal from "@/app/auth/AuthModal";
import Toast from "@/components/ui/toast";
import ButtonLoader from "@/components/ui/ButtonLoader";
import { FiShoppingBag } from "react-icons/fi"; // Added icon for mobile visual cue

interface AddToCartButtonProps {
  productId: number;
  stock: number;
  sizeId?: number;
  disabled?: boolean;
}

export default function AddToCartButton({
  productId,
  stock,
  sizeId,
  disabled = false,
}: AddToCartButtonProps) {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (stock < 1) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!sizeId) {
      setToast({
        type: "error",
        message: "Please select a size first",
      });
      return;
    }

    try {
      setLoading(true);
      await api.post("/cart/add", {
        productId,
        sizeId,
      });

      setToast({
        type: "success",
        message: "Added to cart!",
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to add to cart";
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled || loading || stock < 1}
        className={`
          w-full flex items-center justify-center gap-2
          /* Mobile: Slightly smaller padding/text, Desktop: Bold and spacious */
          px-4 py-3 md:px-6 md:py-4 
          rounded-sm font-bold uppercase 
          text-[10px] md:text-xs tracking-[0.2em]
          transition-all duration-300
          ${
            stock < 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-brandBlack text-white hover:bg-brandPink shadow-sm active:scale-95"
          }
        `}
      >
        {loading ? (
          <ButtonLoader />
        ) : (
          <>
            {/* Icon is great for mobile users to quickly identify the action */}
            {stock >= 1 && <FiShoppingBag className="text-sm md:text-base" />}
            <span>{stock < 1 ? "Sold Out" : "Add to Cart"}</span>
          </>
        )}
      </button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
