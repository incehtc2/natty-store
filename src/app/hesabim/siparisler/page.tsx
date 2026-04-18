"use client";

import { useState } from "react";
import { Package, ChevronDown, ChevronUp, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import type { Order } from "../../../context/AuthContext";

const STATUS = {
  hazirlaniyor: { label: "HAZIRLANIYOR", color: "bg-amber-50 text-amber-600", icon: Clock },
  kargoda: { label: "KARGODA", color: "bg-blue-50 text-blue-600", icon: Truck },
  teslim_edildi: { label: "TESLİM EDİLDİ", color: "bg-green-50 text-green-700", icon: CheckCircle },
  iptal: { label: "İPTAL", color: "bg-red-50 text-red-500", icon: XCircle },
};

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const s = STATUS[order.durum];
  const Icon = s.icon;

  return (
    <div className="border border-light-gray">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 hover:bg-cream-dark transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-cream-dark flex items-center justify-center flex-shrink-0">
            <Package size={15} strokeWidth={1.5} className="text-warm-gray" />
          </div>
          <div>
            <p className="text-sm font-medium text-charcoal font-mono">#{order.id.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-warm-gray font-light mt-0.5">
              {new Date(order.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} · {order.urunler.length} ürün
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-charcoal">{order.toplam.toLocaleString("tr-TR")} ₺</p>
            <span className={`inline-flex items-center gap-1 text-[10px] tracking-wider font-medium px-2 py-0.5 ${s.color}`}>
              <Icon size={10} />
              {s.label}
            </span>
          </div>
          {open ? <ChevronUp size={15} className="text-warm-gray flex-shrink-0" /> : <ChevronDown size={15} className="text-warm-gray flex-shrink-0" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-light-gray bg-cream-dark/30">
          <div className="sm:hidden px-5 py-3 flex items-center justify-between border-b border-light-gray/50">
            <span className="text-sm font-medium text-charcoal">{order.toplam.toLocaleString("tr-TR")} ₺</span>
            <span className={`inline-flex items-center gap-1 text-[10px] tracking-wider font-medium px-2 py-0.5 ${s.color}`}>
              <Icon size={10} />
              {s.label}
            </span>
          </div>
          <div className="divide-y divide-light-gray/50">
            {order.urunler.map((u, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 h-14 flex-shrink-0 overflow-hidden border border-light-gray">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{u.name}</p>
                  <p className="text-xs text-warm-gray font-light mt-0.5">
                    {u.size ? `Beden: ${u.size} · ` : ""}Adet: {u.quantity}
                  </p>
                </div>
                <p className="text-sm font-medium text-charcoal flex-shrink-0">
                  {(u.price * u.quantity).toLocaleString("tr-TR")} ₺
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-end px-5 py-4 border-t border-light-gray/50">
            <div className="text-right">
              <p className="text-[10px] tracking-wider text-warm-gray mb-1">TOPLAM TUTAR</p>
              <p className="text-xl font-medium text-charcoal">{order.toplam.toLocaleString("tr-TR")} ₺</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiparislerPage() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-mega text-warm-gray mb-1 font-medium">HESABIM</p>
        <h2 className="text-2xl font-serif font-medium text-charcoal">Siparişlerim</h2>
      </div>

      {user.siparisler.length === 0 ? (
        <div className="border border-dashed border-light-gray p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
            <Package size={22} strokeWidth={1} className="text-warm-gray" />
          </div>
          <p className="text-sm text-warm-gray font-light mb-2">Henüz sipariş vermediniz.</p>
          <p className="text-xs text-warm-gray/60 font-light mb-6">Siparişleriniz burada listelenecektir.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...user.siparisler].reverse().map(order => (
            <OrderRow key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
