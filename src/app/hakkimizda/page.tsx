import Link from "next/link";

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-[#18160f] py-28 px-6 text-center">
        <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">NATTY HAKKINDA</p>
        <h1 className="text-4xl sm:text-5xl font-serif font-medium text-white leading-tight max-w-2xl mx-auto">
          Zarafet, ustalık<br />ve özgünlükle<br />örülmüş bir marka
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Hikaye */}
        <section>
          <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-5">HİKAYEMİZ</p>
          <h2 className="text-2xl font-serif font-medium text-charcoal mb-6">Deriden gelen bir tutku</h2>
          <div className="space-y-4 text-sm text-warm-gray font-light leading-relaxed">
            <p>
              NATTY, 2010 yılında İstanbul&apos;da küçük bir atölye olarak hayat buldu. Kurucularımız, Türkiye&apos;nin köklü deri işçiliği geleneğini modern tasarım anlayışıyla buluşturma hayaliyle yola çıktı.
            </p>
            <p>
              Yıllar içinde büyüyen koleksiyonumuz, her zaman aynı değer etrafında şekillendi: kalite. Her bir parça, seçkin deri ustalığı ve titiz el işçiliğiyle hayata geçirilmektedir.
            </p>
            <p>
              Bugün NATTY; ayakkabı ve çanta koleksiyonlarıyla Türkiye&apos;nin premium moda arenasında kendine has bir yer edinmiştir. Her ürünümüz, estetik bir vizyon ve dayanıklılık odaklı üretim anlayışının somut ifadesidir.
            </p>
          </div>
        </section>

        {/* Değerler */}
        <section>
          <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-5">DEĞERLERİMİZ</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-light-gray">
            {[
              { title: "Kalite", desc: "Sadece en seçkin hammaddeler ve zanaatkarlık usulü üretim." },
              { title: "Sürdürülebilirlik", desc: "Sorumlu kaynaklama ve uzun ömürlü tasarım ilkeleriyle çevre bilinci." },
              { title: "Özgünlük", desc: "Her koleksiyon, Türk deri geleneğinden ilham alan orijinal tasarımlar içerir." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-cream p-8">
                <h3 className="text-base font-medium text-charcoal mb-3">{title}</h3>
                <p className="text-sm text-warm-gray font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Rakamlar */}
        <section className="bg-[#18160f] py-12 px-10 grid grid-cols-3 gap-6 text-center">
          {[["200+", "Ürün"], ["15+", "Yıl Deneyim"], ["%100", "Gerçek Deri"]].map(([v, l]) => (
            <div key={l}>
              <p className="text-3xl font-serif text-gold mb-1">{v}</p>
              <p className="text-[10px] tracking-wider text-white/40">{l}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-sm text-warm-gray font-light mb-6">Koleksiyonumuzu keşfetmeye hazır mısınız?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/kadin" className="bg-charcoal text-cream px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors">
              KADIN KOLEKSİYONU
            </Link>
            <Link href="/erkek" className="border border-charcoal text-charcoal px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal hover:text-cream transition-all">
              ERKEK KOLEKSİYONU
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
