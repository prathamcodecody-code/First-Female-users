"use client";

import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

type CartItem = {
  id: number;
  price: number; // This is the final discounted price
  quantity: number;
  product: {
    title: string;
    img1?: string | null;
    price: number; // This is the original base price/MRP
    discountType?: "PERCENT" | "FLAT" | null;
    discountValue?: number | null;
  };
  size?: {
    id: number;
    size: string;
  } | null;
};

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  // Logic: Original MRP vs Discounted Price
  const originalUnitPrice = Number(item.product.price);
  const discountedUnitPrice = Number(item.price);
  const totalDiscountedPrice = discountedUnitPrice * item.quantity;
  const totalOriginalPrice = originalUnitPrice * item.quantity;

  const hasDiscount = discountedUnitPrice < originalUnitPrice;
  const savings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-white transition-all">
      {/* 1. IMAGE BOX - Fixed aspect ratio to match fashion portraits */}
      <div className="relative w-full sm:w-32 aspect-[3/4] bg-[#F9F9F9] rounded-sm overflow-hidden flex-shrink-0 border border-gray-50">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.img1}`}
          alt={item.product.title}
          className="w-full h-full object-contain p-1" // object-contain prevents dress cropping
        />
      </div>

      {/* 2. DETAILS AREA */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-black text-xs md:text-sm uppercase tracking-tight text-brandBlack leading-tight">
                {item.product.title}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Sold by <span className="text-brandBlack">FirstFemale</span>
              </p>
            </div>
            
            {/* REMOVE BUTTON (TOP RIGHT) */}
            <button
              onClick={onRemove}
              className="text-gray-300 hover:text-red-500 transition-colors p-1"
              aria-label="Remove item"
            >
              <FiTrash2 size={16} />
            </button>
          </div>

          {/* SIZE SELECTOR DISPLAY */}
          <div className="flex items-center gap-3">
            {item.size && (
              <div className="bg-gray-50 px-3 py-1 rounded-sm border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-tighter">
                  Size: <span className="text-brandPink">{item.size.size}</span>
                </p>
              </div>
            )}
          </div>

          {/* QUANTITY CONTROLS */}
          <div className="flex items-center w-fit border border-gray-100 rounded-sm overflow-hidden">
            <button 
              onClick={onDecrease} 
              className="px-3 py-2 hover:bg-gray-50 transition-colors text-gray-400"
              disabled={item.quantity <= 1}
            >
              <FiMinus size={12} />
            </button>
            <span className="px-4 text-xs font-black min-w-[40px] text-center border-x border-gray-100">
              {item.quantity}
            </span>
            <button 
              onClick={onIncrease} 
              className="px-3 py-2 hover:bg-gray-50 transition-colors text-brandPink"
            >
              <FiPlus size={12} />
            </button>
          </div>
        </div>

        {/* 3. PRICE SECTION - Matches Product Page Aesthetic */}
        <div className="mt-6 sm:mt-0 pt-4 border-t border-gray-50 sm:border-none flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-black text-brandPink">
              ₹{totalDiscountedPrice.toLocaleString()}
            </span>
            
            {hasDiscount && (
              <span className="text-xs text-gray-300 line-through font-bold">
                ₹{totalOriginalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {hasDiscount && (
            <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">
              You saved ₹{savings.toLocaleString()}!
            </p>
          )}
          
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
             <span className="w-1 h-1 rounded-full bg-emerald-400" /> 7 Days Return Available
          </p>
        </div>
      </div>
    </div>
  );
}
