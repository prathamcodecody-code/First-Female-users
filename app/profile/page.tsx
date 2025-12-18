"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthModal from "../auth/AuthModal";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "account" | "orders"
  >("account");

  if (!user) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">Please login to view profile</p>
        <button
                  onClick={() => setShowAuth(true)}
                  className="mt-4 bg-brandPink text-white px-8 py-3 rounded-lg"
                >
                  Sign In
                </button>
        
                <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* SIDEBAR */}
      <aside className="bg-white rounded-xl shadow p-4 space-y-2 h-fit">
        <p className="font-bold text-lg mb-3">My Account</p>

        <SidebarBtn
          active={activeTab === "account"}
          onClick={() => setActiveTab("account")}
        >
          Account Details
        </SidebarBtn>

        <SidebarBtn
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </SidebarBtn>

        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </aside>

      {/* CONTENT */}
      <section className="md:col-span-3">
        {activeTab === "account" && (
          <AccountDetails user={user} setUser={setUser} />
        )}
        {activeTab === "orders" && <OrdersShortcut />}
      </section>
    </div>
  );
}

/* ---------------- ACCOUNT DETAILS (EDITABLE) ---------------- */

function AccountDetails({ user, setUser }: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
  });
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    try {
      setLoading(true);

      // Backend-ready (add endpoint later)
      const res = await api.patch("/users/profile", form);

      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Account Information</h2>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-brandPink font-semibold hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* NAME */}
        <ProfileField
          label="Full Name"
          value={form.name}
          editing={editing}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="Enter your full name"
        />

        {/* EMAIL */}
        <ProfileField
          label="Email"
          value={form.email}
          editing={editing}
          onChange={(v) => setForm({ ...form, email: v })}
          placeholder="Add your email"
        />

        {/* PHONE (READ ONLY) */}
        <StaticField label="Phone Number" value={user.phone} />

        {/* ROLE */}
        
      </div>

      {editing && (
        <div className="mt-8 flex gap-4">
          <button
            onClick={saveProfile}
            disabled={loading}
            className="bg-brandPink text-white px-6 py-2 rounded-lg font-semibold"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => setEditing(false)}
            className="px-6 py-2 rounded-lg border"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- REUSABLE FIELDS ---------------- */

type ProfileFieldProps = {
  label: string;
  value: string;
  editing: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
};

function ProfileField({
  label,
  value,
  editing,
  onChange,
  placeholder,
}: ProfileFieldProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>

      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brandPink/30"
        />
      ) : (
        <p className="font-semibold">
          {value || <span className="text-gray-400">Not provided</span>}
        </p>
      )}
    </div>
  );
}


function StaticField({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}

function SidebarBtn({ active, children, ...props }: any) {
  return (
    <button
      {...props}
      className={`w-full text-left px-4 py-2 rounded ${
        active
          ? "bg-brandPink text-white"
          : "hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------- ORDERS SHORTCUT ---------------- */

function OrdersShortcut() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      <p className="text-gray-600 mb-6">
        View your order history, track deliveries and manage returns.
      </p>

      <button
        onClick={() => router.push("/orders")}
        className="bg-brandPink text-white px-6 py-3 rounded-lg font-semibold hover:bg-brandPinkLight"
      >
        View Orders
      </button>
    </div>
  );
}
