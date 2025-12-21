import { redirect } from "next/navigation";

export default function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  redirect(`/all-products?categoryId=${params.id}`);
}
