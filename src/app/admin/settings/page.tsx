"use client";

import React, { useState } from "react";
import { Settings, Lock, Eye, EyeOff, Save, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully! The server will restart with the new password.");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Admin Settings
          </h1>
          <p className="text-slate-500 mt-2">Manage your administrative configurations and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Security Section */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center gap-3 bg-slate-50/50">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h2 className="font-bold text-navy text-lg">Security & Authentication</h2>
          </div>
          
          <div className="p-8">
            <div className="max-w-md">
              <h3 className="text-navy font-bold mb-2">Change Admin Password</h3>
              <p className="text-sm text-slate-500 mb-6">
                Update the password used for admin panel access. You will not be asked for the old password.
              </p>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 text-navy font-medium placeholder:text-slate-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-navy transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-navy ml-1">Confirm New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600/20 text-navy font-medium placeholder:text-slate-400 transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-navy text-white hover:bg-navy/90 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-navy/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-bold text-blue-900 text-sm">Deployment Notice</h4>
            <p className="text-blue-700 text-sm mt-1 leading-relaxed">
              Changing the admin password will trigger a server environment update. 
              The change is immediate, and you may need to log in again if your session expires.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
