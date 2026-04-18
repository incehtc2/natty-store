import { products } from "../../lib/data";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";

export default function KadinPage() {
  const ayakkabi = products.filter(p => p.category === "kadin" && p.type === "ayakkabi");
  const canta = products.filter(p => p.category === "kadin" && p.type === "canta");
  const kampanya = products.filter(p => p.category === "kadin" && p.originalPrice);

  return (
    <div className="min-h-screen bg-cream">
      {/* Başlık */}
      <div className="border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[9px] tracking-mega text-warm-gray mb-3 font-medium">2026 KOLEKSİYONU</p>
              <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-wide text-charcoal leading-none">Kadın</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] tracking-ultra text-warm-gray font-light">{ayakkabi.length + canta.length} ürün</span>
              {kampanya.length > 0 && (
                <Link href="/kampanya" className="text-[10px] tracking-ultra text-gold border border-gold/40 px-3 py-1.5 hover:bg-gold hover:text-cream transition-all duration-300">
                  {kampanya.length} KAMPANYALI ÜRÜN
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <span className="block w-10 h-px bg-gold" />
            <p className="text-sm text-warm-gray font-light tracking-wide">Zarafet ve şıklığın buluştuğu modern tasarımlar</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 space-y-20">
        {/* Ayakkabı */}
        {ayakkabi.length > 0 && (
          <section>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[10px] font-medium tracking-ultra text-charcoal/40">AYAKKABI</h2>
              <span className="flex-1 h-px bg-light-gray" />
              <span className="text-[10px] text-warm-gray font-light">{ayakkabi.length} ürün</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
              {ayakkabi.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Çanta */}
        {canta.length > 0 && (
          <section>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[10px] font-medium tracking-ultra text-charcoal/40">ÇANTA</h2>
              <span className="flex-1 h-px bg-light-gray" />
              <span className="text-[10px] text-warm-gray font-light">{canta.length} ürün</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
              {canta.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
