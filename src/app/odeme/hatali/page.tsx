"use client";

import { use } from "react";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react";

export default function HataliPage({ searchParams }: { searchParams: Promise<{ neden?: string }> }) {
  const { neden } = use(searchParams);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* İkon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
            <XCircle size={44} strokeWidth={1} className="text-red-500" />
          </div>
        </div>

        {/* Başlık */}
        <h1 className="text-3xl font-serif font-medium text-charcoal mb-3">Ödeme Başarısız</h1>
        <p className="text-sm text-warm-gray font-light mb-6 leading-relaxed">
          Ödemeniz işlenirken bir sorun oluştu. Sepetinizdeki ürünler korunmaktadır.
        </p>

        {/* Hata detayı */}
        {neden && neden !== "sunucu-hatasi" && neden !== "token-yok" && (
          <div className="bg-red-50 border border-red-100 p-4 mb-8 text-sm text-red-600 font-light">
            {decodeURIComponent(neden)}
          </div>
        )}

        {/* Olası nedenler */}
        <div className="bg-[#f0ece5] p-6 mb-8 text-left">
          <p className="text-[10px] tracking-ultra font-medium text-charcoal mb-4">OLASI NEDENLER</p>
          <ul className="space-y-2 text-sm text-warm-gray font-light">
            {[
              "Kart bilgilerinin hatalı girilmesi",
              "Yetersiz bakiye veya limit",
              "Bankanızın işlemi reddetmesi",
              "3D Secure şifresinin yanlış girilmesi",
            ].map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1 h-1 rounded-full bg-warm-gray/50 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Butonlar */}
        <div className="flex flex-col gap-3">
          <Link
            href="/odeme"
            className="flex items-center justify-center gap-2 w-full bg-charcoal text-cream py-4 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors duration-300"
          >
            <RefreshCw size={13} />
            TEKRAR DENE
          </Link>
          <Link
            href="/sepet"
            className="flex items-center justify-center gap-2 w-full border border-light-gray text-charcoal/70 py-4 text-[10px] tracking-ultra hover:border-charcoal hover:text-charcoal transition-all duration-300"
          >
            <ArrowLeft size={12} />
            SEPETimE DÖN
          </Link>
        </div>
      </div>
    </div>
  );
}
