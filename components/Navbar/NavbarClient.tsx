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
import { useRouter } from "next/navigation";
import AnimatedLogo from "./AnimatedLogo";
import { api } from "@/lib/api";

export default function NavbarClient({ navItems = [] }: { navItems: any[] }) {
  const router = useRouter();

  const [showMore, setShowMore] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [subTypes, setSubTypes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const visibleItems = navItems.slice(0, 4);
  const remainingItems = navItems.slice(4);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  const openCategory = async (category: any) => {
    setActiveCategory(category);
    try {
      const res = await api.get(`/product-types?categoryId=${category.id}`);
      setSubTypes(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSubTypes([]);
    }
  };

  return (
    <div className="w-full bg-white border-b">

      {/* ================= MOBILE TOP BAR ================= */}
      <div className="flex lg:hidden items-center justify-between h-16 px-4">
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
      <div className="hidden lg:flex items-center h-20 px-10">

        <Link href="/" className="flex-shrink-0">
          <AnimatedLogo />
        </Link>

        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-x-10">
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
              <div
                className="relative"
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={() => setShowMore(false)}
              >
                <button className="flex items-center gap-1 text-[12px] font-bold uppercase">
                  More <HiChevronDown size={14} />
                </button>

                {showMore && (
                  <div className="absolute top-full left-0 w-56 bg-white border shadow-xl z-50">
                    {remainingItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/all-products?typeId=${item.id}`}
                        className="block px-6 py-3 text-[11px] font-bold uppercase hover:bg-gray-50"
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

        <div className="flex items-center gap-6">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-2">
            <FiSearch size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search trends..."
              className="bg-transparent outline-none text-xs ml-2 w-40"
            />
          </div>

          <Link href="/profile"><FiUser size={22} /></Link>
          <Link href="/wishlist"><AiOutlineHeart size={24} /></Link>
          <Link href="/cart"><HiOutlineShoppingBag size={24} /></Link>
        </div>
      </div>

      {/* ================= MOBILE SLIDE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            {activeCategory ? (
              <button onClick={() => setActiveCategory(null)}>← Back</button>
            ) : (
              <span className="uppercase text-xs font-bold">Menu</span>
            )}
            <AiOutlineClose
              size={22}
              onClick={() => {
                setIsMobileMenuOpen(false);
                setActiveCategory(null);
              }}
            />
          </div>

          <div className="flex h-full">
            <div className="w-full px-6 py-6 space-y-4 overflow-y-auto">
              {!activeCategory &&
                navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => openCategory(item)}
                    className="w-full text-left uppercase font-semibold flex justify-between"
                  >
                    {item.name} →
                  </button>
                ))}

              {activeCategory && (
                <>
                  <Link
                    href={`/all-products?categoryId=${activeCategory.id}`}
                    className="block font-semibold"
                  >
                    Shop All {activeCategory.name}
                  </Link>

                  {subTypes.map((type) => (
                    <div key={type.id}>
                      <Link href={`/all-products?typeId=${type.id}`}>
                        {type.name}
                      </Link>
                      {type.subtypes?.map((s: any) => (
                        <Link
                          key={s.id}
                          href={`/all-products?subtypeId=${s.id}`}
                          className="block pl-4 text-sm text-gray-500"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
