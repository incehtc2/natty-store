"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Truck, RefreshCcw, ShieldCheck, ChevronDown, Plus, Minus, Check, Package } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import ProductCard from "../../../components/ProductCard";

type Product = {
  id: string; name: string; category: string; type: string;
  price: number; original_price: number | null; image: string;
  description: string; is_new: boolean; badge: string | null; stock: number;
};

export default function UrunDetayClient({ urun, benzer }: { urun: Product; benzer: Product[] }) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openTab, setOpenTab] = useState("ozellikler");
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const { addToCart, openCart } = useCart();

  const isAyakkabi = urun.type === "ayakkabi";
  const numeralar = urun.category === "kadin" ? [36, 37, 38, 39, 40] : [40, 41, 42, 43, 44, 45];

  const sepeteEkle = () => {
    if (isAyakkabi && !selectedSize) {
      setSizeError(true);
      document.getElementById("numara-secimi")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSizeError(false);
    addToCart({ id: urun.id, name: urun.name, price: urun.price, image: urun.image, quantity, size: selectedSize });
    setAdded(true);
    setTimeout(() => { setAdded(false); openCart(); }, 900);
  };

  const tabs = [
    {
      key: "ozellikler", label: "ÜRÜN ÖZELLİKLERİ",
      content: (
        <ul className="space-y-3">
          {["%100 Hakiki Dana Derisi", "El işçiliği ile üretilmiştir", "Türkiye'de tasarlanmış ve üretilmiştir", "Orijinal kutusu ve toz torbası ile gönderilir", "Bakım: Kuru bezle silin, doğrudan güneşten koruyun"].map(item => (
            <li key={item} className="flex items-start gap-3 text-sm text-warm-gray font-light">
              <span className="mt-2 w-1 h-1 rounded-full bg-gold flex-shrink-0" />{item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "beden", label: "BEDEN REHBERİ",
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-warm-gray font-light">
            <thead><tr className="border-b border-light-gray text-[10px] tracking-widest text-charcoal/50"><th className="text-left py-2 pr-4">EU</th><th className="text-left py-2 pr-4">UK</th><th className="text-left py-2 pr-4">US</th><th className="text-left py-2">CM</th></tr></thead>
            <tbody className="divide-y divide-light-gray">
              {(urun.category === "kadin"
                ? [["36","3","5.5","23"],["37","4","6.5","23.5"],["38","5","7.5","24.5"],["39","6","8.5","25"],["40","7","9.5","25.5"]]
                : [["40","6.5","7.5","25.5"],["41","7.5","8.5","26.5"],["42","8","9","27"],["43","9","10","27.5"],["44","10","11","28.5"],["45","11","12","29"]]
              ).map(([eu,uk,us,cm]) => (
                <tr key={eu}><td className="py-2 pr-4">{eu}</td><td className="py-2 pr-4">{uk}</td><td className="py-2 pr-4">{us}</td><td className="py-2">{cm}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: "kargo", label: "KARGO VE İADE",
      content: (
        <div className="space-y-4 text-sm text-warm-gray font-light">
          <div className="flex gap-3"><Truck size={16} strokeWidth={1} className="flex-shrink-0 mt-0.5 text-gold" /><p>5000 ₺ ve üzeri alışverişlerde ücretsiz kargo.</p></div>
          <div className="flex gap-3"><RefreshCcw size={16} strokeWidth={1} className="flex-shrink-0 mt-0.5 text-gold" /><p>Teslimattan itibaren 30 gün içinde koşulsuz iade.</p></div>
          <div className="flex gap-3"><Package size={16} strokeWidth={1} className="flex-shrink-0 mt-0.5 text-gold" /><p>Tüm siparişler özel NATTY kutusunda gönderilir.</p></div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <nav className="flex items-center gap-2 py-6 text-[10px] tracking-widest text-warm-gray uppercase">
          <Link href="/" className="hover:text-charcoal transition-colors">Anasayfa</Link>
          <span className="text-light-gray">/</span>
          <Link href={`/${urun.category}`} className="hover:text-charcoal transition-colors capitalize">{urun.category}</Link>
          <span className="text-light-gray">/</span>
          <span className="text-charcoal truncate max-w-[180px]">{urun.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 xl:gap-20 pb-20">
          <div className="lg:w-[55%]">
            <div className="lg:sticky lg:top-24">
              <div className="relative w-full overflow-hidden bg-cream-dark group" style={{ paddingBottom: "125%" }}>
                <Image src={urun.image} alt={urun.name} fill className="absolute inset-0 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]" sizes="(max-width: 768px) 100vw, 55vw" priority />
                <button onClick={() => setLiked(l => !l)} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${liked ? "bg-charcoal text-cream" : "bg-cream/80 text-charcoal/50 hover:bg-cream hover:text-charcoal"}`}>
                  <Heart size={16} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-[45%] flex flex-col">
            <div className="pb-7 mb-7 border-b border-light-gray">
              <p className="text-[10px] tracking-ultra text-warm-gray mb-3 uppercase">{urun.category} · {urun.type}</p>
              <h1 className="text-3xl font-serif font-medium text-charcoal mb-4 leading-tight">{urun.name}</h1>
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-2xl font-serif text-charcoal">{urun.price.toLocaleString("tr-TR")} ₺</span>
                {urun.original_price && <span className="text-sm text-warm-gray line-through">{urun.original_price.toLocaleString("tr-TR")} ₺</span>}
                <span className="text-xs text-warm-gray font-light">KDV dahil</span>
              </div>
              <p className="text-sm text-warm-gray font-light leading-relaxed">{urun.description}</p>
            </div>

            {isAyakkabi && (
              <div id="numara-secimi" className="mb-7">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[11px] font-medium tracking-ultra transition-colors ${sizeError ? "text-red-500" : "text-charcoal"}`}>
                    NUMARA SEÇİNİZ{selectedSize && <span className="ml-2 text-gold font-light">— {selectedSize}</span>}
                  </span>
                  <button onClick={() => setOpenTab(openTab === "beden" ? "ozellikler" : "beden")} className="text-[10px] tracking-widest text-gold hover:text-gold-light transition-colors underline underline-offset-4">Beden Rehberi</button>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {numeralar.map(num => (
                    <button key={num} onClick={() => { setSelectedSize(num); setSizeError(false); }} className={`h-12 text-sm font-medium border transition-all duration-200 ${selectedSize === num ? "border-charcoal bg-charcoal text-cream" : sizeError ? "border-red-300 text-warm-gray hover:border-red-400" : "border-light-gray text-warm-gray hover:border-charcoal hover:text-charcoal"}`}>{num}</button>
                  ))}
                </div>
                {sizeError && <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500" />Lütfen bir numara seçiniz</p>}
              </div>
            )}

            <div className="mb-5">
              <span className="text-[11px] font-medium tracking-ultra text-charcoal block mb-3">MİKTAR</span>
              <div className="inline-flex items-center border border-light-gray">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center text-warm-gray hover:text-charcoal hover:bg-cream-dark transition-all" disabled={quantity <= 1}><Minus size={13} /></button>
                <span className="w-12 text-center text-sm font-medium text-charcoal select-none">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center text-warm-gray hover:text-charcoal hover:bg-cream-dark transition-all"><Plus size={13} /></button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={sepeteEkle} disabled={added} className={`flex-1 flex items-center justify-center gap-2 h-14 text-[11px] tracking-ultra font-medium transition-all duration-300 ${added ? "bg-[#2d6a4f] text-cream cursor-default" : "bg-charcoal text-cream hover:bg-charcoal/85 active:scale-[0.99]"}`}>
                {added ? (<><Check size={14} strokeWidth={2.5} />SEPETE EKLENDİ</>) : (<>SEPETE EKLE{urun.price > 0 && <span className="ml-1 opacity-60 font-light">· {(urun.price * quantity).toLocaleString("tr-TR")} ₺</span>}</>)}
              </button>
              <button onClick={() => setLiked(l => !l)} className={`w-14 h-14 border flex items-center justify-center transition-all duration-300 ${liked ? "border-charcoal bg-charcoal text-cream" : "border-light-gray text-warm-gray hover:border-charcoal hover:text-charcoal"}`}>
                <Heart size={18} strokeWidth={1.5} fill={liked ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="grid grid-cols-3 border border-light-gray mb-8">
              {[{ icon: <Truck size={18} strokeWidth={1} />, label: "Ücretsiz\nKargo" }, { icon: <RefreshCcw size={18} strokeWidth={1} />, label: "30 Gün\nİade" }, { icon: <ShieldCheck size={18} strokeWidth={1} />, label: "Güvenli\nÖdeme" }].map((item, i) => (
                <div key={item.label} className={`flex flex-col items-center gap-2 py-5 text-center ${i < 2 ? "border-r border-light-gray" : ""}`}>
                  <span className="text-charcoal/40">{item.icon}</span>
                  <span className="text-[10px] text-warm-gray font-light leading-tight whitespace-pre-line">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-light-gray">
              {tabs.map(tab => (
                <div key={tab.key} className="border-b border-light-gray">
                  <button onClick={() => setOpenTab(openTab === tab.key ? "" : tab.key)} className="w-full py-4 flex justify-between items-center text-[11px] tracking-ultra text-charcoal hover:text-warm-gray transition-colors">
                    <span>{tab.label}</span>
                    <span className="text-warm-gray transition-transform duration-300" style={{ transform: openTab === tab.key ? "rotate(180deg)" : "rotate(0)" }}><ChevronDown size={15} /></span>
                  </button>
                  <div className="overflow-hidden transition-all duration-400 ease-in-out" style={{ maxHeight: openTab === tab.key ? "400px" : "0" }}>
                    <div className="pb-6">{tab.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {benzer.length > 0 && (
          <div className="border-t border-light-gray py-16">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[11px] font-medium tracking-ultra text-charcoal/50 whitespace-nowrap">BENZER ÜRÜNLER</h2>
              <span className="flex-1 h-px bg-light-gray" />
              <Link href={`/${urun.category}`} className="text-[10px] tracking-widest text-warm-gray hover:text-charcoal transition-colors whitespace-nowrap underline underline-offset-4">Tümünü Gör</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {benzer.map(p => <ProductCard key={p.id} product={{ id: p.id, name: p.name, category: p.category, type: p.type, price: p.price, image: p.image, description: p.description, badge: p.badge ?? undefined, stock: p.stock, originalPrice: p.original_price ?? undefined, isNew: p.is_new }} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
