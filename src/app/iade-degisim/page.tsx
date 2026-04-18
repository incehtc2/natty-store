import Link from "next/link";
import { RotateCcw, Package, Clock, Check } from "lucide-react";

export default function IadeDegisimPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-[#18160f] py-20 px-6 text-center">
        <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">MÜŞTERİ HİZMETLERİ</p>
        <h1 className="text-4xl font-serif font-medium text-white">İade & Değişim</h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        {/* Adımlar */}
        <section>
          <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-8">İADE SÜRECİ</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-light-gray">
            {[
              { icon: RotateCcw, step: "01", title: "İade Talebi", desc: "Müşteri hizmetlerimize ulaşın veya e-posta gönderin. Size iade formu iletilir." },
              { icon: Package, step: "02", title: "Ürünü Gönderin", desc: "Ürünü orijinal ambalajında, etiketi çıkarılmamış halde belirtilen adrese gönderin." },
              { icon: Check, step: "03", title: "Geri Ödeme", desc: "Ürün kontrolünden sonra 3-5 iş günü içinde ödemeniz iade edilir." },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-cream p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] tracking-widest text-warm-gray/40 font-medium">{step}</span>
                  <Icon size={16} strokeWidth={1.5} className="text-warm-gray" />
                </div>
                <h3 className="text-sm font-medium text-charcoal mb-2">{title}</h3>
                <p className="text-xs text-warm-gray font-light leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Koşullar */}
        <section>
          <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-5">İADE KOŞULLARI</p>
          <div className="border border-light-gray p-8 space-y-4">
            {[
              "Teslimattan itibaren 14 gün içinde iade talebinde bulunulmalıdır.",
              "Ürün kullanılmamış, yıkanmamış ve hasar görmemiş olmalıdır.",
              "Orijinal etiket ve ambalaj eksiksiz olmalıdır.",
              "Özel sipariş ve kişiselleştirilmiş ürünler iade kapsamı dışındadır.",
              "Kusurlu veya yanlış gönderilen ürünlerde kargo ücreti NATTY'ye aittir.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-warm-gray/40 mt-2 flex-shrink-0" />
                <p className="text-sm text-warm-gray font-light">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Süre */}
        <section>
          <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-5">GERİ ÖDEME SÜRESİ</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Clock, title: "Kredi Kartı", desc: "Bankanıza bağlı olarak 3–7 iş günü içinde hesabınıza yansır." },
              { icon: Clock, title: "Havale / EFT", desc: "Onaydan sonra 1–3 iş günü içinde banka hesabınıza aktarılır." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 p-6 border border-light-gray">
                <Icon size={18} strokeWidth={1.5} className="text-warm-gray flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-charcoal mb-1">{title}</p>
                  <p className="text-xs text-warm-gray font-light leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <p className="text-sm text-warm-gray font-light mb-5">Sorularınız için bize ulaşın.</p>
          <Link href="/iletisim" className="inline-block bg-charcoal text-cream px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors">
            İLETİŞİM
          </Link>
        </div>
      </div>
    </div>
  );
}
