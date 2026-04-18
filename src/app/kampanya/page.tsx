import { kampanyaUrunleri } from "../../lib/data";
import ProductCard from "../../components/ProductCard";

export default function KampanyaPage() {
  const kadin = kampanyaUrunleri.filter(p => p.category === "kadin");
  const erkek = kampanyaUrunleri.filter(p => p.category === "erkek");
  const toplamTasarruf = kampanyaUrunleri.reduce(
    (sum, p) => sum + ((p.originalPrice ?? p.price) - p.price), 0
  );

  return (
    <div className="min-h-screen bg-cream">

      {/* Hero */}
      <div className="bg-[#18160f] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "repeating-linear-gradient(45deg, #a8865a 0, #a8865a 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <p className="text-[9px] tracking-mega text-gold/70 mb-5 font-medium">SINIRLI SÜRE</p>
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-wide text-white leading-none mb-5">Kampanya</h1>
          <p className="text-sm text-white/40 font-light mb-8">
            Seçili ürünlerde %30&apos;a varan indirim <br /> Stoklar sınırlıdır
          </p>
          <div className="flex items-center justify-center gap-10">
            {[
             

              
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center">
                <p className="text-2xl font-serif text-gold mb-1">{val}</p>
                <p className="text-[9px] tracking-widest text-white/30 font-light">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

   

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

        {/* Kadın */}
        {kadin.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[11px] font-medium tracking-ultra text-charcoal/40 whitespace-nowrap">KADIN</h2>
              <span className="flex-1 h-px bg-light-gray" />
              <span className="text-[11px] text-warm-gray font-light">{kadin.length} ürün</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {kadin.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Erkek */}
        {erkek.length > 0 && (
          <section>
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-[11px] font-medium tracking-ultra text-charcoal/40 whitespace-nowrap">ERKEK</h2>
              <span className="flex-1 h-px bg-light-gray" />
              <span className="text-[11px] text-warm-gray font-light">{erkek.length} ürün</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {erkek.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* Bilgi kutusu */}
        <div className="mt-20 border border-light-gray p-8 flex flex-col sm:flex-row gap-8 items-start">
          {[
            { t: "Ücretsiz Kargo", d: "Kampanyalı ürünlerde tüm siparişlere ücretsiz kargo." },
            { t: "30 Gün İade", d: "Beğenmediğiniz ürünü 30 gün içinde iade edebilirsiniz." },
            { t: "Stok Tükenmeden", d: "Kampanya ürünleri sınırlı stokla sunulmaktadır." },
          ].map(({ t, d }) => (
            <div key={t} className="flex-1">
              <div className="w-6 h-px bg-gold mb-3" />
              <p className="text-sm font-medium text-charcoal mb-1">{t}</p>
              <p className="text-xs text-warm-gray font-light leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
