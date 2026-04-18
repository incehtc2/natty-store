"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Search, User } from "lucide-react";

type Profile = {
  id: string; isim: string; soyisim: string;
  telefon: string | null; created_at: string;
};

export default function AdminKullanicilar() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [profilesRes, ordersRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,isim,soyisim,telefon,created_at")
          .order("created_at", { ascending: false }),
        supabase.from("orders").select("user_id"),
      ]);

      if (!mounted) return;

      setProfiles(profilesRes.data || []);

      const counts: Record<string, number> = {};
      for (const o of ordersRes.data || []) {
        counts[o.user_id] = (counts[o.user_id] || 0) + 1;
      }
      setOrderCounts(counts);
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return profiles.filter(p =>
      `${p.isim} ${p.soyisim}`.toLowerCase().includes(q) || p.id.includes(q)
    );
  }, [profiles, search]);

  return (
    <div className="space-y-8">
      <div className="border-b border-light-gray pb-6">
        <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">MAĞAZA</p>
        <h1 className="text-3xl font-serif font-medium text-charcoal">Kullanıcılar</h1>
      </div>

      <div className="relative">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray/50" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="İsim veya ID ile ara..." className="w-full bg-cream border border-light-gray pl-11 pr-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors" />
      </div>

      <div className="border border-light-gray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-gray bg-cream-dark">
                {["Kullanıcı", "Telefon", "Siparişler", "Kayıt Tarihi"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[9px] tracking-ultra text-warm-gray font-medium uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="bg-cream">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-3.5 bg-light-gray rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-warm-gray text-sm font-light">Kullanıcı bulunamadı</td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="bg-cream hover:bg-cream-dark transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cream-dark border border-light-gray flex items-center justify-center flex-shrink-0">
                          <User size={13} className="text-warm-gray" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-sm text-charcoal font-medium">{p.isim} {p.soyisim}</p>
                          <p className="text-[10px] text-warm-gray font-mono mt-0.5">{p.id.slice(0, 18)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-warm-gray font-light">{p.telefon || "—"}</td>
                    <td className="px-5 py-4">
                      {(orderCounts[p.id] || 0) > 0 ? (
                        <span className="text-[10px] px-2.5 py-1 bg-gold/10 text-gold border border-gold/20 font-medium">
                          {orderCounts[p.id]} sipariş
                        </span>
                      ) : (
                        <span className="text-[10px] text-warm-gray/50">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-warm-gray font-light">
                      {new Date(p.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && (
        <p className="text-[10px] text-warm-gray text-right">{filtered.length} kullanıcı gösteriliyor</p>
      )}
    </div>
  );
}
