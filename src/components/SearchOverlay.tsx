"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Result = {
  id: string; name: string; price: number;
  original_price: number | null; image: string; category: string; type: string;
};

const TYPE_TR: Record<string, string> = { ayakkabi: "Ayakkabı", canta: "Çanta" };
const CAT_TR: Record<string, string> = { kadin: "Kadın", erkek: "Erkek" };

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const search = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    const { data } = await supabase
      .from("products")
      .select("id,name,price,original_price,image,category,type")
      .ilike("name", `%${q}%`)
      .limit(6);
    setResults(data || []);
    setSearching(false);
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(val), 280);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 max-w-2xl mx-auto mt-24 mx-4 sm:mx-auto px-4">
        <div className="bg-cream border border-light-gray shadow-2xl">
          {/* Input */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-light-gray">
            <Search size={16} className="text-warm-gray flex-shrink-0" strokeWidth={1.5} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => handleChange(e.target.value)}
              placeholder="Ürün ara..."
              className="flex-1 bg-transparent text-charcoal text-sm placeholder:text-warm-gray/40 focus:outline-none"
            />
            {searching && (
              <div className="w-4 h-4 border border-light-gray border-t-charcoal rounded-full animate-spin flex-shrink-0" />
            )}
            <button onClick={onClose} className="text-warm-gray hover:text-charcoal transition-colors flex-shrink-0">
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Sonuçlar */}
          {results.length > 0 && (
            <div className="divide-y divide-light-gray max-h-[420px] overflow-y-auto">
              {results.map(r => (
                <Link
                  key={r.id}
                  href={`/urun/${r.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-cream-dark transition-colors group"
                >
                  <div className="relative w-12 h-14 flex-shrink-0 bg-cream-dark overflow-hidden border border-light-gray">
                    <Image src={r.image} alt={r.name} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-charcoal font-medium line-clamp-1 group-hover:text-gold transition-colors">{r.name}</p>
                    <p className="text-[10px] text-warm-gray tracking-widest mt-0.5">
                      {CAT_TR[r.category]} · {TYPE_TR[r.type]}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-charcoal">{r.price.toLocaleString("tr-TR")} ₺</p>
                    {r.original_price && (
                      <p className="text-[11px] text-warm-gray/50 line-through">{r.original_price.toLocaleString("tr-TR")} ₺</p>
                    )}
                  </div>
                  <ArrowRight size={13} className="text-warm-gray/30 group-hover:text-gold transition-colors flex-shrink-0" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          )}

          {query.length >= 2 && !searching && results.length === 0 && (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-warm-gray font-light">"{query}" için sonuç bulunamadı</p>
            </div>
          )}

          {query.length === 0 && (
            <div className="px-6 py-5">
              <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">HIZLI ERİŞİM</p>
              <div className="flex flex-wrap gap-2">
                {["Kadın Ayakkabı", "Erkek Ayakkabı", "Çanta", "Kampanya"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleChange(tag)}
                    className="text-[10px] tracking-ultra px-3 py-1.5 border border-light-gray text-warm-gray hover:border-charcoal hover:text-charcoal transition-colors"
                  >
                    {tag.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
