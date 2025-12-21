import { redirect } from "next/navigation";

export default function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id || isNaN(Number(params.id))) {
    redirect("/");
  }

  redirect(`/all-products?categoryId=${params.id}`);
}
