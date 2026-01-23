"use client";

import { useEffect, useState } from "react";
import { HiOutlineMenuAlt1, HiOutlineShoppingBag } from "react-icons/hi";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { FiSearch, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AnimatedLogo from "./AnimatedLogo";
import { api } from "@/lib/api";

export default function NavbarClient() {
  const router = useRouter();
  const [navItems, setNavItems] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/product-types", { params: { categoryId: 1 } })
      .then((res) => setNavItems(res.data || []))
      .catch(() => setNavItems([]));
  }, []);

  const visibleItems = navItems.slice(0, 5);
  const remainingItems = navItems.slice(5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/all-products?search=${encodeURIComponent(search)}`);
    setSearch("");
  };

  if (navItems.length === 0) return null;

  return (
    <div className="w-full overflow-hidden"> {/* Added overflow-hidden to prevent horizontal scroll */}

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="relative flex lg:hidden items-center justify-between h-16 px-4">
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <HiOutlineMenuAlt1 size={26} />
        </button>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <AnimatedLogo />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/wishlist"><AiOutlineHeart size={22} /></Link>
          <Link href="/cart"><HiOutlineShoppingBag size={22} /></Link>
        </div>
      </div>

      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="hidden lg:flex items-center justify-between h-20 w-full gap-4">
        
        {/* LOGO - Fixed width to prevent shifting */}
        <Link href="/" className="shrink-0">
          <AnimatedLogo />
        </Link>

        {/* NAVIGATION LINKS - flex-1 with center alignment */}
        <div className="flex-1 flex justify-center items-center gap-x-8">
          {visibleItems.map((item) => (
            <Link
              key={item.id}
              href={`/all-products?typeId=${item.id}`}
              className="text-[11px] font-bold uppercase tracking-[0.15em] hover:text-brandPink whitespace-nowrap transition-colors"
            >
              {item.name}
            </Link>
          ))}

          {remainingItems.length > 0 && (
            <div className="relative group">
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] cursor-pointer flex items-center gap-1">
                More
              </span>
              <div className="absolute hidden group-hover:block top-full left-0 bg-white border border-gray-100 shadow-xl py-2 min-w-[160px] z-[60]">
                {remainingItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/all-products?typeId=${item.id}`}
                    className="block px-4 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 hover:text-brandPink transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: SEARCH + ICONS */}
        <div className="flex items-center gap-6 shrink-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-50 border border-transparent focus-within:border-gray-200 rounded-full px-4 py-1.5 transition-all"
          >
            <FiSearch size={14} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-transparent text-xs ml-2 w-24 focus:w-40 outline-none transition-all"
            />
          </form>

          <div className="flex items-center gap-5 text-gray-800">
            <Link href="/profile" className="hover:text-brandPink transition-colors"><FiUser size={20} /></Link>
            <Link href="/wishlist" className="hover:text-brandPink transition-colors"><AiOutlineHeart size={20} /></Link>
            <Link href="/cart" className="hover:text-brandPink transition-colors"><HiOutlineShoppingBag size={20} /></Link>
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-left duration-300">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <span className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Menu</span>
            <AiOutlineClose size={24} onClick={() => setIsMobileMenuOpen(false)} />
          </div>

          <div className="px-6 py-8 space-y-6 overflow-y-auto h-full">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/all-products?typeId=${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold uppercase tracking-wider border-b border-gray-50 pb-4"
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
