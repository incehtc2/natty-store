"use client";

import { X, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSlider({ isOpen, onClose }: CartSliderProps) {
  const { cartItems, removeFromCart, cartTotal } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-charcoal/50 backdrop-blur-[2px] z-[60] transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-cream z-[70] flex flex-col transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Başlık */}
        <div className="flex items-center justify-between px-7 h-16 border-b border-light-gray">
          <div className="flex items-center gap-3">
            <ShoppingBag size={16} strokeWidth={1.5} className="text-charcoal/50" />
            <h2 className="text-[11px] font-medium tracking-ultra text-charcoal">
              SEPETİM
              {cartItems.length > 0 && (
                <span className="ml-2 text-warm-gray font-light">({cartItems.length})</span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal/40 hover:text-charcoal transition-colors duration-300"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* İçerik */}
        <div className="flex-grow overflow-y-auto px-7 py-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 rounded-full bg-light-gray flex items-center justify-center mb-6">
                <ShoppingBag size={24} strokeWidth={1} className="text-warm-gray" />
              </div>
              <p className="text-sm text-warm-gray font-light mb-2">Sepetiniz boş</p>
              <p className="text-xs text-warm-gray/70 mb-10">Koleksiyonumuzu keşfedin</p>
              <div className="w-full space-y-3">
                <Link
                  href="/kadin"
                  onClick={onClose}
                  className="flex items-center justify-center w-full border border-charcoal text-charcoal py-3.5 text-[10px] tracking-ultra hover:bg-charcoal hover:text-cream transition-all duration-300"
                >
                  KADIN KOLEKSİYONU
                </Link>
                <Link
                  href="/erkek"
                  onClick={onClose}
                  className="flex items-center justify-center w-full border border-charcoal/30 text-charcoal/70 py-3.5 text-[10px] tracking-ultra hover:border-charcoal hover:text-charcoal transition-all duration-300"
                >
                  ERKEK KOLEKSİYONU
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-light-gray">
              {cartItems.map((item, index) => (
                <div key={`${item.id}-${item.size}-${index}`} className="flex gap-5 py-5">
                  <div className="relative w-20 h-[100px] bg-cream-dark flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-medium text-charcoal leading-tight pr-1 truncate">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-charcoal/25 hover:text-charcoal/70 transition-colors flex-shrink-0 mt-0.5"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="space-y-1 mt-1">
                      {item.size && (
                        <p className="text-xs text-warm-gray">Numara: {item.size}</p>
                      )}
                      <p className="text-xs text-warm-gray">Adet: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-charcoal mt-2">
                      {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Alt: Ödeme */}
        {cartItems.length > 0 && (
          <div className="border-t border-light-gray bg-cream px-7 py-6">
            <div className="flex justify-between items-baseline mb-5">
              <span className="text-[10px] tracking-ultra text-warm-gray">ARA TOPLAM</span>
              <span className="text-lg font-serif text-charcoal">
                {cartTotal.toLocaleString("tr-TR")} ₺
              </span>
            </div>
            <Link
              href="/sepet"
              onClick={onClose}
              className="flex items-center justify-center w-full bg-charcoal text-cream py-4 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors duration-300 mb-3"
            >
              SEPETE GİT
            </Link>
            <button className="flex items-center justify-center w-full border border-gold text-gold py-4 text-[10px] tracking-ultra hover:bg-gold hover:text-cream transition-all duration-300">
              GÜVENLİ ÖDEME
            </button>
            <p className="text-[10px] text-warm-gray/60 text-center mt-4 leading-relaxed">
              Kargo ve vergiler ödeme adımında hesaplanır.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
