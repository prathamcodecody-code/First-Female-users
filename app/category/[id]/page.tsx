import CategoryClient from "./CategoryClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ REQUIRED

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/all-products?categoryId=${id}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const products = Array.isArray(data?.products) ? data.products : [];

  return (
    <CategoryClient
      products={products}
      categoryId={id}
    />
  );
}
