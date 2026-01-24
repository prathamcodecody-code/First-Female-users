"use client";

import Link from "next/link";
import Image from "next/image";

type Subtype = {
  id: number;
  name: string;
  image: string;
};
interface Props {
  categories: Subtype[];
}

export default function CategoryStrip({ categories }: Props) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full bg-white py-6">
      <div className="max-w-[1440px] mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-start md:justify-center gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/all-products?subtypeId=${cat.id}`}
              className="flex flex-col items-center group min-w-[80px] md:min-w-[120px]"
            >
              <div className="relative w-20 h-20 md:w-28 md:h-28 overflow-hidden rounded-xl border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>

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
