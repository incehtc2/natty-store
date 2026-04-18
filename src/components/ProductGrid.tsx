"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/data";

type SortKey = "newest" | "price_asc" | "price_desc" | "discount";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest",     label: "En Yeni" },
  { key: "price_asc",  label: "Fiyat: Düşükten Yükseğe" },
  { key: "price_desc", label: "Fiyat: Yükseğe Düşüğe" },
  { key: "discount",   label: "En Yüksek İndirim" },
];

const PRICE_RANGES = [
  { label: "Tümü",            min: 0,     max: Infinity },
  { label: "0 – 2.000 ₺",    min: 0,     max: 2000 },
  { label: "2.000 – 5.000 ₺", min: 2000,  max: 5000 },
  { label: "5.000 – 10.000 ₺",min: 5000,  max: 10000 },
  { label: "10.000 ₺ +",     min: 10000, max: Infinity },
];

const COLORS = [
  { label: "Siyah",       hex: "#1a1a1a",  value: "siyah" },
  { label: "Beyaz",       hex: "#f8f6f2",  value: "beyaz", border: true },
  { label: "Krem",        hex: "#e8d9c5",  value: "krem" },
  { label: "Bej",         hex: "#c9a97a",  value: "bej" },
  { label: "Kahverengi",  hex: "#6b4226",  value: "kahverengi" },
  { label: "Bordo",       hex: "#7d2027",  value: "bordo" },
  { label: "Lacivert",    hex: "#1b2a4a",  value: "lacivert" },
  { label: "Gri",         hex: "#8a8a8a",  value: "gri" },
  { label: "Gold",        hex: "#c9a84c",  value: "gold" },
  { label: "Pembe",       hex: "#e8a0b0",  value: "pembe" },
  { label: "Yeşil",       hex: "#4a7c59",  value: "yesil" },
  { label: "Mavi",        hex: "#2c5f8a",  value: "mavi" },
];

const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

const GENDER_OPTIONS = [
  { label: "Tümü",  value: "" },
  { label: "Kadın", value: "kadin" },
  { label: "Erkek", value: "erkek" },
];

export default function ProductGrid({
  products,
  sectionLabel,
  hideGender = false,
}: {
  products: Product[];
  sectionLabel?: string;
  hideGender?: boolean;
}) {
  const [sort, setSort]               = useState<SortKey>("newest");
  const [sortOpen, setSortOpen]       = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceIdx, setPriceIdx]       = useState(0);
  const [selectedSizes, setSelectedSizes]   = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [gender, setGender]           = useState("");
  const [onlyDiscount, setOnlyDiscount] = useState(false);

  const sortRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleSize  = (s: number) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleColor = (c: string) => setSelectedColors(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    const { min, max } = PRICE_RANGES[priceIdx];
    let list = [...products];

    if (gender)        list = list.filter(p => p.category === gender);
    list = list.filter(p => p.price >= min && p.price <= max);
    if (onlyDiscount)  list = list.filter(p => p.originalPrice);

    if (selectedSizes.length > 0) {
      list = list.filter(p => {
        const ps = p.sizes as number[] | undefined;
        return ps ? selectedSizes.some(s => ps.includes(s)) : true;
      });
    }
    if (selectedColors.length > 0) {
      list = list.filter(p => {
        const pc = p.colors as string[] | undefined;
        return pc ? selectedColors.some(c => pc.includes(c)) : true;
      });
    }

    switch (sort) {
      case "price_asc":  return list.sort((a, b) => a.price - b.price);
      case "price_desc": return list.sort((a, b) => b.price - a.price);
      case "discount":   return list.sort((a, b) => {
        const da = a.originalPrice ? 1 - a.price / a.originalPrice : 0;
        const db = b.originalPrice ? 1 - b.price / b.originalPrice : 0;
        return db - da;
      });
      default: return list;
    }
  }, [products, sort, priceIdx, selectedSizes, selectedColors, gender, onlyDiscount]);

  const activeCount =
    (priceIdx !== 0 ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (gender ? 1 : 0) +
    (onlyDiscount ? 1 : 0);

  const reset = () => {
    setPriceIdx(0); setSelectedSizes([]); setSelectedColors([]);
    setGender(""); setOnlyDiscount(false); setSort("newest");
  };

  const currentSort = SORT_OPTIONS.find(o => o.key === sort)!;

  return (
    <div className="space-y-6">

      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 py-3.5 border-y border-light-gray">

        {/* Sol: filtre */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(o => !o)}
            className={`flex items-center gap-2 text-[10px] tracking-ultra font-medium transition-colors ${filtersOpen || activeCount > 0 ? "text-charcoal" : "text-warm-gray hover:text-charcoal"}`}
          >
            <SlidersHorizontal size={12} strokeWidth={1.5} />
            FİLTRE
            {activeCount > 0 && (
              <span className="w-[18px] h-[18px] rounded-full bg-charcoal text-cream text-[9px] flex items-center justify-center font-semibold">
                {activeCount}
              </span>
            )}
          </button>
          {activeCount > 0 && (
            <button onClick={reset} className="flex items-center gap-1 text-[10px] text-warm-gray hover:text-charcoal transition-colors">
              <X size={10} strokeWidth={2} />
              Temizle
            </button>
          )}
        </div>

        {/* Sağ: sort dropdown */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center gap-2 text-[10px] tracking-ultra text-warm-gray hover:text-charcoal transition-colors"
          >
            <span className="hidden sm:inline text-warm-gray/50">SIRALA:</span>
            <span className="text-charcoal font-medium">{currentSort.label.toUpperCase()}</span>
            <ChevronDown size={11} className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`} strokeWidth={1.5} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-cream border border-light-gray shadow-lg z-30 py-1">
              {SORT_OPTIONS.map(o => (
                <button
                  key={o.key}
                  onClick={() => { setSort(o.key); setSortOpen(false); }}
                  className="flex items-center justify-between w-full px-4 py-2.5 text-[11px] text-left hover:bg-cream-dark transition-colors"
                >
                  <span className={sort === o.key ? "text-charcoal font-medium" : "text-warm-gray"}>{o.label}</span>
                  {sort === o.key && <Check size={11} className="text-charcoal" strokeWidth={2} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Filter panel ────────────────────────────────────── */}
      {filtersOpen && (
        <div className="border border-light-gray bg-cream divide-y divide-light-gray">

          {/* Fiyat */}
          <div className="px-6 py-5">
            <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">FİYAT ARALIĞI</p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => setPriceIdx(i)}
                  className={`px-3 py-1.5 text-[10px] tracking-ultra border transition-all ${priceIdx === i ? "bg-charcoal text-cream border-charcoal" : "text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Numara */}
          <div className="px-6 py-5">
            <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">NUMARA</p>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`w-10 h-10 flex items-center justify-center text-[11px] font-medium border transition-all ${selectedSizes.includes(s) ? "bg-charcoal text-cream border-charcoal" : "text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Renk */}
          <div className="px-6 py-5">
            <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">RENK</p>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => toggleColor(c.value)}
                  title={c.label}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    className={`w-7 h-7 rounded-full transition-all ${selectedColors.includes(c.value) ? "ring-2 ring-offset-2 ring-charcoal scale-110" : "hover:scale-110"} ${c.border ? "border border-light-gray" : ""}`}
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className={`text-[9px] tracking-wide transition-colors ${selectedColors.includes(c.value) ? "text-charcoal font-medium" : "text-warm-gray/60 group-hover:text-warm-gray"}`}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Alt satır: Cinsiyet + İndirimli */}
          <div className="px-6 py-5 flex flex-wrap items-center gap-8">
            {!hideGender && (
              <div>
                <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">CİNSİYET</p>
                <div className="flex gap-2">
                  {GENDER_OPTIONS.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setGender(g.value)}
                      className={`px-4 py-1.5 text-[10px] tracking-ultra border transition-all ${gender === g.value ? "bg-charcoal text-cream border-charcoal" : "text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"}`}
                    >
                      {g.label.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">KAMPANYA</p>
              <button
                onClick={() => setOnlyDiscount(o => !o)}
                className={`flex items-center gap-2.5 px-4 py-1.5 text-[10px] tracking-ultra border transition-all ${onlyDiscount ? "bg-charcoal text-cream border-charcoal" : "text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"}`}
              >
                <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 ${onlyDiscount ? "bg-cream/20 border-cream/40" : "border-current"}`}>
                  {onlyDiscount && <Check size={9} strokeWidth={2.5} />}
                </span>
                YALNIZCA İNDİRİMLİ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Section header ──────────────────────────────────── */}
      {sectionLabel && (
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-medium tracking-ultra text-charcoal/40">{sectionLabel}</h2>
          <span className="flex-1 h-px bg-light-gray" />
          <span className="text-[10px] text-warm-gray font-light">{filtered.length} ürün</span>
        </div>
      )}

      {/* ── Grid ────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center border border-light-gray">
          <p className="text-sm text-warm-gray font-light mb-4">Seçili filtreler için ürün bulunamadı.</p>
          <button onClick={reset} className="text-[10px] tracking-ultra text-charcoal border-b border-charcoal pb-0.5 hover:text-gold hover:border-gold transition-colors">
            FİLTRELERİ TEMİZLE
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
