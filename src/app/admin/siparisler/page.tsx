"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Search, ChevronDown, Loader2 } from "lucide-react";

type Order = {
  id: string; user_id: string; durum: string;
  toplam: number; created_at: string; payment_id: string | null;
  order_items: { name: string; quantity: number; price: number; size: number | null }[];
};

const DURUM_STYLE: Record<string, string> = {
  hazirlaniyor: "bg-amber-50 text-amber-700 border border-amber-200",
  kargoda: "bg-blue-50 text-blue-700 border border-blue-200",
  teslim_edildi: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  iptal: "bg-red-50 text-red-600 border border-red-200",
};

const DURUMLAR = ["hazirlaniyor", "kargoda", "teslim_edildi", "iptal"];
const DURUM_TR: Record<string, string> = {
  hazirlaniyor: "Hazırlanıyor", kargoda: "Kargoda",
  teslim_edildi: "Teslim Edildi", iptal: "İptal",
};

export default function AdminSiparisler() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("tümü");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase
        .from("orders")
        .select("id,user_id,durum,toplam,created_at,payment_id,order_items(name,quantity,price,size)")
        .order("created_at", { ascending: false });

      if (!mounted) return;
      setOrders(data || []);
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(q) || o.user_id.toLowerCase().includes(q);
      const matchFilter = filter === "tümü" || o.durum === filter;
      return matchSearch && matchFilter;
    });
  }, [orders, search, filter]);

  const updateDurum = async (id: string, durum: string) => {
    setUpdating(id);
    await supabase.from("orders").update({ durum }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, durum } : o));
    setUpdating(null);
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-light-gray pb-6">
        <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">MAĞAZA</p>
        <h1 className="text-3xl font-serif font-medium text-charcoal">Siparişler</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray/50" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sipariş ID veya kullanıcı ID ara..." className="w-full bg-cream border border-light-gray pl-11 pr-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["tümü", ...DURUMLAR].map(d => (
            <button key={d} onClick={() => setFilter(d)} className={`px-4 py-2.5 text-[10px] tracking-ultra font-medium transition-all border ${filter === d ? "bg-charcoal text-cream border-charcoal" : "bg-cream text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"}`}>
              {d === "tümü" ? "TÜMÜ" : DURUM_TR[d].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border border-light-gray p-5 animate-pulse">
              <div className="h-4 w-56 bg-light-gray rounded" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="border border-light-gray py-14 text-center text-warm-gray text-sm font-light">Sipariş bulunamadı</div>
        ) : (
          filtered.map(order => (
            <div key={order.id} className="border border-light-gray overflow-hidden">
              <div
                className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-cream-dark transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <ChevronDown size={13} strokeWidth={1.5} className={`text-warm-gray transition-transform flex-shrink-0 ${expanded === order.id ? "rotate-180" : ""}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal font-medium font-mono">#{order.id.slice(0, 14)}...</p>
                  <p className="text-[11px] text-warm-gray mt-0.5 font-light">{new Date(order.created_at).toLocaleString("tr-TR")}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 font-medium ${DURUM_STYLE[order.durum] || "bg-cream-dark text-warm-gray border border-light-gray"}`}>
                  {DURUM_TR[order.durum] || order.durum}
                </span>
                <span className="text-sm font-medium text-charcoal tabular-nums">{order.toplam.toLocaleString("tr-TR")} ₺</span>
              </div>

              {expanded === order.id && (
                <div className="border-t border-light-gray px-6 py-5 bg-cream-dark space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] tracking-ultra text-warm-gray mb-1 uppercase">Kullanıcı ID</p>
                      <p className="text-xs text-charcoal font-mono">{order.user_id}</p>
                    </div>
                    {order.payment_id && (
                      <div>
                        <p className="text-[9px] tracking-ultra text-warm-gray mb-1 uppercase">Ödeme ID</p>
                        <p className="text-xs text-charcoal font-mono">{order.payment_id}</p>
                      </div>
                    )}
                  </div>

                  {order.order_items?.length > 0 && (
                    <div>
                      <p className="text-[9px] tracking-ultra text-warm-gray mb-3 uppercase">Ürünler</p>
                      <div className="space-y-1.5">
                        {order.order_items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-charcoal/80">{item.name}{item.size ? ` (${item.size})` : ""} <span className="text-warm-gray">× {item.quantity}</span></span>
                            <span className="text-warm-gray tabular-nums">{(item.price * item.quantity).toLocaleString("tr-TR")} ₺</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[9px] tracking-ultra text-warm-gray mb-3 uppercase">Durumu Güncelle</p>
                    <div className="flex gap-2 flex-wrap">
                      {DURUMLAR.map(d => (
                        <button
                          key={d}
                          onClick={() => updateDurum(order.id, d)}
                          disabled={order.durum === d || updating === order.id}
                          className={`flex items-center gap-1.5 px-4 py-2 text-[10px] tracking-ultra font-medium border transition-all ${order.durum === d ? "bg-charcoal text-cream border-charcoal" : "bg-cream text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"} disabled:opacity-40`}
                        >
                          {updating === order.id && order.durum !== d && <Loader2 size={10} className="animate-spin" />}
                          {DURUM_TR[d].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
