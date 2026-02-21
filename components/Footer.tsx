"use client";
import Link from "next/link";
import React from "react";
import {} from "@/lib/api";
import FeedbackModal from "@/app/feedback/feedback";


export default function Footer() {

  const [showFeedback, setShowFeedback] = React.useState(false);
  return (
    <>
    <footer className="mt-24 bg-[#fff5f8] border-t border-pink-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* ================= TOP GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* BRAND */}
          <div>
            <h3 className="text-xl font-bold text-brandPink mb-4">
              FirstFemale
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Your everyday fashion destination for women, men & kids.
              Discover the latest styles in ethnic, western & daily fashion.
            </p>
          </div>

          {/* CUSTOMER CARE */}
          <div>
            <h4 className="font-semibold text-brandPink mb-4 uppercase tracking-wide text-sm">
              Customer Care
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Track Order", href: "/orders" },
                { label: "Returns & Refunds", href: "/return-refund" },
                { label: "FAQs", href: "/faq" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-brandPink transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
     <li>
                <button
                  onClick={() => setShowFeedback(true)}
                  className="hover:text-brandPink transition"
                >
                  Give Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="font-semibold text-brandPink mb-4 uppercase tracking-wide text-sm">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", href: "/about" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Refund Policy", href: "/return-refund" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-brandPink transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="font-semibold text-brandPink mb-4 uppercase tracking-wide text-sm">
              Follow Us
            </h4>
            <ul className="space-y-2 text-sm">
              {["Instagram", "Facebook", "YouTube", "Pinterest"].map(
                (s) => (
                  <li key={s}>
                    <a
                      href="https://www.instagram.com/firstfemale_official?igsh=N3RlZ3Z4NzI5MWxx&utm_source=qr"
                      className="hover:text-brandPink transition"
                    >
                      {s}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* ================= POPULAR SEARCHES ================= */}
        <div className="border-t border-pink-100 pt-8 mb-8">
          <h4 className="font-semibold text-brandPink mb-3 text-sm uppercase tracking-wide">
            Popular Searches
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Dresses · Tops · Kurtis · Sarees · Western Wear · Ethnic Wear ·
            Jeans · T-Shirts · Party Wear · Footwear · Bags · Kids Clothing ·
            Designer Wear
          </p>
        </div>

        {/* ================= ADDRESS ================= */}
        <div className="border-t border-pink-100 pt-8 mb-8">
          <h4 className="font-semibold text-brandPink mb-3 text-sm uppercase tracking-wide">
            Registered Office Address
          </h4>
          <p className="text-sm leading-relaxed text-gray-600">
            VARSE FASHION PRIVATE LIMITED<br />
            H.No. 60, 3rd floor, KH No. 251/200, Shri Aurobindo Marg, New Delhi 110017<br />
            Customer Support: +91-9654764464
          </p>
        </div>

        {/* ================= SEO CONTENT ================= */}
        <div className="border-t border-pink-100 pt-8">
          <h4 className="font-semibold text-brandPink mb-3 text-sm uppercase tracking-wide">
            Online Shopping Made Easy at FirstFemale
          </h4>

          <p className="text-sm text-gray-600 leading-relaxed">
            FirstFemale brings you the latest ethnic, western and contemporary
            fashion. Enjoy fast delivery, easy returns & high-quality verified
            products designed for everyday comfort and style.
          </p>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="mt-12 pt-6 border-t border-pink-100 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FirstFemale. All rights reserved.
        </div>
      </div>
    </footer>
    {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}
    </>
  );
}
