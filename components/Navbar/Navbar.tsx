import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let navItems: any[] = [];

  try {
    // Assuming category 1 is your main 'Women' category
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/product-types?categoryId=1`,
      { cache: "no-store" }
    );

    if (res.ok) {
      navItems = await res.json();
    }
  } catch (e) {
    console.error("Failed to load nav items", e);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <NavbarClient navItems={navItems} />
      </div>
    </nav>
  );
}
