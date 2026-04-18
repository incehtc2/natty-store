"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";

type Stats = { products: number; orders: number; users: number; revenue: number };
type RecentOrder = { id: string; created_at: string; durum: string; toplam: number };

const DURUM_STYLE: Record<string, string> = {
  hazirlaniyor: "bg-amber-50 text-amber-700 border border-amber-200",
  kargoda: "bg-blue-50 text-blue-700 border border-blue-200",
  teslim_edildi: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  iptal: "bg-red-50 text-red-600 border border-red-200",
};

const DURUM_TR: Record<string, string> = {
  hazirlaniyor: "Hazırlanıyor", kargoda: "Kargoda",
  teslim_edildi: "Teslim Edildi", iptal: "İptal",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [p, o, u, rev, recentRes] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("toplam").neq("durum", "iptal"),
        supabase
          .from("orders")
          .select("id,durum,toplam,created_at")
          .order("created_at", { ascending: false })
          .limit(8),
      ]);

      if (!mounted) return;

      const revenue = (rev.data || []).reduce(
        (s: number, r: { toplam: number }) => s + r.toplam,
        0
      );

      setStats({ products: p.count || 0, orders: o.count || 0, users: u.count || 0, revenue });
      setRecent(recentRes.data || []);
      setLoading(false);
    }

    load();
    return () => { mounted = false; };
  }, []);

  const cards = [
    { label: "Toplam Ürün", value: stats.products, icon: Package, accent: "text-gold", border: "border-gold/20", bg: "bg-gold/5" },
    { label: "Toplam Sipariş", value: stats.orders, icon: ShoppingBag, accent: "text-charcoal", border: "border-charcoal/10", bg: "bg-charcoal/3" },
    { label: "Kayıtlı Kullanıcı", value: stats.users, icon: Users, accent: "text-warm-gray", border: "border-warm-gray/20", bg: "bg-warm-gray/5" },
    { label: "Toplam Ciro", value: `${stats.revenue.toLocaleString("tr-TR")} ₺`, icon: TrendingUp, accent: "text-gold", border: "border-gold/20", bg: "bg-gold/5" },
  ];

  return (
    <div className="space-y-10">
      <div className="border-b border-light-gray pb-6">
        <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">GENEL BAKIŞ</p>
        <h1 className="text-3xl font-serif font-medium text-charcoal">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon, accent, border, bg }) => (
          <div key={label} className={`border ${border} ${bg} p-6`}>
            <div className={`w-9 h-9 flex items-center justify-center border ${border} mb-5`}>
              <Icon size={15} className={accent} strokeWidth={1.5} />
            </div>
            {loading ? (
              <div className="h-8 w-24 bg-light-gray rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-serif font-medium text-charcoal mb-1">{value}</p>
            )}
            <p className="text-[10px] tracking-widest text-warm-gray uppercase">{label}</p>
          </div>
        ))}
      </div>

      <div className="border border-light-gray">
        <div className="flex items-center justify-between px-6 py-4 border-b border-light-gray">
          <div className="flex items-center gap-3">
            <Clock size={13} className="text-warm-gray" strokeWidth={1.5} />
            <span className="text-[10px] tracking-ultra font-medium text-charcoal uppercase">Son Siparişler</span>
          </div>
          <Link href="/admin/siparisler" className="flex items-center gap-1 text-[10px] tracking-widest text-warm-gray hover:text-gold transition-colors">
            Tümünü gör <ArrowUpRight size={11} />
          </Link>
        </div>
        <div className="divide-y divide-light-gray">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="h-3 w-40 bg-light-gray rounded animate-pulse" />
                <div className="h-3 w-20 bg-light-gray rounded animate-pulse ml-auto" />
              </div>
            ))
          ) : recent.length === 0 ? (
            <p className="px-6 py-10 text-sm text-warm-gray text-center font-light">Henüz sipariş bulunmuyor</p>
          ) : (
            recent.map(order => (
              <div key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-cream-dark transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal font-medium font-mono">#{order.id.slice(0, 10)}...</p>
                  <p className="text-[11px] text-warm-gray mt-0.5 font-light">{new Date(order.created_at).toLocaleString("tr-TR")}</p>
                </div>
                <span className={`text-[10px] px-2.5 py-1 font-medium ${DURUM_STYLE[order.durum] || "bg-cream-dark text-warm-gray border border-light-gray"}`}>
                  {DURUM_TR[order.durum] || order.durum}
                </span>
                <span className="text-sm font-medium text-charcoal tabular-nums ml-2">
                  {order.toplam.toLocaleString("tr-TR")} ₺
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
