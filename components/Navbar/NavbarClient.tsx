"use client";

import { useState } from "react";
import {
  HiOutlineMenuAlt1,
  HiOutlineShoppingBag,
  HiChevronDown,
} from "react-icons/hi";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { FiSearch, FiUser } from "react-icons/fi";
import Link from "next/link";
import AnimatedLogo from "./AnimatedLogo";

export default function NavbarClient({ navItems }: { navItems: any[] }) {
  const [showMore, setShowMore] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Correct slicing
  const visibleItems = navItems.slice(0, 4);
  const remainingItems = navItems.slice(4);

  return (
    <div className="w-full bg-white border-b">
      {/* DESKTOP NAVBAR */}
      <div className="hidden lg:flex items-center h-20 px-10">

        {/* LOGO */}
        <div className="flex-shrink-0">
          <Link href="/">
            <AnimatedLogo />
          </Link>
        </div>

        {/* NAV ITEMS */}
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-x-10">

            {visibleItems.map((item) => (
              <Link
                key={item.id}
                href={`/all-products?typeId=${item.id}`}
                className="text-[12px] font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-brandPink transition"
              >
                {item.name}
              </Link>
            ))}

            {/* MORE */}
            {remainingItems.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
              >
                <button className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[0.15em] text-gray-800 hover:text-brandPink">
                  More <HiChevronDown size={14} />
                </button>

                {showMore && (
                  <div className="absolute top-full left-0 w-56 bg-white border shadow-xl z-50">
                    {remainingItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/all-products?typeId=${item.id}`}
                        className="block px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:bg-gray-50 hover:text-brandPink transition"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2">
            <FiSearch size={16} className="text-gray-400" />
            <input
              placeholder="Search trends..."
              className="bg-transparent outline-none text-xs ml-2 w-40"
            />
          </div>

          <Link href="/profile">
            <FiUser size={22} />
          </Link>

          <Link href="/wishlist" className="relative">
            <AiOutlineHeart size={24} />
            <span className="absolute -top-1 -right-1 bg-brandPink text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center">
            <HiOutlineShoppingBag size={24} />
            <span className="text-[9px] font-bold uppercase">Bag</span>
          </Link>
        </div>
      </div>

      {/* MOBILE MENU (unchanged logic) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm">
          <div className="w-[300px] h-full bg-white shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <span className="font-bold tracking-[0.2em] text-xs uppercase">
                Menu
              </span>
              <AiOutlineClose
                size={22}
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/all-products?typeId=${item.id}`}
                  className="block px-8 py-4 text-sm font-bold uppercase tracking-widest text-gray-800 border-b hover:bg-brandPinkLight hover:text-brandPink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
