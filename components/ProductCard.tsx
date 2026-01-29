"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  img2?: string | null;
  stock?: number;
};

export default function ProductCard({ product }: { product?: Product }) {
  const [currentImg, setCurrentImg] = useState(1);

  // ---------- AUTO-SWAP LOGIC ----------
  useEffect(() => {
    if (!product?.img2) return;

    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev === 1 ? 2 : 1));
    }, 3000); // Changes image every 3 seconds

    return () => clearInterval(interval);
  }, [product?.img2]);

  if (!product) return null;

  const baseImgUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/`;
  const img1 = product.img1 ? `${baseImgUrl}${product.img1}` : "/placeholder.png";
  const img2 = product.img2 ? `${baseImgUrl}${product.img2}` : null;

  const productUrl = `/products/${product.slug}-${product.id}`;
  const price = Number(product.price) || 0;

  // ---------- DISCOUNT LOGIC ----------
  let finalPrice = price;
  let discountText: string | null = null;

  if (product.discountType === "PERCENT" && product.discountValue) {
    finalPrice = Math.round(price - (price * product.discountValue) / 100);
    discountText = `${product.discountValue}% OFF`;
  } else if (product.discountType === "FLAT" && product.discountValue) {
    finalPrice = Math.max(0, price - product.discountValue);
    discountText = `₹${product.discountValue} OFF`;
  }

  const hasDiscount = finalPrice < price;

  return (
    <div className="group relative bg-white transition-all duration-300 border-none">
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AddToWishlistButton productId={product.id} />
      </div>

      <Link href={productUrl} className="block">
        <div className="relative w-full aspect-[3/4] bg-[#F9F9F9] overflow-hidden rounded-sm">
          
          {/* PRIMARY IMAGE */}
          <img
            src={img1}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-1000 ease-in-out 
              ${currentImg === 1 ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          />

          {/* SECONDARY IMAGE */}
          {img2 && (
            <img
              src={img2}
              alt={`${product.title} alternate view`}
              className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-1000 ease-in-out
                ${currentImg === 2 ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            />
          )}
          
          {/* Progress Indicators (Optional - shows which image is active) */}
          {img2 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              <div className={`h-1 w-4 rounded-full transition-all ${currentImg === 1 ? "bg-brandPink" : "bg-gray-200"}`} />
              <div className={`h-1 w-4 rounded-full transition-all ${currentImg === 2 ? "bg-brandPink" : "bg-gray-200"}`} />
            </div>
          )}

          {hasDiscount && (
            <span className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm text-[10px] px-2 py-1 font-black uppercase tracking-widest text-red-600 shadow-sm">
              {discountText}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-1 px-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            {product.brand || "New Arrival"}
          </p>

          <h3 className="text-[13px] font-medium text-gray-800 leading-tight group-hover:text-brandPink transition-colors line-clamp-1">
            {product.title}
          </h3>

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
        </div>
      </Link>
    </div>
  );
}
