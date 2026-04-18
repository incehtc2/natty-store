"use client";

import Link from "next/link";
import { Package, MapPin, User, Heart, ChevronRight, ShoppingBag, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function HesabimPage() {
  const { user } = useAuth();
  if (!user) return null;

  const cards = [
    { href: "/hesabim/siparisler", icon: Package, label: "Siparişlerim", val: `${user.siparisler.length} sipariş`, desc: "Tüm sipariş geçmişiniz" },
    { href: "/hesabim/adresler", icon: MapPin, label: "Adreslerim", val: `${user.adresler.length} adres`, desc: "Kayıtlı teslimat adresleriniz" },
    { href: "/hesabim/profil", icon: User, label: "Profil Bilgileri", val: user.telefon || "Telefon ekle", desc: "Kişisel bilgilerinizi düzenleyin" },
    { href: "/hesabim/favoriler", icon: Heart, label: "Favorilerim", val: "0 ürün", desc: "Beğendiğiniz ürünler" },
  ];

  const recent = user.siparisler.slice(0, 3);

  return (
    <div className="space-y-10">
      {/* Kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ href, icon: Icon, label, val, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center justify-between p-5 border border-light-gray hover:border-charcoal bg-cream hover:bg-[#f0ece5] transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-cream-dark flex items-center justify-center flex-shrink-0 group-hover:bg-light-gray transition-colors">
                <Icon size={18} strokeWidth={1.5} className="text-warm-gray" />
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">{label}</p>
                <p className="text-xs text-warm-gray font-light mt-0.5">{desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-warm-gray hidden sm:block">{val}</span>
              <ChevronRight size={15} className="text-warm-gray/50 group-hover:text-charcoal transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Son Siparişler */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] tracking-ultra font-medium text-charcoal">SON SİPARİŞLER</h2>
          <Link href="/hesabim/siparisler" className="text-[10px] tracking-wider text-warm-gray hover:text-charcoal transition-colors underline underline-offset-2">
            Tümünü Gör
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="border border-dashed border-light-gray p-12 text-center">
            <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={22} strokeWidth={1} className="text-warm-gray" />
            </div>
            <p className="text-sm text-warm-gray font-light mb-5">Henüz sipariş vermediniz.</p>
            <Link href="/" className="inline-block bg-charcoal text-cream px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors">
              ALIŞVERİŞE BAŞLA
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-light-gray border border-light-gray">
            {recent.map(order => (
              <div key={order.id} className="flex items-center justify-between p-5 hover:bg-cream-dark transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-cream-dark flex items-center justify-center flex-shrink-0">
                    <Clock size={15} strokeWidth={1.5} className="text-warm-gray" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal font-mono">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-warm-gray font-light">{new Date(order.tarih).toLocaleDateString("tr-TR")} · {order.urunler.length} ürün</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-charcoal">{order.toplam.toLocaleString("tr-TR")} ₺</p>
                  <span className={`text-[10px] tracking-wider font-medium px-2 py-0.5 ${
                    order.durum === "teslim_edildi" ? "bg-green-50 text-green-700" :
                    order.durum === "kargoda" ? "bg-blue-50 text-blue-600" :
                    order.durum === "iptal" ? "bg-red-50 text-red-500" :
                    "bg-amber-50 text-amber-600"
                  }`}>
                    {order.durum === "teslim_edildi" ? "TESLİM EDİLDİ" :
                     order.durum === "kargoda" ? "KARGODA" :
                     order.durum === "iptal" ? "İPTAL" : "HAZIRLANIYOR"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hızlı Linkler */}
      <div className="bg-[#f0ece5] p-6">
        <p className="text-[10px] tracking-ultra font-medium text-charcoal mb-4">HIZLI ERİŞİM</p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/kadin", label: "Kadın Koleksiyonu" },
            { href: "/erkek", label: "Erkek Koleksiyonu" },
            { href: "/kampanya", label: "Kampanyalar" },
            { href: "/iade-degisim", label: "İade & Değişim" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-[10px] tracking-wider text-warm-gray border border-light-gray px-3 py-2 hover:border-charcoal hover:text-charcoal transition-all">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
