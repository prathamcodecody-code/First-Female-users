"use client";

import Link from "next/link";
import Image from "next/image";

const categories = [
  { id: 1, name: "Co-ords", image: "/categories/catstrip1.png" },
  { id: 2, name: "Outerwear", image: "/categories/catstrip2.png" },
  { id: 3, name: "Sweaters", image: "/categories/catstrip3.png" },
  { id: 4, name: "Dresses", image: "/categories/catstrip4.png" },
  { id: 5, name: "Boots", image: "/categories/catstrip5.png" },
];

export default function CategoryStrip() {
  return (
    <div className="w-full bg-white py-6">
      {/* Container with horizontal scroll on mobile, centered on desktop */}
      <div className="max-w-[1440px] mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start md:justify-center gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/all-products?categoryId=${cat.id}`}
              className="flex flex-col items-center group min-w-[80px] md:min-w-[120px]"
            >
              {/* IMAGE BOX */}
              <div className="relative w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-sm border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* TEXT */}
              <span className="mt-3 text-[11px] md:text-sm font-semibold uppercase tracking-[0.1em] text-gray-800 group-hover:text-brandPink transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
