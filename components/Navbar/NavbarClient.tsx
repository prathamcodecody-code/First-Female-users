"use client";

import { useState } from "react";
import {
  HiOutlineMenuAlt1,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { FiSearch, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedLogo from "./AnimatedLogo";

export default function NavbarClient({ navItems }: { navItems: any[] }) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  const visibleItems = navItems.slice(0, 5);
  const remainingItems = navItems.slice(5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/all-products?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <div className="w-full">

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="flex lg:hidden items-center justify-between h-16 px-4">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <HiOutlineMenuAlt1 size={26} />
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <AnimatedLogo />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <AiOutlineHeart size={22} />
          </Link>
          <Link href="/cart">
            <HiOutlineShoppingBag size={22} />
          </Link>
        </div>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="hidden lg:flex items-center h-20 gap-10">

        {/* LOGO */}
        <Link href="/" className="shrink-0">
          <AnimatedLogo />
        </Link>

        {/* NAV ITEMS */}
        <div className="flex-1 flex justify-center gap-10">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              href={`/all-products?typeId=${item.id}`}
              className="text-[12px] font-bold uppercase tracking-[0.15em] hover:text-brandPink"
            >
              {item.name}
            </Link>
          ))}

          {remainingItems.length > 0 && (
            <div className="relative group">
              <span className="text-[12px] font-bold uppercase tracking-[0.15em] cursor-pointer">
                More
              </span>
              <div className="absolute hidden group-hover:block top-full left-0 bg-white border shadow-md">
                {remainingItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/all-products?typeId=${item.id}`}
                    className="block px-6 py-3 text-xs font-bold uppercase hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEARCH + ICONS */}
        <form onSubmit={handleSearch} className="flex items-center bg-gray-50 rounded-full px-4 py-2">
          <FiSearch size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trends..."
            className="bg-transparent text-xs ml-2 w-40 outline-none"
          />
        </form>

        <Link href="/profile"><FiUser size={22} /></Link>
        <Link href="/wishlist"><AiOutlineHeart size={22} /></Link>
        <Link href="/cart"><HiOutlineShoppingBag size={22} /></Link>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">

          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-bold uppercase text-xs">Menu</span>
            <AiOutlineClose size={22} onClick={() => setIsMobileMenuOpen(false)} />
          </div>

          <div className="px-6 py-6 space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/all-products?typeId=${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold uppercase"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
