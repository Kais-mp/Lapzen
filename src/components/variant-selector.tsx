"use client";

import React, { useEffect, useState } from "react";
import { Cpu, HardDrive, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Variant {
  id: string;
  product_id: string;
  variant_type: "ram" | "storage";
  variant_value: string;
  price_adjustment: number;
}

interface VariantSelectorProps {
  productId: string;
  basePrice: number;
  onPriceChange: (
    totalPrice: number,
    selectedRam: Variant | null,
    selectedStorage: Variant | null
  ) => void;
}

function formatAdjustment(adj: number) {
  if (adj === 0) return "";
  return adj > 0
    ? ` (+Rs. ${adj.toLocaleString()})`
    : ` (−Rs. ${Math.abs(adj).toLocaleString()})`;
}

export function VariantSelector({
  productId,
  basePrice,
  onPriceChange,
}: VariantSelectorProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedRam, setSelectedRam] = useState<Variant | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/variants?product_id=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setVariants(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    const ramAdj = selectedRam?.price_adjustment ?? 0;
    const storageAdj = selectedStorage?.price_adjustment ?? 0;
    onPriceChange(basePrice + ramAdj + storageAdj, selectedRam, selectedStorage);
  }, [selectedRam, selectedStorage, basePrice]);

  const ramVariants = variants.filter((v) => v.variant_type === "ram");
  const storageVariants = variants.filter((v) => v.variant_type === "storage");

  if (loading || (ramVariants.length === 0 && storageVariants.length === 0)) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#00172E]/10 bg-[#00172E]/[0.03] overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[#00172E]/10 bg-[#00172E]/[0.04]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00172E]" />
        <p className="text-[10px] font-black text-[#00172E] uppercase tracking-[0.18em]">
          Configure Variants
        </p>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* RAM */}
          {ramVariants.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-[#00172E] uppercase tracking-[0.15em]">
                <Cpu className="w-3 h-3" />
                RAM
              </label>
              <Select
                value={selectedRam?.id ?? "__default__"}
                onValueChange={(val) => {
                  if (val === "__default__") {
                    setSelectedRam(null);
                  } else {
                    setSelectedRam(ramVariants.find((x) => x.id === val) ?? null);
                  }
                }}
              >
                <SelectTrigger className="w-full h-11 px-4 rounded-xl border-2 border-[#00172E]/20 bg-white text-[#00172E] font-semibold text-sm hover:border-[#00172E]/50 focus:border-[#00172E] focus:ring-0 focus-visible:ring-0 focus-visible:border-[#00172E] transition-all shadow-none data-[state=open]:border-[#00172E]">
                  <SelectValue placeholder="Default (Base)" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-[#00172E]/15 shadow-2xl shadow-[#00172E]/10 bg-white z-[9999]">
                  <SelectItem
                    value="__default__"
                    className="font-semibold text-[#00172E]/60 rounded-lg focus:bg-[#00172E]/5 focus:text-[#00172E] cursor-pointer"
                  >
                    Default (Base)
                  </SelectItem>
                  {ramVariants.map((v) => (
                    <SelectItem
                      key={v.id}
                      value={v.id}
                      className="font-semibold text-[#00172E] rounded-lg focus:bg-[#00172E] focus:text-white cursor-pointer"
                    >
                      <span>{v.variant_value}</span>
                      {v.price_adjustment !== 0 && (
                        <span
                          className={
                            v.price_adjustment > 0
                              ? "ml-2 text-xs font-bold text-emerald-600"
                              : "ml-2 text-xs font-bold text-rose-500"
                          }
                        >
                          {formatAdjustment(v.price_adjustment)}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Storage */}
          {storageVariants.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-black text-[#00172E] uppercase tracking-[0.15em]">
                <HardDrive className="w-3 h-3" />
                Storage
              </label>
              <Select
                value={selectedStorage?.id ?? "__default__"}
                onValueChange={(val) => {
                  if (val === "__default__") {
                    setSelectedStorage(null);
                  } else {
                    setSelectedStorage(
                      storageVariants.find((x) => x.id === val) ?? null
                    );
                  }
                }}
              >
                <SelectTrigger className="w-full h-11 px-4 rounded-xl border-2 border-[#00172E]/20 bg-white text-[#00172E] font-semibold text-sm hover:border-[#00172E]/50 focus:border-[#00172E] focus:ring-0 focus-visible:ring-0 focus-visible:border-[#00172E] transition-all shadow-none data-[state=open]:border-[#00172E]">
                  <SelectValue placeholder="Default (Base)" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 border-[#00172E]/15 shadow-2xl shadow-[#00172E]/10 bg-white z-[9999]">
                  <SelectItem
                    value="__default__"
                    className="font-semibold text-[#00172E]/60 rounded-lg focus:bg-[#00172E]/5 focus:text-[#00172E] cursor-pointer"
                  >
                    Default (Base)
                  </SelectItem>
                  {storageVariants.map((v) => (
                    <SelectItem
                      key={v.id}
                      value={v.id}
                      className="font-semibold text-[#00172E] rounded-lg focus:bg-[#00172E] focus:text-white cursor-pointer"
                    >
                      <span>{v.variant_value}</span>
                      {v.price_adjustment !== 0 && (
                        <span
                          className={
                            v.price_adjustment > 0
                              ? "ml-2 text-xs font-bold text-emerald-600"
                              : "ml-2 text-xs font-bold text-rose-500"
                          }
                        >
                          {formatAdjustment(v.price_adjustment)}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Active selection chips */}
        {(selectedRam || selectedStorage) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedRam && (
              <span className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-[#00172E] text-white text-xs font-bold rounded-full shadow-sm">
                <Cpu className="w-3 h-3 opacity-70" />
                {selectedRam.variant_value}
                <button
                  type="button"
                  onClick={() => setSelectedRam(null)}
                  className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                  aria-label="Remove RAM variant"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedStorage && (
              <span className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 bg-[#00172E] text-white text-xs font-bold rounded-full shadow-sm">
                <HardDrive className="w-3 h-3 opacity-70" />
                {selectedStorage.variant_value}
                <button
                  type="button"
                  onClick={() => setSelectedStorage(null)}
                  className="w-4 h-4 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                  aria-label="Remove Storage variant"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
