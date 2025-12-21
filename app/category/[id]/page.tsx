import FiltersSidebar from "@/components/Filters/FiltersSidebar";

type Product = {
  id: number;
  slug: string;
  title: string;
  price: number;
  img1?: string;
  category?: { name: string };
};

export default async function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // ✅ ALWAYS defined

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?categoryId=${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <p>Failed to load products.</p>;
  }

  const data = await res.json();
  const products: Product[] = data?.products ?? [];

  const categoryName =
    products.length > 0 ? products[0].category?.name : "Category";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <FiltersSidebar categoryId={id} />
        </div>

        <div className="col-span-9">
          {products.length === 0 && <p>No products found.</p>}
        </div>
      </div>
    </div>
  );
}
