"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProductImages({ images = [] }: { images?: string[] }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
  const base = `${API_URL}/uploads/products/`;

  const validImages = useMemo(
    () =>
      Array.isArray(images)
        ? images.filter((img): img is string => typeof img === "string" && img.length > 0)
        : [],
    [images]
  );

  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selected && validImages.length > 0) setSelected(validImages[0]);
    if (selected && !validImages.includes(selected)) setSelected(validImages[0] ?? null);
  }, [validImages, selected]);

  if (validImages.length === 0) {
    return (
      <div className="w-full aspect-[3/4] bg-gray-50 rounded-sm flex items-center justify-center text-gray-400 text-xs uppercase tracking-widest">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* ---------------- THUMBNAILS ---------------- */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
        {validImages.map((img, index) => (
          <button
            key={`${img}-${index}`}
            onClick={() => {
              if (img !== selected) {
                setSelected(img);
                setLoading(true);
                setError(false);
              }
            }}
            className={`flex-shrink-0 w-20 h-24 md:w-24 md:h-32 border transition-all duration-300 rounded-sm overflow-hidden
              ${selected === img ? "border-brandPink shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
          >
            <img
              src={base + img}
              alt="thumbnail"
              className="w-full h-full object-cover" // Thumbnails look fine cropped to center
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* ---------------- MAIN IMAGE ---------------- */}
      <div className="relative flex-1 bg-[#F9F9F9] rounded-sm overflow-hidden aspect-[3/4]">
        {loading && <div className="absolute inset-0 bg-gray-100 animate-pulse z-10" />}
        {error && <div className="absolute inset-0 flex items-center justify-center text-red-500 z-10 text-xs">Failed to load</div>}

        {selected && (
          <img
            src={base + selected}
            alt="product"
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            className="w-full h-full object-contain p-1 transition-opacity duration-500" // object-contain prevents cropping
          />
        )}
      </div>
    </div>
  );
}
