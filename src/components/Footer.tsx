import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-10">
        {/* Üst bölüm */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Marka */}
          <div className="md:col-span-4">
            <h3 className="text-4xl font-brand font-medium tracking-[0.25em] mb-5 text-cream leading-none">
              NATTY
            </h3>
            <p className="text-sm text-white/40 font-light leading-relaxed max-w-xs">
              El işçiliği ve premium deri ustalarının buluştuğu koleksiyon. Her parça, sonsuz özen ve üstün kalite anlayışıyla hayata geçirilmiştir.
            </p>
          </div>

          {/* Boşluk */}
          <div className="md:col-span-2" />

          {/* Keşfet */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-ultra font-medium text-white/30 mb-6">KEŞFEDİN</h4>
            <nav className="flex flex-col gap-3.5">
              <Link href="/kadin" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">Kadın Koleksiyonu</Link>
              <Link href="/erkek" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">Erkek Koleksiyonu</Link>
              <Link href="/kampanya" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">Kampanyalar</Link>
              <Link href="/hakkimizda" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">Hakkımızda</Link>
            </nav>
          </div>

          {/* Yardım */}
          <div className="md:col-span-3">
            <h4 className="text-[10px] tracking-ultra font-medium text-white/30 mb-6">YARDIM</h4>
            <nav className="flex flex-col gap-3.5">
              <Link href="/hesabim/siparisler" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">Sipariş Takibi</Link>
              <Link href="/iade-degisim" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">İade ve Değişim</Link>
              <Link href="/sss" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">Sık Sorulan Sorular</Link>
              <Link href="/iletisim" className="text-sm text-white/60 hover:text-cream transition-colors duration-300 font-light">İletişim</Link>
            </nav>
          </div>
        </div>

        {/* Alt bölüm */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/25 tracking-wider">
            © {new Date().getFullYear()} NATTY. Tüm Hakları Saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/gizlilik" className="text-[11px] text-white/25 hover:text-white/50 transition-colors tracking-wider">Gizlilik Politikası</Link>
            <span className="text-white/15">·</span>
            <Link href="/kullanim-kosullari" className="text-[11px] text-white/25 hover:text-white/50 transition-colors tracking-wider">Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
