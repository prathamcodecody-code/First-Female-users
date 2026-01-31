"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FiChevronDown, FiX, FiFilter, FiCheck, FiRotateCcw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeFilter({
  onFilter,
}: {
  onFilter?: (f: any) => void;
}) {
  const [types, setTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);

  const [filter, setFilter] = useState({
    typeId: "",
    colors: [] as number[],
    occasions: [] as number[],
    minPrice: 0,
    maxPrice: 10000,
    sort: "",
  });

  const [openMobile, setOpenMobile] = useState(false);

  /* ---------- FETCH ATTRIBUTES ---------- */
  useEffect(() => {
    Promise.all([
      api.get("/product-types"),
      api.get("/attributes/colors"),
      api.get("/attributes/occasions"),
    ]).then(([t, c, o]) => {
      setTypes(t.data || []);
      setColors(c.data || []);
      setOccasions(o.data || []);
    });
  }, []);

  const toggleAttribute = (key: "colors" | "occasions", id: number) => {
    const existing = filter[key];
    const updated = existing.includes(id)
      ? existing.filter((x) => x !== id)
      : [...existing, id];
    setFilter({ ...filter, [key]: updated });
  };

  const apply = () => {
    onFilter?.(filter);
    setOpenMobile(false);
  };

  const reset = () => {
    const fresh = { typeId: "", colors: [], occasions: [], minPrice: 0, maxPrice: 10000, sort: "" };
    setFilter(fresh);
    onFilter?.(fresh);
  };

  const FilterBody = (
    <div className="w-full space-y-8">
      {/* 1. CATEGORIES (Select) */}
      <AccordionSection title="Collection" defaultOpen={true}>
        <select
          value={filter.typeId}
          onChange={(e) => setFilter({ ...filter, typeId: e.target.value })}
          className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-sm outline-none ring-1 ring-gray-100 focus:ring-brandPink"
        >
          <option value="">All Collections</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </AccordionSection>

      {/* 2. PRICE RANGE SLIDER */}
      <AccordionSection title="Price range">
        <div className="pt-8 pb-2 px-2">
          <div className="relative w-full h-1 bg-gray-100 rounded-full">
            <div 
              className="absolute h-full bg-brandPink rounded-full" 
              style={{ 
                left: `${(filter.minPrice / 10000) * 100}%`, 
                right: `${100 - (filter.maxPrice / 10000) * 100}%` 
              }} 
            />
            <input
              type="range" min="0" max="10000" step="100"
              value={filter.minPrice}
              onChange={(e) => setFilter({ ...filter, minPrice: Math.min(Number(e.target.value), filter.maxPrice - 500) })}
              className="absolute w-full -top-1 h-2 appearance-none bg-transparent pointer-events-none range-slider-input"
            />
            <input
              type="range" min="0" max="10000" step="100"
              value={filter.maxPrice}
              onChange={(e) => setFilter({ ...filter, maxPrice: Math.max(Number(e.target.value), filter.minPrice + 500) })}
              className="absolute w-full -top-1 h-2 appearance-none bg-transparent pointer-events-none range-slider-input"
            />
            {/* Labels */}
            <div className="flex justify-between mt-6 text-[10px] font-black text-brandBlack uppercase tracking-tighter">
              <span>₹{filter.minPrice}</span>
              <span>₹{filter.maxPrice}</span>
            </div>
          </div>
        </div>
      </AccordionSection>

      {/* 3. COLOR PALETTE */}
      <AccordionSection title="Color Palette">
        <div className="grid grid-cols-2 gap-2">
          {colors.map((c) => (
            <button
              key={c.id}
              onClick={() => toggleAttribute("colors", c.id)}
              className={`flex items-center justify-between px-3 py-2 border rounded-sm transition-all ${
                filter.colors.includes(c.id)
                  ? "bg-brandBlack border-brandBlack text-white shadow-md"
                  : "bg-white border-gray-100 text-gray-500 hover:border-brandPink"
              }`}
            >
              <span className="text-[10px] font-bold uppercase">{c.name}</span>
              {filter.colors.includes(c.id) && <FiCheck size={10} />}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* 4. OCCASION */}
      <AccordionSection title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <button
              key={o.id}
              onClick={() => toggleAttribute("occasions", o.id)}
              className={`px-3 py-1.5 border rounded-sm text-[10px] font-bold uppercase transition-all ${
                filter.occasions.includes(o.id)
                  ? "bg-brandPink border-brandPink text-white"
                  : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* 5. SORTING */}
      <AccordionSection title="Sort By">
        <select
          value={filter.sort}
          onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
          className="w-full bg-gray-50 border-none px-4 py-3 text-xs font-bold uppercase rounded-sm outline-none ring-1 ring-gray-100"
        >
          <option value="">Recommended</option>
          <option value="newest">New Arrival</option>
          <option value="low_to_high">Price: Low to High</option>
          <option value="high_to_low">Price: High to Low</option>
        </select>
      </AccordionSection>

      {/* ACTIONS */}
      <div className="pt-6 space-y-3">
        <button
          onClick={apply}
          className="w-full bg-brandBlack text-white py-4 rounded-sm text-[11px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-brandPink transition-all active:scale-95"
        >
          Refine Results
        </button>
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-brandBlack transition-colors"
        >
          <FiRotateCcw size={12} /> Reset Canvas
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden lg:block bg-white border border-gray-100 p-8 rounded-sm shadow-sm sticky top-28">
        <div className="flex items-center gap-2 mb-8 text-brandBlack border-b border-gray-50 pb-4">
          <FiFilter className="text-brandPink" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Filter Studio</h2>
        </div>
        {FilterBody}
      </div>

      {/* MOBILE TRIGGER */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t z-40 px-4 py-4">
        <button
          onClick={() => setOpenMobile(true)}
          className="w-full bg-brandBlack text-white py-4 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl"
        >
          Refine Search
        </button>
      </div>

      {/* MOBILE SHEET */}
      <AnimatePresence>
        {openMobile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[2rem] p-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest italic font-serif">Refine <span className="text-brandPink">Studio</span></h2>
                <button onClick={() => setOpenMobile(false)} className="p-2 bg-gray-50 rounded-full"><FiX size={20}/></button>
              </div>
              {FilterBody}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AccordionSection({ title, children, defaultOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between group"
      >
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] group-hover:text-brandBlack transition-colors">
          {title}
        </span>
        <FiChevronDown className={`transition-transform duration-500 text-gray-300 group-hover:text-brandBlack ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
