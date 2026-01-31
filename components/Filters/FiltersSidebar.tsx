"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { FiChevronDown, FiX, FiFilter, FiCheck, FiRefreshCw } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function FiltersSidebar() {
  const [types, setTypes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [fabrics, setFabrics] = useState<any[]>([]);
  const [fits, setFits] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const activeTypeId = searchParams.get("typeId");
  const activeSubtypeId = searchParams.get("subtypeId");

  /* ---------- URL HELPERS ---------- */
  const buildLink = (extra: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(extra).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });
    return `${pathname}?${params.toString()}`;
  };

  const toggleMulti = (key: string, id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.get(key)?.split(",").map(Number) || [];
    const updated = existing.includes(id)
      ? existing.filter((x) => x !== id)
      : [...existing, id];

    if (updated.length) params.set(key, updated.join(","));
    else params.delete(key);
    return `${pathname}?${params.toString()}`;
  };

  /* ---------- FETCH ---------- */
  useEffect(() => {
    api.get("/product-types?includeSubtypes=true").then((r) => setTypes(r.data || []));
    api.get("/attributes/colors").then(r => setColors(r.data || []));
    api.get("/attributes/fabrics").then(r => setFabrics(r.data || []));
    api.get("/attributes/fits").then(r => setFits(r.data || []));
    api.get("/attributes/occasions").then(r => setOccasions(r.data || []));
  }, []);

  const hasFilters = searchParams.toString() !== "";

  return (
    <div className="w-full h-full flex flex-col md:sticky md:top-24">
      {/* 1. Header (Static) */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 bg-white z-10">
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
          <FiFilter className="text-brandPink" /> Refine Studio
        </h2>
        {hasFilters && (
          <Link 
            href={pathname} 
            className="text-[9px] font-black uppercase tracking-widest text-brandPink hover:text-brandBlack flex items-center gap-1 transition-all"
          >
            Reset <FiRefreshCw className="animate-spin-hover" />
          </Link>
        )}
      </div>

      {/* 2. Scrollable Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pr-2 pb-10">
        
        {/* PRODUCT TYPES */}
        <AccordionSection title="Categories" defaultOpen={true}>
          <div className="flex flex-col gap-3 pt-2">
            {types.map((t) => (
              <div key={t.id} className="space-y-3">
                <Link
                  href={buildLink({ typeId: String(t.id), subtypeId: null })}
                  className={`text-[12px] font-black uppercase tracking-widest flex items-center justify-between transition-colors ${
                    activeTypeId === String(t.id) ? "text-brandPink" : "text-brandBlack hover:text-brandPink"
                  }`}
                >
                  {t.name}
                  {activeTypeId === String(t.id) && <div className="w-1 h-1 rounded-full bg-brandPink shadow-[0_0_8px_#EE2A7B]" />}
                </Link>

                <AnimatePresence>
                  {t.subtypes?.length > 0 && activeTypeId === String(t.id) && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-2 pl-4 border-l border-gray-100 flex flex-col gap-2.5 overflow-hidden"
                    >
                      {t.subtypes.map((s: any) => (
                        <Link
                          key={s.id}
                          href={buildLink({ subtypeId: String(s.id), typeId: String(t.id) })}
                          className={`text-[11px] font-medium tracking-tight flex items-center gap-2 ${
                            activeSubtypeId === String(s.id) ? "text-brandBlack font-black" : "text-gray-400 hover:text-brandBlack"
                          }`}
                        >
                          {s.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </AccordionSection>

        <Divider />

        {/* COLOR PALETTE */}
        <AccordionSection title="Color Palette">
           <div className="grid grid-cols-2 gap-2 pt-2">
             {colors.map(c => (
                <Link 
                  key={c.id} 
                  href={toggleMulti("colors", c.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-sm border transition-all ${
                    searchParams.get("colors")?.split(',').includes(String(c.id))
                    ? "border-brandBlack bg-brandBlack text-white shadow-xl"
                    : "border-gray-50 bg-gray-50/50 text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{c.name}</span>
                  {searchParams.get("colors")?.split(',').includes(String(c.id)) && <FiCheck size={10}/>}
                </Link>
             ))}
           </div>
        </AccordionSection>

        {/* ATTRIBUTES GRID */}
        <AttributeBlock title="Fabric" items={fabrics} param="fabrics" searchParams={searchParams} toggleMulti={toggleMulti} />
        <AttributeBlock title="Fit" items={fits} param="fits" searchParams={searchParams} toggleMulti={toggleMulti} />
        <AttributeBlock title="Occasion" items={occasions} param="occasions" searchParams={searchParams} toggleMulti={toggleMulti} />

        <Divider />

        {/* PRICE RANGE */}
        <AccordionSection title="Price Range">
          <div className="flex flex-col gap-3 pt-2">
            <PriceLink href={buildLink({ maxPrice: "999", minPrice: null })} label="Under ₹999" active={searchParams.get("maxPrice") === "999"} />
            <PriceLink href={buildLink({ minPrice: "1000", maxPrice: "1999" })} label="₹1000 – ₹1999" active={searchParams.get("minPrice") === "1000"} />
            <PriceLink href={buildLink({ minPrice: "2000", maxPrice: "2999" })} label="₹2000 – ₹2999" active={searchParams.get("minPrice") === "2000"} />
            <PriceLink href={buildLink({ minPrice: "3000", maxPrice: null })} label="₹3000 & Above" active={searchParams.get("minPrice") === "3000"} />
          </div>
        </AccordionSection>

        {/* STOCK STATUS */}
        <Link
          href={buildLink({ stock: searchParams.get("stock") === "in" ? null : "in" })}
          className={`flex items-center justify-between p-4 rounded-sm border transition-all group ${
            searchParams.get("stock") === "in" ? "border-emerald-500 bg-emerald-50/30 shadow-sm" : "border-gray-100 hover:border-gray-200"
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-brandBlack">In-Stock Only</span>
          <div className={`w-2.5 h-2.5 rounded-full transition-all ${
            searchParams.get("stock") === "in" ? "bg-emerald-500 animate-pulse" : "bg-gray-200 group-hover:bg-gray-300"
          }`} />
        </Link>

      </div>
    </div>
  );
}

/* ---------- HELPER COMPONENTS ---------- */

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

function AttributeBlock({ title, items, param, searchParams, toggleMulti }: any) {
  return (
    <AccordionSection title={title}>
      <div className="flex flex-wrap gap-2 pt-2">
        {items.map((item: any) => (
          <AttributePill 
            key={item.id} 
            item={item} 
            active={searchParams.get(param)?.split(',').includes(String(item.id))}
            href={toggleMulti(param, item.id)} 
          />
        ))}
      </div>
    </AccordionSection>
  );
}

function AttributePill({ item, active, href }: any) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-tighter border transition-all ${
        active
          ? "bg-brandPink text-white border-brandPink shadow-[0_4px_12px_rgba(238,42,123,0.2)]"
          : "border-gray-100 text-gray-500 hover:border-gray-300 hover:text-brandBlack"
      }`}
    >
      {item.name}
    </Link>
  );
}

function PriceLink({ href, label, active }: any) {
  return (
    <Link 
      href={href} 
      className={`text-[12px] transition-all flex items-center justify-between group ${
        active ? "text-brandBlack font-black" : "text-gray-400 hover:text-brandBlack"
      }`}
    >
      {label}
      <div className={`w-1 h-1 rounded-full transition-all ${active ? "bg-brandPink shadow-[0_0_6px_#EE2A7B]" : "bg-transparent group-hover:bg-gray-200"}`} />
    </Link>
  );
}

function Divider() {
  return <div className="h-px bg-gray-50 w-full" />;
}
