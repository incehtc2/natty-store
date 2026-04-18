"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function FavorilerPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-mega text-warm-gray mb-1 font-medium">HESABIM</p>
        <h2 className="text-2xl font-serif font-medium text-charcoal">Favorilerim</h2>
      </div>

      <div className="border border-dashed border-light-gray p-16 text-center">
        <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
          <Heart size={22} strokeWidth={1} className="text-warm-gray" />
        </div>
        <p className="text-sm text-warm-gray font-light mb-2">Favori listeniz boş.</p>
        <p className="text-xs text-warm-gray/60 font-light mb-6">Beğendiğiniz ürünleri kalp ikonuna tıklayarak favorilere ekleyebilirsiniz.</p>
        <Link
          href="/"
          className="inline-block bg-charcoal text-cream px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors"
        >
          ALIŞVERİŞE BAŞLA
        </Link>
      </div>
    </div>
  );
}
