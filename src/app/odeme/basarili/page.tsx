"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { useCart } from "../../../context/CartContext";

export default function BasariliPage({ searchParams }: { searchParams: Promise<{ odemeId?: string; tutar?: string }> }) {
  const { odemeId, tutar } = use(searchParams);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* İkon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 size={44} strokeWidth={1} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Başlık */}
        <h1 className="text-3xl font-serif font-medium text-charcoal mb-3">Siparişiniz Alındı</h1>
        <p className="text-sm text-warm-gray font-light mb-8 leading-relaxed">
          Ödemeniz başarıyla tamamlandı. Siparişiniz en kısa sürede hazırlanıp kargoya verilecektir.
        </p>

        {/* Sipariş detayları */}
        <div className="bg-[#f0ece5] p-6 mb-8 text-left space-y-3">
          {odemeId && (
            <div className="flex justify-between text-sm">
              <span className="text-warm-gray font-light">Sipariş No</span>
              <span className="text-charcoal font-medium font-mono text-xs">{odemeId}</span>
            </div>
          )}
          {tutar && (
            <div className="flex justify-between text-sm">
              <span className="text-warm-gray font-light">Ödenen Tutar</span>
              <span className="text-charcoal font-medium">{parseFloat(tutar).toLocaleString("tr-TR")} ₺</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray font-light">Tahmini Teslimat</span>
            <span className="text-charcoal font-medium">3-5 iş günü</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-warm-gray font-light">Kargo</span>
            <span className="text-green-700 font-medium text-[11px] tracking-wider">ÜCRETSİZ</span>
          </div>
        </div>

        {/* Bilgi */}
        <div className="flex items-start gap-3 text-xs text-warm-gray font-light bg-cream border border-light-gray p-4 mb-8 text-left">
          <Package size={14} className="flex-shrink-0 mt-0.5 text-gold" />
          <p>Siparişiniz özel NATTY kutusunda, toz torbası ve bakım kartıyla birlikte gönderilecektir. Kargo takip numaranız e-posta ile iletilecektir.</p>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-charcoal text-cream py-4 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors duration-300"
          >
            ANASAYFAYA DÖN
            <ArrowRight size={13} />
          </Link>
          <Link
            href="/kadin"
            className="flex items-center justify-center w-full border border-light-gray text-charcoal/70 py-4 text-[10px] tracking-ultra hover:border-charcoal hover:text-charcoal transition-all duration-300"
          >
            ALIŞVERİŞE DEVAM ET
          </Link>
        </div>
      </div>
    </div>
  );
}
