import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/queries";
import ProductCard from "../components/ProductCard";
import NewsletterForm from "../components/NewsletterForm";

export const revalidate = 300;

const MARQUEE = [
  "EL İŞÇİLİĞİ", "HAKİKİ DERİ", "TÜRK TASARIMI", "2026 KOLEKSİYONU",
  "SINIRLI SAYIDA", "EL İŞÇİLİĞİ", "HAKİKİ DERİ", "TÜRK TASARIMI",
  "2026 KOLEKSİYONU", "SINIRLI SAYIDA",
];

export default async function Home() {
  const [rawKampanya, rawYeni] = await Promise.all([
    getProducts({ kampanya: true }),
    getProducts({ yeni: true }),
  ]);
  const toCard = (p: typeof rawKampanya[0]) => ({
    id: p.id, name: p.name, category: p.category as "kadin" | "erkek",
    type: p.type as "ayakkabi" | "canta", price: p.price, image: p.image,
    description: p.description, badge: p.badge ?? undefined, stock: p.stock ?? 0,
    originalPrice: p.original_price ?? undefined, isNew: p.is_new,
  });
  const kampanyaUrunleri = rawKampanya.map(toCard);
  const yeniUrunler = rawYeni.map(toCard);
  return (
    <div className="bg-cream">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[calc(100vh-100px)] overflow-hidden">
        {/* Arka plan görseli */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="NATTY Koleksiyonu"
            fill
            priority
            className="object-cover object-center animate-ken-burns"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/50 to-charcoal/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
        </div>

        {/* İçerik */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-[9px] tracking-mega text-gold/80 mb-7 font-medium">
              NATTY · SS 2026
            </p>
            <h1 className="text-6xl md:text-8xl lg:text-[96px] font-serif font-medium text-white leading-[0.95] mb-7 tracking-tight">
              Zamanın<br />
              Ötesinde<br />
              <span className="text-gold">Zarafet</span>
            </h1>
            <p className="text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md mb-10">
              El işçiliği. Hakiki deri. Her parçada hissedilen ustalık.
              NATTY, kalıcı şıklığın adresi.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/kadin"
                className="bg-cream text-charcoal px-8 py-4 text-[10px] tracking-ultra font-medium hover:bg-gold hover:text-cream transition-all duration-300"
              >
                KADIN KOLEKSİYONU
              </Link>
              <Link
                href="/erkek"
                className="border border-white/40 text-white px-8 py-4 text-[10px] tracking-ultra hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                ERKEK KOLEKSİYONU
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indikatörü */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-[8px] tracking-mega text-white/30 font-medium">KAYDIRIN</span>
          <div className="w-px h-10 bg-white/20 overflow-hidden">
            <div className="w-full h-full bg-white/60 animate-scroll-line" />
          </div>
        </div>

        {/* Sağ alt: hızlı istatistik */}
        <div className="absolute bottom-10 right-6 lg:right-10 z-10 hidden md:flex gap-8">
          {[["200+", "Ürün"], ["15", "Yıl"], ["%100", "Deri"]].map(([v, l]) => (
            <div key={l} className="text-right">
              <p className="text-xl font-serif text-white/80">{v}</p>
              <p className="text-[9px] tracking-widest text-white/30 font-light">{l.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────── */}
      <div className="border-y border-light-gray py-3.5 overflow-hidden bg-cream">
        <div className="marquee-track">
          {MARQUEE.concat(MARQUEE).map((t, i) => (
            <span key={i} className="flex items-center gap-5 pr-5">
              <span className="text-[10px] tracking-ultra font-medium text-charcoal/35 whitespace-nowrap">{t}</span>
              <span className="w-1 h-1 rounded-full bg-gold/60 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── MARKA MANİFESTO ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Sol: Metin */}
          <div>
            <p className="text-[9px] tracking-mega text-gold mb-6 font-medium">NATTY HAKKINDA</p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal leading-[1.2] mb-6">
              Bir çift ayakkabı<br />
              sadece giyilmez—<br />
              <em className="not-italic text-warm-gray">yaşanır.</em>
            </h2>
            <p className="text-sm text-warm-gray font-light leading-[1.9] mb-8 max-w-lg">
              NATTY, Türkiye&apos;nin en köklü deri ustalarıyla kurduğu 15 yıllık işbirliğinin ürünüdür.
              Her parça; elle seçilmiş birinci kalite hammadde, saatlerce titiz el işçiliği ve
              mükemmeli arama tutkusuyla hayata geçirilir. Aldığınız her ürün, yıllarca
              yanınızda olacak bir yatırım ve size özgü bir imzadır.
            </p>
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-light-gray">
              {[
                ["15+", "Yıllık\nTecrübe"],
                ["%100", "Hakiki\nDeri"],
                ["El", "İşçiliği"],
              ].map(([val, lbl]) => (
                <div key={lbl}>
                  <p className="text-3xl font-serif text-charcoal mb-1">{val}</p>
                  <p className="text-[10px] tracking-widest text-warm-gray font-light leading-tight whitespace-pre-line">{lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ: Görsel kolaj */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative overflow-hidden bg-cream-dark row-span-2" style={{ paddingBottom: "140%" }}>
              <Image src="/images/kadin/6.jpg" alt="NATTY Çanta" fill className="absolute inset-0 object-cover object-center hover:scale-105 transition-transform duration-700" sizes="25vw" />
            </div>
            <div className="relative overflow-hidden bg-cream-dark" style={{ paddingBottom: "100%" }}>
              <Image src="/images/erkek/kolaj.jpg" alt="NATTY Erkek" fill className="absolute inset-0 object-cover object-center hover:scale-105 transition-transform duration-700" sizes="25vw" />
            </div>
            <div className="relative overflow-hidden bg-cream-dark" style={{ paddingBottom: "100%" }}>
              <Image src="/images/kadin/nud.jpg" alt="NATTY Kadın" fill className="absolute inset-0 object-cover object-center hover:scale-105 transition-transform duration-700" sizes="25vw" />
            </div>
          </div>
        </div>
      </section>

      {/* ── YENİ GELENLER ─────────────────────────────────────── */}
      <section className="border-t border-light-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">SS 2026</p>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-charcoal tracking-wide">Yeni Gelenler</h2>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/kadin" className="text-[10px] tracking-ultra text-warm-gray hover:text-charcoal transition-colors underline underline-offset-4">Kadın →</Link>
              <Link href="/erkek" className="text-[10px] tracking-ultra text-warm-gray hover:text-charcoal transition-colors underline underline-offset-4">Erkek →</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-12">
            {yeniUrunler.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="mt-12 text-center md:hidden">
            <Link href="/kadin" className="inline-block border border-charcoal text-charcoal px-10 py-3.5 text-[10px] tracking-ultra hover:bg-charcoal hover:text-cream transition-all">
              TÜMÜNÜ GÖR
            </Link>
          </div>
        </div>
      </section>

      {/* ── KAMPANYA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Arka plan: erkek ayakkabı görseli */}
        <div className="absolute inset-0">
          <Image src="/images/erkek/1.png" alt="" fill className="object-cover object-center opacity-20" sizes="100vw" />
          <div className="absolute inset-0 bg-[#18160f]" style={{ opacity: 0.92 }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-5">
            <div>
              <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">SINIRLI SÜRE · YAZ KAMPANYASI</p>
              <h2 className="text-5xl md:text-6xl font-serif font-medium tracking-wide text-white leading-none mb-4">
                Özel Fiyatlar
              </h2>
              <p className="text-sm text-white/40 font-light">
                Seçili koleksiyonlarda <span className="text-gold font-medium">%30&apos;a varan</span> indirim
              </p>
            </div>
            <Link
              href="/kampanya"
              className="self-start md:self-auto border border-gold/50 text-gold py-3.5 px-8 text-[10px] tracking-ultra hover:bg-gold hover:border-gold hover:text-cream transition-all duration-300"
            >
              TÜM KAMPANYALAR →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {kampanyaUrunleri.slice(0, 8).map(p => (
              <Link key={p.id} href={`/urun/${p.id}`} className="group block">
                <div className="relative w-full overflow-hidden bg-[#2a2720]" style={{ paddingBottom: "133.33%" }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-gold text-cream text-[9px] tracking-wider px-2 py-1 font-semibold leading-none">
                    -%{Math.round((1 - p.price / p.originalPrice!) * 100)}
                  </span>
                </div>
                <div className="pt-3 space-y-1">
                  <h3 className="text-sm font-medium text-white/75 group-hover:text-white transition-colors line-clamp-1">{p.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-gold">{p.price.toLocaleString("tr-TR")} ₺</span>
                    <span className="text-xs text-white/25 line-through">{p.originalPrice!.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEĞERLERİMİZ ──────────────────────────────────────── */}
      <section className="border-y border-light-gray bg-[#f0ece5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Hakiki Deri",
                body: "Tüm ürünlerimiz %100 birinci kalite hakiki deriden üretilir. Sentetik malzeme kullanılmaz.",
              },
              {
                num: "02",
                title: "El İşçiliği",
                body: "Her parça, ustalığını nesiller boyunca sürdüren Türk deri ustalarının elleri tarafından işlenir.",
              },
              {
                num: "03",
                title: "Ömür Boyu Kalite",
                body: "Doğru bakımla yıllarca kullanılabilecek şekilde tasarlanan ürünler, zamanla güzelleşir.",
              },
              {
                num: "04",
                title: "Ücretsiz Kargo & İade",
                body: "5000 ₺ üzeri siparişlerde ücretsiz kargo, 30 gün içinde koşulsuz iade garantisi.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="flex flex-col">
                <span className="text-[10px] font-medium text-gold tracking-widest mb-4">{num}</span>
                <div className="w-8 h-px bg-gold mb-4" />
                <h3 className="text-base font-medium text-charcoal mb-3">{title}</h3>
                <p className="text-sm text-warm-gray font-light leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOOKBOOK ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">KOLEKSİYON</p>
            <h2 className="text-3xl font-serif font-medium text-charcoal">Öne Çıkanlar</h2>
          </div>
        </div>
        {/* Asimetrik grid */}
        <div className="grid grid-cols-12 grid-rows-2 gap-3" style={{ height: 600 }}>
          <div className="col-span-5 row-span-2 relative overflow-hidden bg-cream-dark group">
            <Image src="/images/kadin/1.jpg" alt="" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" sizes="40vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="text-white font-serif font-medium text-xl tracking-wide">Bordo Deri Çanta</p>
              <p className="text-white/70 text-xs tracking-widest mt-1">KADİN · ÇANTA</p>
            </div>
          </div>
          <div className="col-span-4 relative overflow-hidden bg-cream-dark group">
            <Image src="/images/erkek/6.jpg" alt="" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" sizes="30vw" />
          </div>
          <div className="col-span-3 relative overflow-hidden bg-cream-dark group">
            <Image src="/images/kadin/pembe.jpg" alt="" fill className="object-cover object-center group-hover:scale-105 transition-transform duration-700" sizes="25vw" />
          </div>
          <div className="col-span-7 relative overflow-hidden bg-[#18160f] group flex items-center justify-center">
            <div className="relative z-10 text-center px-8">
              <p className="text-[9px] tracking-mega text-gold/60 mb-3 font-medium">YAZ 2026</p>
              <h3 className="text-3xl font-serif font-medium tracking-wide text-white mb-5">Koleksiyonu Keşfedin</h3>
              <div className="flex gap-3 justify-center">
                <Link href="/kadin" className="text-[10px] tracking-ultra text-white border-b border-white/30 hover:border-white pb-0.5 transition-colors">
                  Kadın
                </Link>
                <span className="text-white/20">·</span>
                <Link href="/erkek" className="text-[10px] tracking-ultra text-white border-b border-white/30 hover:border-white pb-0.5 transition-colors">
                  Erkek
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ────────────────────────────────────────── */}
      <section className="border-t border-light-gray py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <p className="text-[9px] tracking-mega text-warm-gray mb-4 font-medium">BÜLTEN</p>
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mb-3">
            Yeni koleksiyonlarda<br />ilk siz haberdar olun
          </h2>
          <p className="text-sm text-warm-gray font-light mb-8 leading-relaxed">
            Kampanya duyuruları, özel teklifler ve yeni ürün lansmanları için<br className="hidden md:block" />
            bültenimize abone olun. İstediğiniz zaman çıkabilirsiniz.
          </p>
          <NewsletterForm />
          <p className="text-[10px] text-warm-gray/40 mt-4">
            Gizliliğinize saygı duyuyoruz. Spam göndermiyoruz.
          </p>
        </div>
      </section>

    </div>
  );
}
