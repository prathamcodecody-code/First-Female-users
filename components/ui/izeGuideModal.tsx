"use client";

import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function SizeGuideModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const chart = [
    { size: "XS", bust: "32", waist: "26", hip: "35" },
    { size: "S", bust: "34", waist: "28", hip: "37" },
    { size: "M", bust: "36", waist: "30", hip: "39" },
    { size: "L", bust: "38", waist: "32", hip: "41" },
    { size: "XL", bust: "40", waist: "34", hip: "43" },
    { size: "XXL", bust: "42", waist: "36", hip: "45" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal content area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[500px] bg-white rounded-sm shadow-2xl overflow-hidden"
          >
            <div className="h-1.5 bg-brandPink w-full" />
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tighter text-brandBlack">Size Guide</h2>
                <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-sm">
                <table className="w-full text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Size</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Bust</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Waist</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Hip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.map((row) => (
                      <tr key={row.size} className="border-b border-gray-50 last:border-0 hover:bg-brandPinkLight/5 transition-colors">
                        <td className="p-4 text-xs font-black text-brandPink uppercase">{row.size}</td>
                        <td className="p-4 text-xs font-medium text-gray-600">{row.bust}&quot;</td>
                        <td className="p-4 text-xs font-medium text-gray-600">{row.waist}&quot;</td>
                        <td className="p-4 text-xs font-medium text-gray-600">{row.hip}&quot;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-4 bg-brandCream/50 rounded-sm border border-brandPink/5">
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium italic">
                  *Measurements are in inches. For the best fit, we recommend measuring over your undergarments.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}