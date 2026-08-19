"use client";

import React, { useState } from "react";

const WarrantyTabs = () => {
  const [activeTab, setActiveTab] = useState<"warranty" | "returns" | "shipping">("warranty");

  const tabs = [
    { id: "warranty", label: "Warranty" },
    { id: "returns", label: "Returns" },
    { id: "shipping", label: "Shipping" },
  ] as const;

  return (
    <section className="bg-white py-24 px-6 font-sans antialiased">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-[#00172E] mb-6 tracking-tight uppercase">Policies & Warranty</h2>
          <div className="w-24 h-1 bg-[#00172E] mx-auto mb-6"></div>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Everything you need to know about our service standards, delivery protocols, and product guarantees.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-10 py-4 rounded-xl text-[14px] font-bold uppercase tracking-widest transition-all duration-500 ${
                activeTab === tab.id
                  ? "bg-[#00172E] text-white shadow-xl translate-y-[-4px]"
                  : "bg-slate-50 text-slate-400 hover:text-[#00172E] hover:bg-slate-100 border border-slate-100"
              }`}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white p-10 md:p-20 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-50 min-h-[600px] transition-all duration-500">
            {activeTab === "warranty" && (
              <div role="tabpanel" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <span className="text-[#00172E] font-bold text-2xl">W</span>
                    </div>
                    <h3 className="text-4xl font-bold text-[#00172E] tracking-tight">Product Warranty</h3>
                </div>
                
                <p className="text-slate-600 text-xl mb-12 leading-relaxed font-light">
                  At Lapzen, we stand behind the quality of our laptops. All our products come with a comprehensive warranty to ensure your peace of mind.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#00172E]/20 transition-colors">
                        <h4 className="text-[20px] font-bold text-[#00172E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00172E] rounded-full"></span>
                            Coverage Period
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Standard warranty: 1 year from date of purchase</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Extended warranty options available for power users</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Covers manufacturing defects and workmanship</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#00172E]/20 transition-colors">
                        <h4 className="text-[20px] font-bold text-[#00172E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00172E] rounded-full"></span>
                            What's Covered
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Internal hardware failures</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Screen and display issues (non-accidental)</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Battery defects within first 6 months</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 p-10 bg-[#00172E] text-white rounded-3xl shadow-xl shadow-[#00172E]/10">
                    <h4 className="text-[20px] font-bold text-white mb-4 uppercase tracking-widest">How to claim:</h4>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Contact our dedicated support team at <strong className="text-white">support@lapzen.com</strong> with your order ID and a brief description of the issue. Most claims are processed within 48 hours.
                    </p>
                </div>
              </div>
            )}

            {activeTab === "returns" && (
              <div role="tabpanel" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <span className="text-[#00172E] font-bold text-2xl">R</span>
                    </div>
                    <h3 className="text-4xl font-bold text-[#00172E] tracking-tight">Return Policy</h3>
                </div>
                
                <p className="text-slate-600 text-xl mb-12 leading-relaxed font-light">
                  We want you to be completely satisfied with your Lapzen purchase. If it's not the right fit, our return process is straightforward.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#00172E]/20 transition-colors">
                        <h4 className="text-[20px] font-bold text-[#00172E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00172E] rounded-full"></span>
                            Return Window
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>7-day checking warranty for all orders</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Items must be in original condition</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>All original packaging and accessories included</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#00172E]/20 transition-colors">
                        <h4 className="text-[20px] font-bold text-[#00172E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00172E] rounded-full"></span>
                            Refund Process
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Full refund to original payment method</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Bank transfer for Cash on Delivery orders</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Refunds processed within 3-5 business days</span>
                            </li>
                        </ul>
                    </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div role="tabpanel" className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <span className="text-[#00172E] font-bold text-2xl">S</span>
                    </div>
                    <h3 className="text-4xl font-bold text-[#00172E] tracking-tight">Shipping & Delivery</h3>
                </div>
                
                <p className="text-slate-600 text-xl mb-12 leading-relaxed font-light">
                  We deliver nationwide across Pakistan with premium logistics partners to ensure your high-value purchase arrives safely.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#00172E]/20 transition-colors">
                        <h4 className="text-[20px] font-bold text-[#00172E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00172E] rounded-full"></span>
                            Delivery Times
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Major cities: 2-3 business days</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Other regions: 4-5 business days</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Same day delivery available in Lahore</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-[#00172E]/20 transition-colors">
                        <h4 className="text-[20px] font-bold text-[#00172E] mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-[#00172E] rounded-full"></span>
                            Safety & Insurance
                        </h4>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>All shipments are 100% insured</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Double-layered secure packaging</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-600 text-lg">
                                <div className="mt-2 w-2 h-2 rounded-full bg-[#00172E] shrink-0" />
                                <span>Real-time SMS tracking updates</span>
                            </li>
                        </ul>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WarrantyTabs;


