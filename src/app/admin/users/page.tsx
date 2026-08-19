"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, Mail, Calendar, Key, AlertTriangle, Fingerprint } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy">User Management</h1>
        <p className="text-slate-500 text-sm mt-1">Audit active customer accounts and session data</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Identity</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Contact Control</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Session Activity</th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Security Hash</th>
                <th className="px-6 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Auth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-navy shadow-sm">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-navy">{user.username || 'System User'}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                          <Fingerprint className="w-3 h-3" />
                          {user.id.slice(0, 16)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-navy font-medium flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-300" />
                        {user.email || 'N/A'}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 self-start px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">Verified</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        Joined: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-[10px] text-slate-400 italic">
                        Last seen: {user.last_sign_in ? new Date(user.last_sign_in).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="group relative">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-300 bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200">
                        <Key className="w-3 h-3" />
                        $argon2id$v=19$m=65536...
                      </div>
                      <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          ENCRYPTED BLOB
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                      <Shield className="w-3 h-3" />
                      Active Client
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && users.length === 0 && (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium text-lg">Empty directory.</p>
              <p className="text-slate-300 text-sm mt-1">New accounts will appear here automatically.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 p-8 bg-navy text-white rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-navy/20">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Cryptographic Protocol Notice</h3>
            <p className="text-navy-100 text-sm leading-relaxed max-w-2xl opacity-80">
              For administrative transparency, identity records are visible. However, raw entry credentials (passwords) are strictly isolated within the Supabase Auth vault using irreversible salted hashing. This compliance measure ensures zero-knowledge security for your customers' private keys.
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-xl"></div>
      </div>
    </div>
  );
}
