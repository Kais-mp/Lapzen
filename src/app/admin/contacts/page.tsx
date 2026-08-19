"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, User, Calendar, Trash2, MessageSquare, Search, Filter, ChevronRight, UserCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"inquiries" | "customers">("inquiries");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      if (data.submissions) setSubmissions(data.submissions);
      if (data.customers) setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load contact data");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, type: "submission" | "customer") {
    if (!confirm(`Are you sure you want to delete this ${type === "submission" ? "inquiry" : "customer"}?`)) return;

    try {
      const res = await fetch(`/api/admin/contacts?id=${id}&type=${type}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`${type === "submission" ? "Inquiry" : "Customer"} deleted successfully`);
        fetchData();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred");
    }
  }

  const filteredSubmissions = submissions.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(c => 
    c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Contacts & Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage contact inquiries and your customer base</p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-navy transition-colors" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl w-full md:w-[300px] outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100/50 rounded-2xl w-fit mb-8 border border-slate-100">
        <button
          onClick={() => { setActiveTab("inquiries"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "inquiries" 
              ? "bg-white text-navy shadow-sm" 
              : "text-slate-500 hover:text-navy"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Inquiries
          <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'inquiries' ? 'bg-navy/10 text-navy' : 'bg-slate-200 text-slate-500'}`}>
            {submissions.length}
          </span>
        </button>
        <button
          onClick={() => { setActiveTab("customers"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "customers" 
              ? "bg-white text-navy shadow-sm" 
              : "text-slate-500 hover:text-navy"
          }`}
        >
          <User className="w-4 h-4" />
          Customers
          <span className={`ml-1 px-2 py-0.5 rounded-md text-[10px] ${activeTab === 'customers' ? 'bg-navy/10 text-navy' : 'bg-slate-200 text-slate-500'}`}>
            {customers.length}
          </span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="p-12 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeTab === "inquiries" ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Sender</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Inquiry Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Received</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageSquare className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-medium">No inquiries found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((s) => (
                      <tr key={s.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy font-bold text-xs">
                              {s.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-navy">{s.name}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {s.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="max-w-[400px]">
                            <p className="text-sm text-navy font-medium line-clamp-1">{s.reason?.split('\n')[0]}</p>
                            <p className="text-xs text-slate-400 line-clamp-1 mt-1">{s.reason}</p>
                            {s.phone && (
                              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1.5 font-medium">
                                <Phone className="w-2.5 h-2.5" /> {s.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500 font-medium">
                              {new Date(s.created_at).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(s.id, "submission")}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Customer</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Account Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Joined Date</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-24 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-8 h-8 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-medium">No customers found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr key={c.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-navy">{c.full_name || c.username || 'Unnamed User'}</p>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {c.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                c.role === 'admin' 
                                  ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                                  : 'bg-blue-50 text-blue-600 border border-blue-100'
                              }`}>
                                {c.role || 'customer'}
                              </span>
                              {c.is_verified && (
                                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                                  <UserCheck className="w-2.5 h-2.5" /> Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-1">ID: {c.id.slice(0, 8)}...</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs text-slate-500 font-medium">
                            {new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(c.id, "customer")}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            disabled={c.role === 'admin'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-navy rounded-2xl flex items-center justify-center text-white">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Inquiries</p>
            <p className="text-2xl font-bold text-navy">{submissions.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Customers</p>
            <p className="text-2xl font-bold text-navy">{customers.length}</p>
          </div>
        </div>
        <div className="bg-navy p-6 rounded-[2rem] shadow-lg shadow-navy/20 flex items-center gap-4 relative overflow-hidden">
          <div className="relative z-10 w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-navy-100 uppercase tracking-widest opacity-70">Security Protocol</p>
            <p className="text-xs text-white font-medium mt-1">Data Isolation Active</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
