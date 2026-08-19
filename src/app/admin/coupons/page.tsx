"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  AlertCircle,
  Copy,
  ToggleLeft,
  ToggleRight,
  Zap,
  Users,
  CalendarClock,
  ShieldCheck,
  Gift,
  Percent,
  DollarSign,
  Truck,
  ChevronDown,
  RefreshCw,
  Package,
  Search,
} from "lucide-react";

export const dynamic = "force-dynamic";

type DiscountType = "percentage" | "fixed" | "free_shipping";

interface Product {
  id: string;
  title: string;
  brand: string;
  price: number;
  image_urls: string[];
}

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  usage_limit_total: number | null;
  usage_limit_per_user: number;
  times_used: number;
  is_active: boolean;
  is_auto_apply: boolean;
  first_time_only: boolean;
  starts_at: string | null;
  expires_at: string | null;
  product_id: string | null;
  product_ids: string[] | null;
  created_at: string;
  products?: { id: string; title: string } | null;
}

const EMPTY_FORM = {
  code: "",
  description: "",
  discount_type: "percentage" as DiscountType,
  discount_value: "",
  min_order_amount: "",
  max_discount_amount: "",
  usage_limit_total: "",
  usage_limit_per_user: "1",
  is_active: true,
  is_auto_apply: false,
  first_time_only: false,
  starts_at: "",
  expires_at: "",
  product_ids: [] as string[],
};

function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function toLocalDatetime(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function discountLabel(c: Coupon) {
  if (c.discount_type === "percentage") return `${c.discount_value}% OFF`;
  if (c.discount_type === "fixed") return `Rs. ${Number(c.discount_value).toLocaleString()} OFF`;
  return "Free Shipping";
}

function DiscountTypeIcon({ type }: { type: DiscountType }) {
  if (type === "percentage") return <Percent className="w-4 h-4" />;
  if (type === "fixed") return <DollarSign className="w-4 h-4" />;
  return <Truck className="w-4 h-4" />;
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        active
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : "bg-slate-50 text-slate-400 border-slate-100"
      }`}
    >
      {active ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Multi-Product Picker ───────────────────────────────────────────────────────
function ProductPicker({
  products,
  value,
  onChange,
}: {
  products: Product[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  const selectedProducts = products.filter((p) => value.includes(p.id));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 transition-all min-h-[48px]"
      >
        <span className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {selectedProducts.length === 0 ? (
            <span className="text-slate-400">Any product (applies to all)</span>
          ) : (
            <>
              {selectedProducts.slice(0, 3).map((p) => (
                <span key={p.id} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2 py-0.5 text-[11px] font-medium max-w-[160px] truncate">
                  {p.image_urls?.[0] && (
                    <img src={p.image_urls[0]} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
                  )}
                  <span className="truncate">{p.title}</span>
                </span>
              ))}
              {selectedProducts.length > 3 && (
                <span className="bg-slate-100 text-slate-500 rounded-lg px-2 py-0.5 text-[11px] font-bold">
                  +{selectedProducts.length - 3} more
                </span>
              )}
            </>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-50 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl flex-1">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-navy placeholder:text-slate-400"
              />
            </div>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-[11px] text-slate-400 hover:text-red-500 font-bold px-2 whitespace-nowrap transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* All-products option */}
          <div className="border-b border-slate-50">
            <button
              type="button"
              onClick={() => onChange([])}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors text-left ${value.length === 0 ? "bg-slate-50" : ""}`}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <span className="text-slate-500 italic">No restriction — applies to all products</span>
              {value.length === 0 && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
            </button>
          </div>

          <div className="overflow-y-auto max-h-72">
            {filtered.length === 0 && search && (
              <p className="px-4 py-3 text-sm text-slate-400 text-center">No products found</p>
            )}

            {filtered.map((p) => {
              const selected = value.includes(p.id);
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 transition-colors text-left ${selected ? "bg-indigo-50/50" : ""}`}
                >
                  {/* Checkbox */}
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${selected ? "bg-indigo-600 border-indigo-600" : "border-slate-200 bg-white"}`}>
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>

                  {p.image_urls?.[0] ? (
                    <img src={p.image_urls[0]} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-navy truncate">{p.title}</p>
                    <p className="text-[11px] text-slate-400">{p.brand} · Rs. {Number(p.price).toLocaleString()}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {value.length > 0 && (
            <div className="p-3 border-t border-slate-50 bg-indigo-50/50">
              <p className="text-[11px] text-indigo-600 font-bold text-center">
                {value.length} product{value.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "auto">("all");

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products?limit=200");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      else if (data?.products) setProducts(data.products);
    } catch {
      // non-fatal — product selector will just be empty
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, [fetchCoupons, fetchProducts]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
    setShowForm(true);
  }

  function openEdit(c: Coupon) {
    setEditingId(c.id);
    setForm({
      code: c.code,
      description: c.description || "",
      discount_type: c.discount_type,
      discount_value: c.discount_value !== undefined ? String(c.discount_value) : "",
      min_order_amount: c.min_order_amount ? String(c.min_order_amount) : "",
      max_discount_amount: c.max_discount_amount ? String(c.max_discount_amount) : "",
      usage_limit_total: c.usage_limit_total ? String(c.usage_limit_total) : "",
      usage_limit_per_user: c.usage_limit_per_user ? String(c.usage_limit_per_user) : "1",
      is_active: c.is_active,
      is_auto_apply: c.is_auto_apply,
      first_time_only: c.first_time_only,
      starts_at: toLocalDatetime(c.starts_at),
      expires_at: toLocalDatetime(c.expires_at),
      product_ids: c.product_ids ?? (c.product_id ? [c.product_id] : []),
    });
    setError(null);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload: Record<string, unknown> = {
      code: form.code,
      description: form.description || null,
      discount_type: form.discount_type,
      discount_value: form.discount_type === "free_shipping" ? 0 : Number(form.discount_value),
      min_order_amount: Number(form.min_order_amount) || 0,
      max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
      usage_limit_total: form.usage_limit_total ? Number(form.usage_limit_total) : null,
      usage_limit_per_user: Number(form.usage_limit_per_user) || 1,
      is_active: form.is_active,
      is_auto_apply: form.is_auto_apply,
      first_time_only: form.first_time_only,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      product_ids: form.product_ids.length > 0 ? form.product_ids : null,
      // keep product_id as first for backward compat
      product_id: form.product_ids.length === 1 ? form.product_ids[0] : null,
    };

    if (editingId) payload.id = editingId;

    try {
      const res = await fetch("/api/admin/coupons", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An error occurred.");
      } else {
        setSuccess(editingId ? "Coupon updated successfully." : "Coupon created successfully.");
        setShowForm(false);
        setEditingId(null);
        fetchCoupons();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(c: Coupon) {
    try {
      await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, is_active: !c.is_active }),
      });
      fetchCoupons();
    } catch {
      setError("Failed to update coupon.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirm(null);
        setSuccess("Coupon deleted.");
        fetchCoupons();
      }
    } catch {
      setError("Failed to delete coupon.");
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  const filtered = coupons.filter((c) => {
    if (filter === "active") return c.is_active;
    if (filter === "inactive") return !c.is_active;
    if (filter === "auto") return c.is_auto_apply;
    return true;
  });

  const stats = {
    total: coupons.length,
    active: coupons.filter((c) => c.is_active).length,
    auto: coupons.filter((c) => c.is_auto_apply).length,
    totalUses: coupons.reduce((a, c) => a + c.times_used, 0),
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <Tag className="w-8 h-8 text-purple-500" />
            Coupon Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and manage discount codes with spam protection</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-all"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-sm hover:bg-navy/90 transition-all shadow-sm shadow-navy/20"
          >
            <Plus className="w-4 h-4" />
            New Coupon
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl mb-6 text-red-600 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-6 text-emerald-600 text-sm font-medium">
          <Check className="w-4 h-4 shrink-0" />
          {success}
          <button onClick={() => setSuccess(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Coupons", value: stats.total, icon: <Tag className="w-5 h-5" />, color: "bg-purple-50 text-purple-500" },
          { label: "Active", value: stats.active, icon: <Check className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-500" },
          { label: "Auto-Apply", value: stats.auto, icon: <Zap className="w-5 h-5" />, color: "bg-amber-50 text-amber-500" },
          { label: "Total Uses", value: stats.totalUses, icon: <Users className="w-5 h-5" />, color: "bg-blue-50 text-blue-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-slate-400 text-xs font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-navy">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {(["all", "active", "inactive", "auto"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === f
                ? "bg-navy text-white shadow-sm"
                : "bg-white border border-slate-100 text-slate-500 hover:bg-slate-50"
            }`}
          >
            {f === "auto" ? "Auto-Apply" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Coupon Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3 text-slate-400">
            <Tag className="w-12 h-12 text-slate-200" />
            <p className="font-medium">No coupons found</p>
            <button onClick={openCreate} className="text-sm text-navy font-bold hover:underline">
              Create your first coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Code</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Discount</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:table-cell">Conditions</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Usage</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:table-cell">Expiry</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-navy bg-slate-100 px-2.5 py-1 rounded-lg text-sm tracking-widest">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="text-slate-300 hover:text-slate-500 transition-colors"
                          title="Copy code"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      {coupon.description && (
                        <p className="text-[11px] text-slate-400 mt-1 max-w-[160px] truncate">{coupon.description}</p>
                      )}
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        {coupon.is_auto_apply && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full font-bold uppercase">
                            <Zap className="w-2.5 h-2.5" /> Auto
                          </span>
                        )}
                        {coupon.first_time_only && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-pink-50 text-pink-600 border border-pink-100 rounded-full font-bold uppercase">
                            <Gift className="w-2.5 h-2.5" /> First-time
                          </span>
                        )}
                          {(coupon.product_ids && coupon.product_ids.length > 0) || coupon.product_id ? (
                            <span
                              className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full font-bold uppercase"
                            >
                              <Package className="w-2.5 h-2.5" />
                              {coupon.product_ids && coupon.product_ids.length > 1
                                ? `${coupon.product_ids.length} Products`
                                : coupon.products?.title
                                  ? coupon.products.title.length > 20
                                    ? coupon.products.title.slice(0, 20) + "…"
                                    : coupon.products.title
                                  : "Product Only"}
                            </span>
                          ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${
                          coupon.discount_type === "percentage" ? "bg-purple-50 text-purple-500" :
                          coupon.discount_type === "fixed" ? "bg-blue-50 text-blue-500" :
                          "bg-teal-50 text-teal-500"
                        }`}>
                          <DiscountTypeIcon type={coupon.discount_type} />
                        </span>
                        <div>
                          <p className="font-bold text-navy text-sm">{discountLabel(coupon)}</p>
                          {coupon.min_order_amount > 0 && (
                            <p className="text-[10px] text-slate-400">Min: Rs. {Number(coupon.min_order_amount).toLocaleString()}</p>
                          )}
                          {coupon.max_discount_amount && (
                            <p className="text-[10px] text-slate-400">Cap: Rs. {Number(coupon.max_discount_amount).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Users className="w-3 h-3 text-slate-300" />
                          {coupon.usage_limit_per_user}x per user
                        </div>
                        {coupon.usage_limit_total && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <ShieldCheck className="w-3 h-3 text-slate-300" />
                            Max {coupon.usage_limit_total} total
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-5 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 bg-navy rounded-full"
                            style={{
                              width: coupon.usage_limit_total
                                ? `${Math.min(100, (coupon.times_used / coupon.usage_limit_total) * 100)}%`
                                : "0%",
                            }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                          {coupon.times_used}{coupon.usage_limit_total ? `/${coupon.usage_limit_total}` : ""} uses
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 hidden lg:table-cell">
                      {coupon.expires_at ? (
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <CalendarClock className="w-3 h-3 text-slate-300" />
                          <span className={new Date(coupon.expires_at) < new Date() ? "text-red-400 font-bold" : "text-slate-500"}>
                            {new Date(coupon.expires_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-300">No expiry</span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <button onClick={() => toggleActive(coupon)} title="Toggle active">
                        <StatusBadge active={coupon.is_active} />
                      </button>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-500 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {deleteConfirm === coupon.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(coupon.id)}
                              className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all text-[10px] font-bold px-3"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 bg-slate-50 text-slate-400 rounded-xl transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(coupon.id)}
                            className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between p-8 pb-0">
              <h2 className="text-2xl font-bold text-navy">
                {editingId ? "Edit Coupon" : "Create Coupon"}
              </h2>
              <button
                onClick={() => { setShowForm(false); setError(null); }}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* Code */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_\-]/g, "") })}
                    placeholder="e.g. SAVE20"
                    required
                    maxLength={32}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-mono font-bold text-navy tracking-widest focus:outline-none focus:ring-2 focus:ring-navy/10 text-sm bg-slate-50"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, code: generateCode() })}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs whitespace-nowrap transition-all"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description (optional)</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Internal note or customer-facing label"
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Discount Type</label>
                  <div className="relative">
                    <select
                      value={form.discount_type}
                      onChange={(e) => setForm({ ...form, discount_type: e.target.value as DiscountType })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50 appearance-none cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (Rs.)</option>
                      <option value="free_shipping">Free Shipping</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {form.discount_type !== "free_shipping" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      {form.discount_type === "percentage" ? "Percentage (%)" : "Amount (Rs.)"}
                    </label>
                    <input
                      type="number"
                      value={form.discount_value}
                      onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                      min="0"
                      max={form.discount_type === "percentage" ? "100" : undefined}
                      step="0.01"
                      required
                      placeholder={form.discount_type === "percentage" ? "e.g. 15" : "e.g. 500"}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                    />
                  </div>
                )}
              </div>

              {/* Min Order / Max Discount Cap */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Min Order Amount (Rs.)</label>
                  <input
                    type="number"
                    value={form.min_order_amount}
                    onChange={(e) => setForm({ ...form, min_order_amount: e.target.value })}
                    min="0"
                    placeholder="0 = no minimum"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                  />
                </div>
                {form.discount_type === "percentage" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Max Discount Cap (Rs.)</label>
                    <input
                      type="number"
                      value={form.max_discount_amount}
                      onChange={(e) => setForm({ ...form, max_discount_amount: e.target.value })}
                      min="0"
                      placeholder="Leave blank = no cap"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                    />
                  </div>
                )}
              </div>

              {/* Usage Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Usage Limit</label>
                  <input
                    type="number"
                    value={form.usage_limit_total}
                    onChange={(e) => setForm({ ...form, usage_limit_total: e.target.value })}
                    min="1"
                    placeholder="Blank = unlimited"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Uses Per Customer</label>
                  <input
                    type="number"
                    value={form.usage_limit_per_user}
                    onChange={(e) => setForm({ ...form, usage_limit_per_user: e.target.value })}
                    min="1"
                    placeholder="1"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Start Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Expiry Date (optional)</label>
                  <input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-navy/10 bg-slate-50"
                  />
                </div>
              </div>

              {/* Product Restriction */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    Product Restriction
                    <span className="normal-case font-normal text-slate-400 tracking-normal">(optional)</span>
                  </span>
                </label>
                  <ProductPicker
                    products={products}
                    value={form.product_ids}
                    onChange={(ids) => setForm({ ...form, product_ids: ids })}
                  />
                  {form.product_ids.length > 0 && (
                    <p className="mt-1.5 text-[11px] text-indigo-500 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Coupon valid only when one of the selected {form.product_ids.length} product{form.product_ids.length !== 1 ? "s" : ""} is in the cart
                    </p>
                  )}
              </div>

              {/* Toggles */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Coupon Behaviour</p>

                <ToggleRow
                  label="Active"
                  description="Coupon is live and can be used by customers"
                  value={form.is_active}
                  onChange={(v) => setForm({ ...form, is_active: v })}
                  icon={<Check className="w-4 h-4" />}
                  color="text-emerald-500"
                />

                <ToggleRow
                  label="Auto-Apply"
                  description="Automatically applied at checkout (no code needed)"
                  value={form.is_auto_apply}
                  onChange={(v) => setForm({ ...form, is_auto_apply: v })}
                  icon={<Zap className="w-4 h-4" />}
                  color="text-amber-500"
                />

                <ToggleRow
                  label="First-Time Customers Only"
                  description="Only valid for customers with no prior orders"
                  value={form.first_time_only}
                  onChange={(v) => setForm({ ...form, first_time_only: v })}
                  icon={<Gift className="w-4 h-4" />}
                  color="text-pink-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(null); }}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-navy text-white rounded-xl font-bold text-sm hover:bg-navy/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Saving...</>
                  ) : (
                    <><Check className="w-4 h-4" /> {editingId ? "Update Coupon" : "Create Coupon"}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
  icon,
  color,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className={color}>{icon}</span>
        <div>
          <p className="text-sm font-bold text-navy">{label}</p>
          <p className="text-[11px] text-slate-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className="shrink-0"
      >
        {value ? (
          <ToggleRight className="w-9 h-9 text-navy" />
        ) : (
          <ToggleLeft className="w-9 h-9 text-slate-300" />
        )}
      </button>
    </div>
  );
}
