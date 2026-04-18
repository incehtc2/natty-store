"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    category: "SİPARİŞ",
    items: [
      { q: "Siparişimi nasıl takip edebilirim?", a: "Üye olduğunuz takdirde hesabım > siparişlerim sayfasından siparişlerinizi anlık olarak takip edebilirsiniz. Ayrıca kargo şirketi tarafından SMS ile bilgilendirme yapılır." },
      { q: "Siparişimi iptal edebilir miyim?", a: "Siparişiniz kargoya verilmeden önce müşteri hizmetlerimizle iletişime geçerek iptal işlemi başlatabilirsiniz. Kargoya verildikten sonra iptal mümkün değildir; iade sürecini kullanabilirsiniz." },
      { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Kredi kartlarında 3 taksit imkânı mevcuttur." },
    ],
  },
  {
    category: "TESLİMAT",
    items: [
      { q: "Teslimat süresi ne kadar?", a: "Siparişleriniz 1-3 iş günü içinde kargoya verilir. Kargo süresi 1-2 iş günüdür. Toplam 2-5 iş günü içinde teslim edilir." },
      { q: "Ücretsiz kargo var mı?", a: "5000 TL ve üzeri alışverişlerinizde ücretsiz kargo uygulanmaktadır." },
      { q: "Yurt dışına gönderim yapıyor musunuz?", a: "Şu an için yalnızca Türkiye'ye gönderim yapılmaktadır. Yurt dışı gönderim seçeneği yakında eklenecektir." },
    ],
  },
  {
    category: "İADE & DEĞİŞİM",
    items: [
      { q: "İade süresi ne kadar?", a: "Ürünü teslim aldıktan sonra 14 gün içinde iade talebinde bulunabilirsiniz. Ürünün kullanılmamış, etiketi yerinde ve orijinal ambalajında olması gerekmektedir." },
      { q: "İade kargo ücreti kime ait?", a: "Ürün kusurlu ya da yanlış ise iade kargo ücreti NATTY'ye aittir. Diğer durumlarda iade kargo ücreti müşteriye aittir." },
      { q: "Beden değişimi yapabilir miyim?", a: "Ürünü teslim aldıktan sonra 14 gün içinde, ürün kullanılmamış ve etiketi yerinde olmak kaydıyla beden değişimi yapabilirsiniz." },
    ],
  },
  {
    category: "ÜRÜN",
    items: [
      { q: "Ürünler gerçek deri mi?", a: "Evet, tüm NATTY ürünleri %100 gerçek deri kullanılarak üretilmektedir. Ürün detay sayfalarında kullanılan deri türü belirtilmektedir." },
      { q: "Deri ürünler nasıl bakım yapılmalı?", a: "Deri ürünlerinizi doğrudan güneş ışığından ve nemden uzak tutun. Ayda bir kez deri bakım kremi uygulamanız ürünün ömrünü uzatır. Islak mendil ve çözücülerden kaçının." },
      { q: "Beden rehberini nerede bulabilirim?", a: "Her ürün detay sayfasında 'Beden Rehberi' bölümü bulunmaktadır. EU, UK, US ve CM ölçü karşılıklarını görebilirsiniz." },
    ],
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-light-gray last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-sm font-medium text-charcoal">{q}</span>
        <ChevronDown size={15} className={`text-warm-gray flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="text-sm text-warm-gray font-light leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

export default function SSSPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-[#18160f] py-20 px-6 text-center">
        <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">YARDIM MERKEZİ</p>
        <h1 className="text-4xl font-serif font-medium text-white">Sık Sorulan Sorular</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20 space-y-12">
        {FAQS.map(({ category, items }) => (
          <section key={category}>
            <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-5">{category}</p>
            <div className="border border-light-gray px-6">
              {items.map(({ q, a }) => (
                <FAQ key={q} q={q} a={a} />
              ))}
            </div>
          </section>
        ))}

        <div className="bg-[#f0ece5] p-8 text-center">
          <p className="text-sm font-medium text-charcoal mb-2">Aradığınız cevabı bulamadınız mı?</p>
          <p className="text-sm text-warm-gray font-light mb-5">Müşteri hizmetlerimiz size yardımcı olmaktan memnuniyet duyar.</p>
          <a href="/iletisim" className="inline-block bg-charcoal text-cream px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors">
            BİZİMLE İLETİŞİME GEÇİN
          </a>
        </div>
      </div>
    </div>
  );
}
