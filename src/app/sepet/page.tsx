"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { products } from "../../lib/data";

export default function SepetPage() {
  const { cartItems, removeFromCart, updateQuantity, updateSize, cartTotal } = useCart();
  const [openSizeFor, setOpenSizeFor] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenSizeFor(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={28} strokeWidth={1} className="text-warm-gray" />
          </div>
          <h1 className="text-2xl font-serif tracking-wide text-charcoal mb-3">Sepetiniz Boş</h1>
          <p className="text-sm text-warm-gray font-light mb-10 leading-relaxed">
            Henüz sepetinize ürün eklemediniz.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/kadin" className="flex items-center justify-center w-full bg-charcoal text-cream py-4 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors">
              KADIN KOLEKSİYONU
            </Link>
            <Link href="/erkek" className="flex items-center justify-center w-full border border-light-gray text-charcoal/70 py-4 text-[10px] tracking-ultra hover:border-charcoal hover:text-charcoal transition-all">
              ERKEK KOLEKSİYONU
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-warm-gray hover:text-charcoal transition-colors mb-6">
            <ArrowLeft size={12} />
            ALIŞVERİŞE DEVAM ET
          </Link>
          <h1 className="text-3xl font-serif font-medium tracking-wide text-charcoal">Alışveriş Sepeti</h1>
          <p className="text-sm text-warm-gray font-light mt-1">{cartItems.length} ürün</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Ürün listesi */}
          <div className="flex-1" ref={dropdownRef}>
            <div className="divide-y divide-light-gray">
              {cartItems.map((item, index) => {
                const urunData = products.find(p => p.id === item.id);
                const isAyakkabi = urunData?.type === "ayakkabi";
                const numeralar = urunData?.category === "kadin" ? [36, 37, 38, 39, 40] : [40, 41, 42, 43, 44, 45];
                const sizeKey = `${item.id}-${item.size}-${index}`;
                const isSizeOpen = openSizeFor === sizeKey;

                return (
                  <div key={sizeKey} className="py-7">
                    <div className="flex gap-5">
                      {/* Görsel — sabit boyut, overflow hidden */}
                      <Link
                        href={`/urun/${item.id}`}
                        className="relative flex-shrink-0 overflow-hidden bg-cream-dark group"
                        style={{ width: 96, height: 120 }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          sizes="96px"
                        />
                      </Link>

                      {/* İçerik */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <Link href={`/urun/${item.id}`}>
                              <h3 className="text-sm font-medium text-charcoal hover:text-warm-gray transition-colors leading-snug truncate pr-1">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-xs text-warm-gray font-light mt-0.5">
                              {item.price.toLocaleString("tr-TR")} ₺ / adet
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-charcoal/20 hover:text-charcoal/60 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            {/* Numara seçici */}
                            {isAyakkabi && (
                              <div className="relative z-20">
                                <button
                                  onClick={() => setOpenSizeFor(isSizeOpen ? null : sizeKey)}
                                  className="flex items-center gap-1.5 border border-light-gray px-3 h-8 text-xs text-warm-gray hover:border-charcoal hover:text-charcoal transition-all bg-cream"
                                >
                                  <span className="text-[10px] tracking-wider text-warm-gray">No:</span>
                                  <span className="font-medium text-charcoal">{item.size ?? "—"}</span>
                                  <ChevronDown
                                    size={10}
                                    className={`transition-transform duration-200 text-warm-gray ${isSizeOpen ? "rotate-180" : ""}`}
                                  />
                                </button>

                                {isSizeOpen && (
                                  <div
                                    className="absolute left-0 mt-1 bg-cream border border-light-gray shadow-lg"
                                    style={{ zIndex: 50, top: "100%" }}
                                  >
                                    <div className="flex flex-wrap" style={{ width: numeralar.length > 5 ? 192 : 160 }}>
                                      {numeralar.map(n => (
                                        <button
                                          key={n}
                                          onMouseDown={e => {
                                            e.preventDefault();
                                            if (n !== item.size) updateSize(item.id, item.size, n);
                                            setOpenSizeFor(null);
                                          }}
                                          className={`w-10 h-10 text-xs font-medium border-r border-b border-light-gray transition-colors ${
                                            n === item.size
                                              ? "bg-charcoal text-cream"
                                              : "bg-cream text-warm-gray hover:bg-cream-dark hover:text-charcoal"
                                          }`}
                                        >
                                          {n}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Adet */}
                            <div className="flex items-center border border-light-gray bg-cream">
                              <button
                                onClick={() => updateQuantity(item.id, item.size, -1)}
                                className="w-8 h-8 flex items-center justify-center text-warm-gray hover:text-charcoal hover:bg-cream-dark transition-all"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="w-7 text-center text-xs font-medium text-charcoal select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.size, 1)}
                                className="w-8 h-8 flex items-center justify-center text-warm-gray hover:text-charcoal hover:bg-cream-dark transition-all"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-medium text-charcoal">
                            {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sipariş özeti */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-[#f0ece5] p-7 lg:sticky lg:top-24">
              <h2 className="text-[10px] tracking-ultra font-medium text-charcoal mb-6">SİPARİŞ ÖZETİ</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray font-light">Ara Toplam</span>
                  <span className="text-charcoal">{cartTotal.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray font-light">Kargo</span>
                  <span className="text-[11px] font-medium text-green-700 tracking-wider">ÜCRETSİZ</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline pt-5 border-t border-[#ddd9d2] mb-6">
                <span className="text-[10px] tracking-ultra font-medium text-charcoal">TOPLAM</span>
                <span className="text-xl font-serif text-charcoal">{cartTotal.toLocaleString("tr-TR")} ₺</span>
              </div>
              <Link
                href="/odeme"
                className="flex items-center justify-center w-full bg-charcoal text-cream py-4 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors mb-3"
              >
                ÖDEMEYE GEÇ
              </Link>
              <Link
                href="/kadin"
                className="flex items-center justify-center w-full border border-light-gray text-charcoal/60 py-3.5 text-[10px] tracking-ultra hover:border-charcoal hover:text-charcoal transition-all"
              >
                ALIŞVERİŞE DEVAM ET
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
