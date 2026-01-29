"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type HeroSlide = {
  mediaId: number;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
};

type Media = {
  id: number;
  url: string;
  type: "IMAGE" | "VIDEO";
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [mediaMap, setMediaMap] = useState<Record<number, Media>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Fetch media for all slides
  useEffect(() => {
    const mediaIds = slides.map((s) => s.mediaId).filter(Boolean);
    if (mediaIds.length === 0) return;

    api
      .get("/media", {
        params: { ids: mediaIds.join(",") },
      })
      .then((res) => {
        const map: Record<number, Media> = {};
        res.data.forEach((m: Media) => {
          map[m.id] = {
            ...m,
            url: `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")}${m.url}`,
          };
        });
        setMediaMap(map);
        setIsLoaded(true); // Only show carousel when data is ready
      });
  }, [slides]);

  // Autoplay
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  // Fix: Show a clean skeleton instead of "No Media" text while loading
  if (!isLoaded) {
    return (
      <div className="w-full h-[260px] sm:h-[360px] md:h-[500px] bg-gray-100 animate-pulse rounded-2xl mb-10" />
    );
  }

  const prev = () => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl group mb-10 shadow-2xl">
      <div className="relative h-[300px] sm:h-[450px] md:h-[550px]">
        <AnimatePresence mode="wait">
          {slides.map((slide, i) => {
            const media = mediaMap[slide.mediaId];
            if (i !== index) return null;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {/* MEDIA */}
                {media?.type === "IMAGE" ? (
                  <Image
                    src={media.url}
                    alt={slide.title}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={media?.url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}

                {/* OVERLAY: Darker on left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

                {/* CONTENT */}
                <div className="absolute left-8 md:left-20 top-1/2 -translate-y-1/2 text-white max-w-xl z-20">
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4 italic font-serif">
                      {slide.title}
                    </h2>
                    
                    {slide.subtitle && (
                      <p className="text-sm md:text-lg mb-8 text-white/80 font-medium tracking-wide uppercase">
                        {slide.subtitle}
                      </p>
                    )}

                    {slide.ctaText && (
                      <button
                        onClick={() => router.push(slide.ctaLink || "/all-products")}
                        className="bg-brandPink hover:bg-white hover:text-brandPink text-white px-10 py-4 rounded-sm font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 shadow-xl"
                      >
                        {slide.ctaText}
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* NAVIGATION: Minimalist hidden by default, shown on hover */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md text-white p-3 rounded-full border border-white/20"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-md text-white p-3 rounded-full border border-white/20"
        >
          <ChevronRight size={24} />
        </button>

        {/* DOTS: Gen-Z pill style */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`transition-all duration-500 rounded-full
                ${i === index
                  ? "bg-brandPink w-8 h-2"
                  : "bg-white/40 w-2 h-2 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

