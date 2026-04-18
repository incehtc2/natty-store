"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock, AlertCircle } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

type FormData = {
  isim: string;
  soyisim: string;
  email: string;
  telefon: string;
  tcNo: string;
  adresSatiri: string;
  ilce: string;
  sehir: string;
  postaKodu: string;
};

const BOSH: FormData = {
  isim: "", soyisim: "", email: "", telefon: "", tcNo: "",
  adresSatiri: "", ilce: "", sehir: "", postaKodu: "",
};

const SEHIRLER = [
  "Adana","Ankara","Antalya","Bursa","Diyarbakır","Erzurum","Eskişehir",
  "Gaziantep","İstanbul","İzmir","Kayseri","Kocaeli","Konya","Malatya",
  "Mersin","Muğla","Samsun","Trabzon",
];

function StepBar({ current }: { current: number }) {
  const steps = ["Bilgiler", "Adres", "Ödeme"];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                done ? "bg-charcoal text-cream" :
                active ? "bg-charcoal text-cream ring-4 ring-charcoal/10" :
                "bg-light-gray text-warm-gray"
              }`}>
                {done ? <Check size={13} strokeWidth={2.5} /> : num}
              </div>
              <span className={`text-[10px] tracking-widest whitespace-nowrap ${active ? "text-charcoal font-medium" : "text-warm-gray"}`}>
                {label.toUpperCase()}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-px mx-3 mb-5 transition-colors duration-500 ${done ? "bg-charcoal" : "bg-light-gray"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Field({
  label, name, value, onChange, type = "text", placeholder, required = true, pattern, maxLength,
}: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
  type?: string; placeholder?: string; required?: boolean; pattern?: string; maxLength?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-ultra font-medium text-charcoal/70">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        maxLength={maxLength}
        className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-charcoal transition-colors duration-200"
      />
    </div>
  );
}

function SelectField({
  label, name, value, onChange, options,
}: {
  label: string; name: keyof FormData; value: string;
  onChange: (k: keyof FormData, v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-ultra font-medium text-charcoal/70">{label}</label>
      <select
        value={value}
        onChange={e => onChange(name, e.target.value)}
        required
        className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors duration-200 appearance-none cursor-pointer"
      >
        <option value="">Seçiniz...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function OdemePage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(BOSH);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkoutHtml, setCheckoutHtml] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (cartItems.length === 0 && step < 3) {
      router.replace("/sepet");
    }
  }, [cartItems, step, router]);

  useEffect(() => {
    if (checkoutHtml && iframeRef.current) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(checkoutHtml);
        doc.close();
      }
    }
  }, [checkoutHtml]);

  const set = (k: keyof FormData, v: string) => setForm(f => ({ ...f, [k]: v }));

  const step1Gecerli = () =>
    form.isim.trim() && form.soyisim.trim() && form.email.includes("@") &&
    form.telefon.length >= 10 && form.tcNo.length === 11;

  const step2Gecerli = () =>
    form.adresSatiri.trim() && form.ilce.trim() && form.sehir;

  const odemeBaslat = async () => {
    setLoading(true);
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
      const token = typeof window !== "undefined" ? localStorage.getItem("natty_token") : null;
      const res = await fetch(`${apiUrl}/odeme/baslat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          alici: { isim: form.isim, soyisim: form.soyisim, telefon: form.telefon, tcKimlik: form.tcNo },
          teslimatAdresi: { adres: form.adresSatiri, sehir: form.sehir },
          sepet: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, size: i.size, image: i.image })),
          toplam: cartTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Ödeme başlatılamadı. Lütfen tekrar deneyin.");
        setLoading(false);
        return;
      }
      setCheckoutHtml(data.checkoutFormContent);
      setStep(3);
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-12">
        {/* Başlık */}
        <div className="mb-10">
          <Link href="/sepet" className="inline-flex items-center gap-2 text-[10px] tracking-widest text-warm-gray hover:text-charcoal transition-colors mb-6">
            <ArrowLeft size={12} />
            SEPETimE DÖN
          </Link>
          <h1 className="text-3xl font-serif font-medium tracking-wide text-charcoal">Ödeme</h1>
        </div>

        <StepBar current={step} />

        {/* ADIM 1: Kişisel Bilgiler */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-light-gray pb-4 mb-6">
              <h2 className="text-[11px] tracking-ultra font-medium text-charcoal">KİŞİSEL BİLGİLER</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="AD" name="isim" value={form.isim} onChange={set} placeholder="Adınız" />
              <Field label="SOYAD" name="soyisim" value={form.soyisim} onChange={set} placeholder="Soyadınız" />
            </div>
            <Field label="E-POSTA" name="email" value={form.email} onChange={set} type="email" placeholder="ornek@email.com" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="TELEFON" name="telefon" value={form.telefon} onChange={set} type="tel" placeholder="+90 555 000 00 00" maxLength={15} />
              <Field label="TC KİMLİK NO" name="tcNo" value={form.tcNo} onChange={set} placeholder="11 haneli TC no" maxLength={11} pattern="[0-9]{11}" />
            </div>
            <div className="bg-cream-dark border border-light-gray p-4 text-xs text-warm-gray font-light flex gap-3">
              <Lock size={14} className="flex-shrink-0 mt-0.5 text-gold" />
              <span>Bilgileriniz SSL şifrelemesi ile korunmaktadır ve üçüncü taraflarla paylaşılmamaktadır.</span>
            </div>
            <button
              onClick={() => step1Gecerli() && setStep(2)}
              disabled={!step1Gecerli()}
              className="w-full flex items-center justify-center gap-2 bg-charcoal text-cream py-4 text-[11px] tracking-ultra hover:bg-charcoal/85 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              DEVAM ET
              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ADIM 2: Teslimat Adresi */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-light-gray pb-4 mb-6">
              <h2 className="text-[11px] tracking-ultra font-medium text-charcoal">TESLİMAT ADRESİ</h2>
            </div>
            <Field label="ADRES" name="adresSatiri" value={form.adresSatiri} onChange={set} placeholder="Sokak, mahalle, bina no..." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="İLÇE" name="ilce" value={form.ilce} onChange={set} placeholder="İlçe" />
              <SelectField label="ŞEHİR" name="sehir" value={form.sehir} onChange={set} options={SEHIRLER} />
            </div>
            <Field label="POSTA KODU" name="postaKodu" value={form.postaKodu} onChange={set} placeholder="34000" maxLength={5} required={false} />

            {/* Sipariş özeti */}
            <div className="bg-[#f0ece5] p-5 mt-4">
              <h3 className="text-[10px] tracking-ultra font-medium text-charcoal mb-4">SİPARİŞ ÖZETİ</h3>
              <div className="divide-y divide-[#ddd9d2]">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between py-2.5 text-sm">
                    <span className="text-warm-gray font-light">{item.name} {item.size && `(No: ${item.size})`} ×{item.quantity}</span>
                    <span className="text-charcoal">{(item.price * item.quantity).toLocaleString("tr-TR")} ₺</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#ddd9d2] mt-1">
                <span className="text-[10px] tracking-ultra font-medium text-charcoal">TOPLAM</span>
                <span className="text-lg font-serif text-charcoal">{cartTotal.toLocaleString("tr-TR")} ₺</span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                <AlertCircle size={15} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 border border-light-gray text-charcoal/70 py-4 px-6 text-[10px] tracking-ultra hover:border-charcoal hover:text-charcoal transition-all duration-300"
              >
                <ArrowLeft size={12} />
                GERİ
              </button>
              <button
                onClick={odemeBaslat}
                disabled={!step2Gecerli() || loading}
                className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-cream py-4 text-[11px] tracking-ultra hover:bg-charcoal/85 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> YÜKLENIYOR...</>
                ) : (
                  <><Lock size={13} /> GÜVENLİ ÖDEMEYE GEÇ</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ADIM 3: Ödeme Formu */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-light-gray pb-4 mb-2">
              <h2 className="text-[11px] tracking-ultra font-medium text-charcoal">ÖDEME BİLGİLERİ</h2>
            </div>

            {checkoutHtml ? (
              <>
                <div className="flex items-center gap-2 text-xs text-warm-gray bg-cream-dark border border-light-gray px-4 py-3">
                  <Lock size={12} className="text-gold flex-shrink-0" />
                  <span>iyzico güvenli ödeme altyapısı · SSL 256-bit şifreleme</span>
                </div>
                <div className="border border-light-gray overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    title="iyzico Ödeme Formu"
                    className="w-full"
                    style={{ height: "600px", border: "none" }}
                    scrolling="yes"
                  />
                </div>
                <div className="bg-cream-dark border border-light-gray p-4 text-xs text-warm-gray font-light">
                  <p className="font-medium text-charcoal mb-2 text-[10px] tracking-widest">TEST KARTI BİLGİLERİ</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    <span>Kart No: <span className="font-medium text-charcoal">5528790000000008</span></span>
                    <span>Son Kullanma: <span className="font-medium text-charcoal">12/30</span></span>
                    <span>CVV: <span className="font-medium text-charcoal">123</span></span>
                    <span>3DS Şifre: <span className="font-medium text-charcoal">a</span></span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <Loader2 size={28} className="animate-spin text-warm-gray" />
                <p className="text-sm text-warm-gray font-light">Ödeme formu yükleniyor...</p>
              </div>
            )}

            <button
              onClick={() => { setStep(2); setCheckoutHtml(""); setError(""); }}
              className="flex items-center gap-2 text-[10px] tracking-widest text-warm-gray hover:text-charcoal transition-colors"
            >
              <ArrowLeft size={12} />
              ADRESİ DÜZENLE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
