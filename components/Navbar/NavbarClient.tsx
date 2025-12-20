"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import MegaMenu from "./MegaMenu";
import { useRouter } from "next/navigation";
import { AiOutlineHeart } from "react-icons/ai";
import { api } from "@/lib/api";
import { useEffect } from "react";


export default function NavbarClient({ categories }: { categories: any[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const timeoutRef = useRef<any>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);



  const enter = (name: string) => {
    clearTimeout(timeoutRef.current);
    setHovered(name);
  };

  const leave = () => {
    timeoutRef.current = setTimeout(() => setHovered(null), 150);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setShowMobileSearch(false);
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

useEffect(() => {
  api
    .get("/wishlist")
    .then((res) => {
      setWishlistCount(res.data?.length || 0);
    })
    .catch(() => {
      // user not logged in OR error → silently ignore
      setWishlistCount(0);
    });
}, []);


  return (
    <>
      {/* NAVBAR */}
      <div className="flex items-center justify-between h-16 px-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/firstlady.png"
            alt="FirstLady"
            width={120}
            height={36}
            className="object-contain"
            priority
          />
        </Link>

        {/* CATEGORIES */}
        <div className="hidden lg:flex items-center gap-8 font-semibold text-[13px] tracking-wide">
          {Array.isArray(categories) &&
  categories.map((c) => (
            <div
              key={c.id}
              className="relative"
              onMouseEnter={() => enter(c.name)}
              onMouseLeave={leave}
            >
              <button className="uppercase text-gray-800 hover:text-brandPink transition relative pb-1">
                {c.name}
                <span
                  className={`absolute left-0 bottom-0 h-[2px] bg-brandPink transition-all duration-200 ${
                    hovered === c.name ? "w-full" : "w-0"
                  }`}
                />
              </button>

              {hovered === c.name && (
                <div
                  className="fixed left-0 top-16 w-full"
                  onMouseEnter={() => enter(c.name)}
                  onMouseLeave={leave}
                >
                  <MegaMenu categoryId={c.id} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6">

          {/* SEARCH (DESKTOP) */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-[320px] border border-gray-200 focus-within:border-brandPink transition">
            <FiSearch
              className="text-gray-500 mr-2 cursor-pointer"
              size={18}
              onClick={handleSearch}
            />
            <input
              type="text"
              placeholder="Search for products"
              className="bg-transparent outline-none text-sm flex-1"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* SEARCH ICON (MOBILE) */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden text-gray-700 hover:text-brandPink transition"
          >
            <FiSearch size={20} />
          </button>

          {/* PROFILE */}
          <Link href="/profile" className="flex flex-col items-center text-gray-700 hover:text-brandPink transition">
            <FaUser size={18} />
            <span className="text-[11px] mt-1">Profile</span>
          </Link>

 {/* WISHLIST */}
<Link
  href="/wishlist"
  className="relative flex flex-col items-center text-gray-700 hover:text-brandPink transition"
>
  <AiOutlineHeart size={20} />

  {wishlistCount > 0 && (
    <span className="absolute -top-1 right-0 min-w-[16px] h-[16px] px-[4px] rounded-full bg-brandPink text-white text-[10px] flex items-center justify-center">
      {wishlistCount}
    </span>
  )}

  <span className="text-[11px] mt-1">Wishlist</span>
</Link>

          {/* CART */}
          <Link href="/cart" className="flex flex-col items-center text-gray-700 hover:text-brandPink transition">
            <HiOutlineShoppingBag size={20} />
            <span className="text-[11px] mt-1">Bag</span>
          </Link>
        </div>
      </div>

      {/* 🔍 MOBILE SEARCH OVERLAY */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-white px-4 py-4 md:hidden">
          <div className="flex items-center gap-3 border rounded-full px-4 py-3">
            <FiSearch
              className="text-gray-500 cursor-pointer"
              size={18}
              onClick={handleSearch}
            />
            <input
              autoFocus
              type="text"
              placeholder="Search for products"
              className="flex-1 outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
