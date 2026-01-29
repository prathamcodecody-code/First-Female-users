"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import CategoryStrip from "./CategoryStrip";

type StripItem = {
  subtypeId: number;
  mediaId?: number;
};

export default function ResolvedCategoryStrip({
  items,
}: {
  items: StripItem[];
}) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!items || items.length === 0) return;

    api
      .get("/category-strip", {
        params: {
          items: JSON.stringify(items),
        },
      })
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch((err) => {
        console.error("Category strip load failed", err);
      });
  }, [items]);

  if (!categories.length) return null;

  return <CategoryStrip categories={categories} />;
}
