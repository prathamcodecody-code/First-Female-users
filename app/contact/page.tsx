"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaWhatsapp,
  FaInstagram,
  FaClock,
} from "react-icons/fa";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    reason: "GENERAL",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setLoading(true);
    if (!form.email || !form.message) {
  alert("Email and message are required");
  return;
}
    try {
      await api.post("/contact", form);
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        reason : "",
      });
    } catch {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!success) return;
  const t = setTimeout(() => setSuccess(false), 4000);
  return () => clearTimeout(t);
}, [success]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-gray-700">
      <h1 className="text-3xl font-bold mb-10">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT: CONTACT INFO */}
        <div className="space-y-6 bg-white border rounded-xl p-8">
          <h2 className="text-xl font-bold text-brandBlack">
            Get in touch
          </h2>

          <ContactItem
            icon={<FaPhoneAlt />}
            label="Customer Care"
            value="+91 96547 64464"
          />

          <ContactItem
            icon={<FaEnvelope />}
            label="Email"
            value="support@firstfemale.in"
            link="mailto:support@firstfemale.in"
          />

          <ContactItem
            icon={<FaWhatsapp />}
            label="WhatsApp"
            value="Chat with us"
            link="https://wa.me/919654764464"
            highlight
          />

          <ContactItem
            icon={<FaInstagram />}
            label="Instagram"
            value="@firstfemale_official"
            link="https://www.instagram.com/firstfemale_official?igsh=N3RlZ3Z4NzI5MWxx&utm_source=qr"
          />

          <ContactItem
            icon={<FaClock />}
            label="Business Hours"
            value="Mon – Sat | 10 AM – 7 PM"
          />
        </div>

        {/* RIGHT: FORM */}
        <div className="bg-white shadow-md border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">
            Send us a message
          </h2>

          {success && (
            <p className="mb-4 text-green-600 font-semibold">
              Message sent successfully!
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              className="border p-3 rounded-md"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-md"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-md"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-md"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
            />
<select
  className="border p-3 rounded-md md:col-span-2"
  value={form.reason}
  onChange={(e) =>
    setForm({ ...form, reason: e.target.value })
  }
>
  <option value="GENERAL">General Inquiry</option>
  <option value="ORDER_QUERY">Order Related</option>
  <option value="PAYMENT_FAILED">Payment Failed</option>
</select>
            <textarea
              className="border p-3 rounded-md md:col-span-2"
              rows={5}
              placeholder="Your Message"
              value={form.message}
              onChange={(e) =>
                setForm({ ...form, message: e.target.value })
              }
            />

            <button
              onClick={submit}
              disabled={loading}
              className="bg-brandPink text-white py-3 rounded-md font-semibold md:col-span-2 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPER ---------------- */

function ContactItem({
  icon,
  label,
  value,
  link,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  link?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`text-xl ${
          highlight ? "text-green-500" : "text-brandPink"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-500">
          {label}
        </p>
        {link ? (
          <a
            href={link}
            target="_blank"
            className={`font-medium ${
              highlight
                ? "text-green-600"
                : "text-gray-800 hover:text-brandPink"
            }`}
          >
            {value}
          </a>
        ) : (
          <p className="font-medium text-gray-800">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
