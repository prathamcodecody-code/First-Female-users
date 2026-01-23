"use client";

import Link from "next/link";
import Image from "next/image";
import AddToWishlistButton from "@/components/wishlist/AddToWishlistButton";

type Product = {
  id: number;
  slug?: string;
  title: string;
  brand?: string;
  price: number | string;
  discountType?: "PERCENT" | "FLAT" | null;
  discountValue?: number | null;
  rating?: number;
  reviewCount?: number;
  img1?: string | null;
  stock?: number;
};

export default function ProductCard({ product }: { product?: Product }) {
  if (!product) return null;

  const imageUrl = product.img1
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.img1}`
    : "/placeholder.png";

  const productUrl = `/products/${product.slug}-${product.id}`;
  const price = Number(product.price) || 0;

  // ---------- DISCOUNT LOGIC ----------
  let finalPrice = price;
  let discountText: string | null = null;

  if (product.discountType === "PERCENT" && product.discountValue) {
    finalPrice = Math.round(price - (price * product.discountValue) / 100);
    discountText = `${product.discountValue}% OFF`;
  }

  if (product.discountType === "FLAT" && product.discountValue) {
    finalPrice = Math.max(0, price - product.discountValue);
    discountText = `₹${product.discountValue} OFF`;
  }

  const hasDiscount = finalPrice < price;
  // -----------------------------------

  return (
    <div className="group relative bg-white transition-all duration-300 border-none">
      {/* ❤️ Wishlist - Positioned for a clean look */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AddToWishlistButton productId={product.id} />
      </div>

      <Link href={productUrl} className="block">
        {/* IMAGE CONTAINER - 3:4 Aspect Ratio, fits images without cropping */}
        <div className="relative w-full aspect-[3/4] bg-[#F9F9F9] overflow-hidden rounded-sm">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Subtle Discount Badge */}
          {hasDiscount && (
            <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-1 font-bold uppercase tracking-wider text-red-600 shadow-sm">
              {discountText}
            </span>
          )}

          {/* RATING OVERLAY */}
          {product.rating && (
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px] px-1.5 py-0.5 rounded-sm flex items-center gap-1 shadow-sm font-bold">
              <span>{product.rating}</span>
              <span className="text-yellow-500 text-xs">★</span>
            </div>
          )}
        </div>

        {/* INFO SECTION */}
        <div className="mt-3 space-y-1 px-1">
          {/* Brand/Category (Optional logic) */}
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            {product.brand || "New Arrival"}
          </p>

          {/* TITLE - Clean and concise */}
          <h3 className="text-[13px] font-medium text-gray-800 leading-tight group-hover:text-brandPink transition-colors line-clamp-1">
            {product.title}
          </h3>

          {/* PRICE SECTION */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-bold text-gray-900">
              ₹{finalPrice.toLocaleString()}
            </span>

            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ₹{price.toLocaleString()}
              </span>
            )}
          </div>

          {/* SIGNATURE "BEST PRICE" HIGHLIGHT */}
          {hasDiscount && (
             <div className="inline-block bg-[#FDEFF4] px-2 py-1 mt-1 rounded-sm border border-[#FADDE9]">
                <p className="text-[9px] font-extrabold text-brandPink uppercase tracking-tighter">
                   Best Price: ₹{finalPrice.toLocaleString()}
                </p>
             </div>
          )}
        </div>
      </Link>
    </div>
  );
}
