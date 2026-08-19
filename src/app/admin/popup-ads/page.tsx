"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Megaphone, X, Check, Upload, Loader2, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface PopupAd {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  is_active: boolean;
  created_at: string;
}

const emptyForm = {
  title: "",
  description: "",
  image_url: "",
  link_url: "",
  is_active: true,
};

export default function PopupAdsAdmin() {
  const [ads, setAds] = useState<PopupAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<PopupAd | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const response = await fetch("/api/admin/popup-ads");
      if (response.ok) {
        const data = await response.json();
        setAds(data);
      }
    } catch (err) {
      console.error("Failed to fetch popup ads:", err);
    } finally {
      setLoading(false);
    }
  }

  function openForm(ad?: PopupAd) {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description || "",
        image_url: ad.image_url || "",
        link_url: ad.link_url || "",
        is_active: ad.is_active,
      });
    } else {
      setEditingAd(null);
      setFormData({ ...emptyForm });
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingAd(null);
    setFormData({ ...emptyForm });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `popup-ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("popup-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("popup-images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      alert(`Error uploading image: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingAd ? "PUT" : "POST";
      const body = editingAd ? { ...formData, id: editingAd.id } : formData;

      const response = await fetch("/api/admin/popup-ads", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchAds();
        closeForm();
      } else {
        const err = await response.json();
        alert(err.error || "Failed to save");
      }
    } catch (err) {
      console.error("Failed to save popup ad:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this popup ad?")) return;
    try {
      const response = await fetch(`/api/admin/popup-ads?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchAds();
    } catch (err) {
      console.error("Failed to delete popup ad:", err);
    }
  }

  async function toggleActive(ad: PopupAd) {
    try {
      const response = await fetch("/api/admin/popup-ads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ad.id, is_active: !ad.is_active }),
      });
      if (response.ok) fetchAds();
    } catch (err) {
      console.error("Failed to toggle popup ad status:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-orange-500" />
            Popup Ads
          </h1>
          <p className="text-slate-500 mt-1">
            Create and manage popup advertisements shown on the homepage
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
          >
            <Plus className="w-5 h-5" />
            Add Popup Ad
          </button>
        )}
      </div>

      {/* Info banner */}
      <div className="mb-6 bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 items-start">
        <Megaphone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-orange-700">
          Only the <span className="font-bold">most recently updated active</span> popup ad is shown on the homepage. It appears once per session and can be dismissed with the close button.
        </p>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy">
                {editingAd ? "Edit Popup Ad" : "Add New Popup Ad"}
              </h2>
              <button
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-navy mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="e.g. Summer Sale – Up to 30% Off!"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-navy mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                  placeholder="Write the ad body text here..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-navy mb-2">
                  Ad Image
                </label>
                <div className="flex items-start gap-4">
                  {formData.image_url ? (
                    <div className="relative w-48 h-36 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                      <img
                        src={formData.image_url}
                        alt="Ad Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image_url: "" }))
                        }
                        className="absolute top-2 right-2 p-1 bg-white shadow-md rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-48 h-36 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-navy/20 transition-all">
                      {uploading ? (
                        <Loader2 className="w-8 h-8 text-navy animate-spin" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <span className="text-xs font-medium text-slate-500 text-center px-2">
                            Click to upload image
                          </span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                  <div className="flex-1 text-xs text-slate-500 space-y-1.5">
                    <p>• Recommended size: 600×400px or wider banner.</p>
                    <p>• Supported formats: JPG, PNG, WebP.</p>
                    <p>• Max file size: 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-bold text-navy mb-2 flex items-center gap-1">
                  <LinkIcon className="w-4 h-4" />
                  CTA Link URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) =>
                    setFormData({ ...formData, link_url: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20"
                  placeholder="https://lapzen.pk/catalog?sale=true"
                />
                <p className="text-xs text-slate-400 mt-1">
                  If provided, clicking the ad image will navigate to this URL.
                </p>
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: !prev.is_active,
                    }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${formData.is_active ? "bg-green-500" : "bg-slate-200"}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.is_active ? "translate-x-7" : "translate-x-1"}`}
                  />
                </button>
                <span className="text-sm font-medium text-slate-600">
                  {formData.is_active ? "Active – will be shown on homepage" : "Inactive – hidden from homepage"}
                </span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 px-8 py-4 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-all disabled:opacity-50 shadow-lg shadow-navy/20"
                >
                  {saving ? "Saving..." : editingAd ? "Update Popup Ad" : "Create Popup Ad"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {ads.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-16 text-center">
          <Megaphone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2">No Popup Ads Yet</h3>
          <p className="text-slate-500 mb-6">
            Create your first popup ad to promote offers on the homepage
          </p>
          {!showForm && (
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Popup Ad
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {ads.map((ad) => (
            <motion.div
              key={ad.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all ${
                ad.is_active
                  ? "border-slate-100 hover:border-slate-200 shadow-sm"
                  : "border-red-100 opacity-60 bg-red-50/10"
              }`}
            >
              {/* Thumbnail */}
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                {ad.image_url ? (
                  <img
                    src={ad.image_url}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-navy truncate">{ad.title}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                      ad.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {ad.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                {ad.description && (
                  <p className="text-xs text-slate-500 truncate">
                    {ad.description}
                  </p>
                )}
                {ad.link_url && (
                  <p className="text-xs text-blue-500 truncate mt-0.5">
                    {ad.link_url}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(ad)}
                  className={`p-2.5 rounded-xl font-bold text-sm transition-all ${
                    ad.is_active
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                  title={ad.is_active ? "Deactivate" : "Activate"}
                >
                  {ad.is_active ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => openForm(ad)}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(ad.id)}
                  className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
