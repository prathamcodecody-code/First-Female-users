import { redirect } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ CRITICAL FIX

  if (!id || isNaN(Number(id))) {
    redirect("/");
  }

  redirect(`/all-products?categoryId=${id}`);
}
