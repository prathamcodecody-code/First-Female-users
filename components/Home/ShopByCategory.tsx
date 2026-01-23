"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  img1?: string | null;
};

interface Props {
  title: string;
  products: Product[];
  exploreLink: string;
}

export default function FeaturedProductSection({
  title,
  products,
  exploreLink,
}: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">

        {/* SECTION HEADING */}
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-ultra text-brandBlack">
            {title}
          </h2>
          <div className="w-24 h-[1px] bg-brandPink mx-auto mt-4 opacity-50" />
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product, index) => {
            const imageUrl = product.img1
              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.img1}`
              : "/placeholder.png";

            const productUrl = `/products/${product.slug}-${product.id}`;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={productUrl}>

                  {/* IMAGE */}
                  <div className="relative aspect-[3/4] bg-brandCream overflow-hidden rounded-sm">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* INFO */}
                  <div className="mt-4 space-y-1">
                    <p className="text-sm font-medium text-brandBlack line-clamp-2">
                      {product.title}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-brandBlack">
                        ₹{product.finalPrice.toLocaleString()}
                      </span>

                      {product.finalPrice < product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₹{product.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* EXPLORE ALL */}
        <div className="mt-16 text-center">
          <Link href={exploreLink}>
            <button className="px-16 py-4 border border-brandBlack text-xs font-bold uppercase tracking-boutique hover:bg-brandBlack hover:text-white transition-all duration-300 rounded-sm">
              Explore All
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}
