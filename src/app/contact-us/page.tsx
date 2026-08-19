"use client";

import React, { useState } from "react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", reason: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-grow pt-64 lg:pt-80 pb-20">
        <div className="container mx-auto px-5 lg:px-8 max-w-[1200px]">
          {/* Header Section */}
          <div className="flex flex-col items-center justify-center text-center mb-20">
            <h1 className="text-5xl lg:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8 max-w-4xl">
              Get in <span className="text-[#ff0000]">Touch</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-500 max-w-3xl mx-auto">
              Have questions about our products or need technical support? Our team is here to help you find the perfect laptop.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Side: Info */}
            <div className="space-y-12">
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#ff0000] flex-shrink-0 border border-slate-100">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</h3>
                    <p className="text-xl font-bold text-slate-900">lapzen.store@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#ff0000] flex-shrink-0 border border-slate-100">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Call Us</h3>
                    <p className="text-xl font-bold text-slate-900">+92 309 0009022</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#ff0000] flex-shrink-0 border border-slate-100">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Visit Us</h3>
                    <p className="text-xl font-bold text-slate-900 text-pretty">Hafeez Centre Lahore</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="bg-slate-50 rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm relative overflow-hidden">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h2>
                  <p className="text-slate-500 mb-8 max-w-xs">
                    Thank you for reaching out. We&apos;ll get back to you at lapzen.store@gmail.com soon.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="bg-[#ff0000] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-8 uppercase tracking-tight">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Full Name</label>
                        <input 
                          type="text"
                          name="name"
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Email Address</label>
                        <input 
                          type="email"
                          name="email"
                          required
                          placeholder="john@gmail.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Contact No</label>
                      <input 
                        type="tel"
                        name="phone"
                        required
                        placeholder="+92 XXX XXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Reason of Contact</label>
                      <textarea 
                        name="reason"
                        required
                        rows={4}
                        placeholder="Tell us how we can help..."
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff0000]/20 focus:border-[#ff0000] transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm font-medium">{error}</p>
                    )}

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#ff0000] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
