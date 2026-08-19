"use client";

import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, BookOpen, X, Check, Upload, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface BlogPost {
  id: string;
  title: string;
  slug: string | null;
  content: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function BlogPostsAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    description: "",
    image_url: ""
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await fetch("/api/admin/blog-posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
    } finally {
      setLoading(false);
    }
  }

  function openForm(post?: BlogPost) {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug || "",
        content: post.content || "",
        description: post.description || "",
        image_url: post.image_url || ""
      });
    } else {
      setEditingPost(null);
      setFormData({ title: "", slug: "", content: "", description: "", image_url: "" });
    }
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setShowForm(false);
    setEditingPost(null);
    setFormData({ title: "", slug: "", content: "", description: "", image_url: "" });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }));
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({ 
      ...formData, 
      title,
      slug: generateSlug(title)
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingPost ? "PUT" : "POST";
      const body = editingPost 
        ? { ...formData, id: editingPost.id }
        : formData;

      const response = await fetch("/api/admin/blog-posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchPosts();
        closeForm();
      }
    } catch (err) {
      console.error("Failed to save blog post:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const response = await fetch(`/api/admin/blog-posts?id=${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to delete blog post:", err);
    }
  }

  async function toggleActive(post: BlogPost) {
    try {
      const response = await fetch("/api/admin/blog-posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, is_active: !post.is_active })
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Failed to toggle blog post status:", err);
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
            <BookOpen className="w-8 h-8 text-blue-600" />
            Blog Posts
          </h1>
          <p className="text-slate-500 mt-1">Manage blog post content and visibility</p>
        </div>
        {!showForm && (
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
          >
            <Plus className="w-5 h-5" />
            Add Blog Post
          </button>
        )}
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
                {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
              </h2>
              <button 
                onClick={closeForm}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20"
                    placeholder="Enter blog post title"
                  />
                    {formData.slug && (
                      <p className="text-xs text-slate-500 mt-2">
                        URL: <span className="text-blue-600 font-medium">/blog/{formData.slug}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">
                      Card Display Image
                    </label>
                    <div className="flex items-start gap-4">
                      {formData.image_url ? (
                        <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-slate-200">
                          <img 
                            src={formData.image_url} 
                            alt="Card Preview" 
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-1 bg-white shadow-md rounded-full text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-navy/20 transition-all">
                          {uploading ? (
                            <Loader2 className="w-8 h-8 text-navy animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-slate-400 mb-2" />
                              <span className="text-xs font-medium text-slate-500 text-center px-2">
                                Click to upload card image
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
                      <div className="flex-1 text-xs text-slate-500 space-y-2">
                        <p>• This image will be shown on the blog list cards.</p>
                        <p>• Recommended size: 800x600px or 4:3 aspect ratio.</p>
                        <p>• Max file size: 5MB.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">
                      Description
                    </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
                    placeholder="Brief description for SEO and previews"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy mb-2">
                    Content (Rich Text)
                  </label>
                  <RichTextEditor 
                    content={formData.content} 
                    onChange={(content) => setFormData({ ...formData, content })} 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-8 py-4 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-all disabled:opacity-50 shadow-lg shadow-navy/20"
                >
                  {saving ? "Saving..." : editingPost ? "Update Post" : "Publish Post"}
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

      {posts.length === 0 ? (
        <div className="bg-slate-50 rounded-3xl p-16 text-center">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-navy mb-2">No Blog Posts Yet</h3>
          <p className="text-slate-500 mb-6">Add your first blog post to share updates with your customers</p>
          {!showForm && (
            <button
              onClick={() => openForm()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-2xl font-bold hover:bg-navy/90 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add Blog Post
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl border p-4 flex items-center justify-between gap-4 transition-all ${post.is_active ? "border-slate-100 hover:border-slate-200 shadow-sm" : "border-red-100 opacity-60 bg-red-50/10"}`}
            >
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-navy truncate">
                    {post.title}
                  </h3>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {post.is_active ? "Active" : "Draft"}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="font-medium text-blue-600">/blog/{post.slug}</span>
                  <span>•</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(post)}
                  className={`p-2.5 rounded-xl font-bold text-sm transition-all ${post.is_active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                  title={post.is_active ? "Deactivate" : "Activate"}
                >
                  {post.is_active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openForm(post)}
                  className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
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
