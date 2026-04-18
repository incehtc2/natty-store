"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Loader2, Check } from "lucide-react";

export default function IletisimPage() {
  const [form, setForm] = useState({ isim: "", email: "", konu: "", mesaj: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    setForm({ isim: "", email: "", konu: "", mesaj: "" });
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-[#18160f] py-20 px-6 text-center">
        <p className="text-[9px] tracking-mega text-gold/60 mb-4 font-medium">MÜŞTERİ HİZMETLERİ</p>
        <h1 className="text-4xl font-serif font-medium text-white">İletişim</h1>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Bilgiler */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-6">İLETİŞİM BİLGİLERİ</p>
              <div className="space-y-5">
                {[
                  { icon: Mail, label: "E-POSTA", value: "destek@natty.com.tr" },
                  { icon: Phone, label: "TELEFON", value: "+90 212 000 00 00" },
                  { icon: MapPin, label: "ADRES", value: "Nişantaşı, Abdi İpekçi Cad.\nİstanbul, Türkiye" },
                  { icon: Clock, label: "ÇALIŞMA SAATLERİ", value: "Pzt–Cum: 09:00 – 18:00\nCmt: 10:00 – 14:00" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-cream-dark flex items-center justify-center flex-shrink-0">
                      <Icon size={15} strokeWidth={1.5} className="text-warm-gray" />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-ultra font-medium text-warm-gray/60 mb-1">{label}</p>
                      <p className="text-sm text-charcoal font-light leading-relaxed whitespace-pre-line">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <p className="text-[10px] tracking-ultra font-medium text-warm-gray mb-6">MESAJ GÖNDERIN</p>

            {sent ? (
              <div className="border border-green-200 bg-green-50 p-10 text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check size={20} className="text-green-600" />
                </div>
                <p className="text-sm font-medium text-charcoal mb-2">Mesajınız iletildi!</p>
                <p className="text-xs text-warm-gray font-light">En kısa sürede size geri dönüş yapacağız.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 text-[10px] tracking-ultra text-warm-gray underline underline-offset-2 hover:text-charcoal transition-colors"
                >
                  Yeni mesaj gönder
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">ADINIZ</label>
                    <input
                      value={form.isim}
                      onChange={e => set("isim", e.target.value)}
                      placeholder="Adınız Soyadınız"
                      required
                      className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">E-POSTA</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set("email", e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">KONU</label>
                  <select
                    value={form.konu}
                    onChange={e => set("konu", e.target.value)}
                    required
                    className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors appearance-none"
                  >
                    <option value="">Konu seçin</option>
                    <option>Sipariş hakkında</option>
                    <option>İade ve değişim</option>
                    <option>Ürün bilgisi</option>
                    <option>Diğer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">MESAJINIZ</label>
                  <textarea
                    value={form.mesaj}
                    onChange={e => set("mesaj", e.target.value)}
                    placeholder="Mesajınızı buraya yazın..."
                    required
                    rows={5}
                    className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal text-cream py-4 text-[11px] tracking-ultra font-medium hover:bg-charcoal/85 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? <><Loader2 size={13} className="animate-spin" /> GÖNDERİLİYOR</> : "MESAJ GÖNDER"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
