"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Loader2, Plus, Edit, Trash2, GripHorizontal, Search, ChevronDown, Settings2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { applyWatermark } from "@/lib/image-utils";
import { CATEGORIES } from "@/lib/constants";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Reorder } from "framer-motion";

// ─── Variant Types ───────────────────────────────────────────────────────────
interface Variant {
  id: string;
  product_id: string;
  variant_type: "ram" | "storage";
  variant_value: string;
  price_adjustment: number;
}

const RAM_OPTIONS = ["4GB", "8GB", "16GB", "32GB", "64GB"];
const STORAGE_OPTIONS = ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "2TB SSD"];

function VariantManager({ productId, productTitle }: { productId: string; productTitle: string }) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(true);
  const [addingType, setAddingType] = useState<"ram" | "storage" | null>(null);
  const [newValue, setNewValue] = useState("");
  const [newAdj, setNewAdj] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVariants = async () => {
    setLoadingVariants(true);
    const res = await fetch(`/api/products/variants?product_id=${productId}`);
    const data = await res.json();
    if (Array.isArray(data)) setVariants(data);
    setLoadingVariants(false);
  };

  useEffect(() => { fetchVariants(); }, [productId]);

  const handleAdd = async () => {
    if (!addingType || !newValue.trim()) return;
    setSaving(true);
    await fetch('/api/products/variants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        variant_type: addingType,
        variant_value: newValue.trim(),
        price_adjustment: parseFloat(newAdj) || 0,
      }),
    });
    setAddingType(null);
    setNewValue("");
    setNewAdj("");
    setSaving(false);
    fetchVariants();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/products/variants?id=${id}`, { method: 'DELETE' });
    setDeletingId(null);
    fetchVariants();
  };

  const ramVariants = variants.filter(v => v.variant_type === "ram");
  const storageVariants = variants.filter(v => v.variant_type === "storage");

  const renderVariantGroup = (label: string, type: "ram" | "storage", group: Variant[], options: string[]) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label} Variants</span>
        <button
          type="button"
          onClick={() => { setAddingType(type); setNewValue(""); setNewAdj(""); }}
          className="flex items-center gap-1 text-xs font-bold text-navy hover:bg-navy/5 px-3 py-1.5 rounded-xl transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>

      {addingType === type && (
        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in slide-in-from-top-2 duration-200">
          <div className="relative flex-1 min-w-[140px]">
            <select
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              className="w-full appearance-none px-4 py-3 pr-8 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-navy/10 text-sm font-medium text-navy"
            >
              <option value="">Select {label}</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <input
            type="number"
            placeholder="Price adjustment (e.g. 5000 or -3000)"
            value={newAdj}
            onChange={e => setNewAdj(e.target.value)}
            className="flex-1 min-w-[220px] px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-navy/10 text-sm font-medium text-navy"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={saving || !newValue}
              className="px-4 py-3 bg-navy text-white rounded-xl text-xs font-bold hover:bg-navy/90 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setAddingType(null)}
              className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {group.length === 0 ? (
        <p className="text-xs text-slate-400 italic px-1">No {label.toLowerCase()} variants added yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {group.map(v => (
            <div key={v.id} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-navy shadow-sm">
              <span>{v.variant_value}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${v.price_adjustment > 0 ? 'bg-emerald-50 text-emerald-600' : v.price_adjustment < 0 ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
                {v.price_adjustment > 0 ? `+Rs. ${v.price_adjustment.toLocaleString()}` : v.price_adjustment < 0 ? `-Rs. ${Math.abs(v.price_adjustment).toLocaleString()}` : 'No change'}
              </span>
              {deletingId === v.id ? (
                <>
                  <button type="button" onClick={() => handleDelete(v.id)} className="text-rose-500 hover:text-rose-600 font-black text-[10px]">Confirm</button>
                  <button type="button" onClick={() => setDeletingId(null)} className="text-slate-400 text-[10px]">Cancel</button>
                </>
              ) : (
                <button type="button" onClick={() => setDeletingId(v.id)} className="text-slate-300 hover:text-rose-400 transition-colors ml-1">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-4 p-6 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-6">
      <div className="flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-navy/60" />
        <span className="text-xs font-bold text-navy uppercase tracking-widest">Variants for: <span className="normal-case font-semibold">{productTitle}</span></span>
      </div>
      {loadingVariants ? (
        <div className="flex items-center gap-2 text-slate-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Loading variants…</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderVariantGroup("RAM", "ram", ramVariants, RAM_OPTIONS)}
          {renderVariantGroup("Storage", "storage", storageVariants, STORAGE_OPTIONS)}
        </div>
      )}
    </div>
  );
}

function LaptopForm({ 
  formData, 
  setFormData, 
  handleSubmit, 
  loading, 
  uploading, 
  editingId, 
  handleImageUpload, 
  removeImage,
  submitError
}: any) {
  const brands = ["Dell", "Lenovo", "HP", "Toshiba", "Asus", "Apple"];
  const series = [
    "HP Omen", "HP Zbook", "HP Elitebook", 
    "Dell Precision", "Dell Latitude", "Dell XPS", 
      "Lenovo Legion", "Lenovo ThinkPad", "Lenovo Thinkbook", "Lenovo Yoga",
    "Apple Macbook", "Toshiba", "Asus"
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl mb-12 border border-slate-100 shadow-xl shadow-slate-200/50 animate-in slide-in-from-top-4 duration-300">
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-sm font-bold text-red-600">❌ Error: {submitError}</p>
          <p className="text-xs text-red-500 mt-1">Check the browser console for more details.</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Product Information</label>
            <div className="space-y-4">
              <input 
                required
                type="text" 
                placeholder="Product Title"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all font-medium" 
              />
              <select 
                required
                value={formData.brand} 
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all appearance-none"
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
              <input 
                required
                type="number" 
                placeholder="Price (Rs.)"
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all font-bold text-navy" 
              />
              <div className="grid grid-cols-2 gap-3">
                <select 
                  value={formData.discount_type}
                  onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all appearance-none font-bold text-red-600"
                >
                  <option value="percentage">% Discount</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                <input 
                  type="number" 
                  placeholder={formData.discount_type === "percentage" ? "Discount %" : "Discount Rs."}
                  value={formData.discount_value} 
                  onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                  min="0"
                  step="0.5"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all font-bold text-red-600" 
                />
              </div>
              {formData.price && formData.discount_value && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Price Preview</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-600">Original:</span>
                    <span className="text-base font-bold text-navy">Rs. {Number(formData.price).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-emerald-600">Discounted:</span>
                    <span className="text-lg font-bold text-emerald-600">
                      Rs. {
                        formData.discount_type === "percentage"
                          ? Math.max(0, Number(formData.price) - (Number(formData.price) * (Number(formData.discount_value) / 100))).toLocaleString()
                          : Math.max(0, Number(formData.price) - Number(formData.discount_value)).toLocaleString()
                      }
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Savings: Rs. {
                      formData.discount_type === "percentage"
                        ? Math.round(Number(formData.price) * (Number(formData.discount_value) / 100)).toLocaleString()
                        : Number(formData.discount_value).toLocaleString()
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Product Description</label>
            <RichTextEditor 
              content={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>

            <div className="grid grid-cols-2 gap-4">
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all appearance-none"
              >
                <option value="">Select Category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select 
                required
                value={formData.series} 
                onChange={(e) => setFormData({...formData, series: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all appearance-none"
              >
                <option value="">Select Series</option>
                {series.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

          <div className="flex gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.new_arrival ? 'bg-[#00172E] border-[#00172E]' : 'border-slate-300 bg-white group-hover:border-[#00172E]/50'}`}>
                {formData.new_arrival && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={formData.new_arrival} 
                onChange={(e) => setFormData({...formData, new_arrival: e.target.checked})}
              />
              <span className="text-sm font-bold text-[#00172E]">New Arrival</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.featured ? 'bg-[#00172E] border-[#00172E]' : 'border-slate-300 bg-white group-hover:border-[#00172E]/50'}`}>
                {formData.featured && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={formData.featured} 
                onChange={(e) => setFormData({...formData, featured: e.target.checked})}
              />
              <span className="text-sm font-bold text-[#00172E]">Featured</span>
            </label>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Technical Specifications</label>
            <div className="grid grid-cols-2 gap-4">
              <input 
                required
                type="text" 
                placeholder="RAM"
                value={formData.specs.ram} 
                onChange={(e) => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none" 
              />
              <input 
                required
                type="text" 
                placeholder="Storage"
                value={formData.specs.storage} 
                onChange={(e) => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none" 
              />
              <input 
                required
                type="text" 
                placeholder="Processor"
                value={formData.specs.processor} 
                onChange={(e) => setFormData({...formData, specs: {...formData.specs, processor: e.target.value}})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none" 
              />
              <input 
                required
                type="text" 
                placeholder="Display"
                value={formData.specs.display} 
                onChange={(e) => setFormData({...formData, specs: {...formData.specs, display: e.target.value}})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none" 
              />
            </div>
          </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Images ({formData.image_urls.length}/5) - Drag to reorder</label>
                {uploading && <Loader2 className="w-4 h-4 animate-spin text-navy" />}
              </div>
              <Reorder.Group 
                axis="x" 
                values={formData.image_urls} 
                onReorder={(newOrder) => setFormData({ ...formData, image_urls: newOrder })}
                className="grid grid-cols-5 gap-3"
              >
                {formData.image_urls.map((url: string, i: number) => (
                  <Reorder.Item 
                    key={url} 
                    value={url}
                    className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden group border border-slate-100 cursor-grab active:cursor-grabbing"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover pointer-events-none select-none" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <GripHorizontal className="w-6 h-6 text-white/50" />
                    </div>
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 bg-navy text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Display</div>
                    )}
                    {i === 1 && (
                      <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Hover</div>
                    )}
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-white shadow-md p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-500 z-10"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Reorder.Item>
                ))}
                {formData.image_urls.length < 5 && (
                  <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-navy/20 hover:bg-slate-100/50 transition-all">
                    <Upload className="w-5 h-5 text-slate-400" />
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </Reorder.Group>
            </div>

          <div className="pt-4">
              <button 
                disabled={loading || uploading}
                type="submit"
                className="w-full bg-navy text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-navy/90 transition-all disabled:opacity-50 shadow-xl shadow-navy/20"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : editingId ? "Update Laptop Details" : "Publish Laptop to Store"}
              </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [managingVariantsId, setManagingVariantsId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount_type: "percentage",
    discount_value: "",
    brand: "",
    category: "",
    series: "",
    type: "laptop",
    new_arrival: false,
    featured: false,
    specs: { ram: "", storage: "", processor: "", display: "" },
    image_urls: [] as string[],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      discount_type: product.discount_type || "percentage",
      discount_value: product.discount_value?.toString() || "",
      brand: product.brand || "",
      category: product.category || "",
      series: product.series || "",
      type: product.type || "laptop",
      new_arrival: !!product.new_arrival,
      featured: !!product.featured,
      specs: {
        ram: product.specs?.ram || "",
        storage: product.specs?.storage || "",
        processor: product.specs?.processor || "",
        display: product.specs?.display || "",
      },
      image_urls: Array.isArray(product.image_urls) ? product.image_urls : [],
    });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (formData.image_urls.length + files.length > 5) {
      alert("Maximum 5 images allowed.");
      return;
    }
    setUploading(true);
    const newUrls = [...formData.image_urls];
    try {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        
        // Apply watermark
        try {
          file = await applyWatermark(file);
        } catch (error) {
          console.error("Watermark error:", error);
          // Continue with original file if watermark fails
        }

        const fileName = `${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage.from('product-images').upload(`products/${fileName}`, file);
        if (error) throw error;
        if (data) {
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(`products/${fileName}`);
          newUrls.push(publicUrl);
        }
      }
      setFormData(prev => ({ ...prev, image_urls: newUrls }));
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (formData.image_urls.length === 0) {
      alert("Please upload at least one image.");
      return;
    }
    setLoading(true);
    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';
      const payload = { 
        ...formData, 
        price: parseFloat(formData.price) || 0,
        discount_value: parseFloat(formData.discount_value) || 0,
      };
      
      console.log('Submitting payload:', payload);
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();
      
      if (!res.ok) {
        console.error('API error:', responseData);
        setSubmitError(responseData.error || `Server error: ${res.status}`);
        alert(`Error: ${responseData.error || 'Failed to save product'}`);
        return;
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({
        title: "", description: "", price: "", discount_type: "percentage", discount_value: "", brand: "", category: "", series: "",
        type: "laptop", new_arrival: false, featured: false,
        specs: { ram: "", storage: "", processor: "", display: "" }, image_urls: [],
      });
      fetchProducts();
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError(String(err));
      alert(`Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) { 
        setDeletingId(null); 
        fetchProducts(); 
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  const seriesOptions = Array.from(new Set(products.map(p => p.series).filter(Boolean))) as string[];

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase();
    return (
      product.title?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.series?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Inventory Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your laptop collection and stock</p>
        </div>
          <button 
            onClick={() => {
              if (isAdding) setEditingId(null);
              setIsAdding(!isAdding);
            }}
            className="bg-navy text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
          >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? "Cancel" : "Add Laptop"}
        </button>
      </div>

      {isAdding && (
        <LaptopForm 
          formData={formData} 
          setFormData={setFormData} 
          handleSubmit={handleSubmit}
          loading={loading} 
          uploading={uploading} 
          editingId={editingId}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          submitError={submitError}
        />
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products by name, brand, or series..."
            value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-navy/5 transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                    <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Product</th>
                    <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">RAM / Storage</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                  <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Price</th>
                  <th className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <React.Fragment key={product.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                            {product.image_urls?.[0] && <img src={product.image_urls[0]} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-bold text-navy leading-tight">{product.title}</p>
                            <p className="text-xs text-slate-400 mt-1">{product.brand} • {product.series}</p>
                          </div>
                        </div>
                      </td>
                          <td className="px-6 py-5">
                          <div className="space-y-1">
                            {product.specs?.ram && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">{product.specs.ram}</span>
                            )}
                            {product.specs?.storage && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 text-violet-700 text-[11px] font-bold border border-violet-100 ml-1">{product.specs.storage}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex gap-2">
                          {product.new_arrival && <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 uppercase">New</span>}
                          {product.featured && <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold border border-amber-100 uppercase">Featured</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-bold text-navy">Rs. {product.price?.toLocaleString()}</p>
                          {product.discount_value > 0 && (
                            <>
                              <p className="text-xs text-slate-500 line-through">
                                Rs. {product.price?.toLocaleString()}
                              </p>
                              <p className="text-sm font-bold text-emerald-600">
                                Rs. {(
                                  product.discount_type === "percentage"
                                    ? Math.max(0, product.price - (product.price * (product.discount_value / 100)))
                                    : Math.max(0, product.price - product.discount_value)
                                ).toLocaleString()}
                              </p>
                              <span className="inline-flex items-center w-fit px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold border border-red-100">
                                {product.discount_type === "percentage" ? `${product.discount_value}% OFF` : `Rs. ${product.discount_value} OFF`}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setManagingVariantsId(managingVariantsId === product.id ? null : product.id)}
                            className={`p-2.5 rounded-xl transition-all ${managingVariantsId === product.id ? 'text-navy bg-navy/10' : 'text-slate-400 hover:text-navy hover:bg-slate-50'}`}
                            title="Manage Variants"
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleEdit(product)} className="p-2.5 text-slate-400 hover:text-navy hover:bg-slate-50 rounded-xl transition-all"><Edit className="w-4 h-4" /></button>
                          {deletingId === product.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => deleteProduct(product.id)} className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded">Confirm</button>
                              <button onClick={() => setDeletingId(null)} className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeletingId(product.id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {managingVariantsId === product.id && (
                      <tr>
                          <td colSpan={5} className="px-6 pb-6">
                          <VariantManager productId={product.id} productTitle={product.title} />
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                      <p className="text-slate-400 text-sm">
                        {searchQuery ? `No products found matching "${searchQuery}"` : "No products in inventory yet"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
          </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === currentPage
                        ? "bg-navy text-white shadow-md shadow-navy/20"
                        : "border border-slate-100 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-100 text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
        </div>
      </div>
    
  );
}

