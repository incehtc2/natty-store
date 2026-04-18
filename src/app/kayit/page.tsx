"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function KayitPage() {
  const [form, setForm] = useState({ isim: "", soyisim: "", email: "", telefon: "", password: "", passwordConfirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [kvkk, setKvkk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) { setError("Şifreler eşleşmiyor."); return; }
    if (form.password.length < 6) { setError("Şifre en az 6 karakter olmalıdır."); return; }
    if (!kvkk) { setError("Kullanım koşullarını kabul etmeniz gerekmektedir."); return; }
    setLoading(true);
    setError("");
    try {
      await register({ isim: form.isim, soyisim: form.soyisim, email: form.email, telefon: form.telefon, password: form.password });
      router.push("/hesabim");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-cream flex">
      {/* Sol panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#18160f] flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg,#a8865a 0,#a8865a 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 max-w-sm">
          <Link href="/" className="text-4xl font-brand text-white block mb-10">NATTY</Link>
          <p className="text-[9px] tracking-mega text-gold/60 mb-5 font-medium">ÜYELİK AYRICALIKLARI</p>
          <h2 className="text-3xl font-serif font-medium text-white leading-tight mb-8">
            Premium<br />deneyime<br />adım atın
          </h2>
          <div className="space-y-5">
            {[
              "Sipariş geçmişinizi takip edin",
              "Adres bilgilerinizi kaydedin",
              "Özel kampanya ve indirimlere erişin",
              "Yeni koleksiyon duyurularından ilk haberdar olun",
              "Kolay ve hızlı ödeme deneyimi",
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border border-gold/40 flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-gold" />
                </div>
                <p className="text-sm text-white/50 font-light">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="text-3xl font-brand text-charcoal">NATTY</Link>
          </div>
          <p className="text-[9px] tracking-mega text-warm-gray mb-3 font-medium">YENİ HESAP</p>
          <h1 className="text-3xl font-serif font-medium text-charcoal mb-8">Üye Ol</h1>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "isim", label: "AD", placeholder: "Adınız" },
                { k: "soyisim", label: "SOYAD", placeholder: "Soyadınız" },
              ].map(({ k, label, placeholder }) => (
                <div key={k} className="flex flex-col gap-1.5">
                  <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">{label}</label>
                  <input
                    value={form[k as keyof typeof form]}
                    onChange={e => set(k, e.target.value)}
                    placeholder={placeholder}
                    required
                    className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              ))}
            </div>

            {[
              { k: "email", label: "E-POSTA", type: "email", placeholder: "ornek@email.com" },
              { k: "telefon", label: "TELEFON", type: "tel", placeholder: "+90 555 000 00 00" },
            ].map(({ k, label, type, placeholder }) => (
              <div key={k} className="flex flex-col gap-1.5">
                <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">{label}</label>
                <input
                  type={type}
                  value={form[k as keyof typeof form]}
                  onChange={e => set(k, e.target.value)}
                  placeholder={placeholder}
                  required
                  className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                />
              </div>
            ))}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">ŞİFRE</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="En az 6 karakter"
                  required
                  className="w-full border border-light-gray bg-cream px-4 py-3 pr-11 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray/50 hover:text-warm-gray transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4].map(n => (
                    <div key={n} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${strength >= n ? (strength <= 1 ? "bg-red-400" : strength <= 2 ? "bg-orange-400" : strength <= 3 ? "bg-yellow-400" : "bg-green-500") : "bg-light-gray"}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">ŞİFRE TEKRAR</label>
              <input
                type="password"
                value={form.passwordConfirm}
                onChange={e => set("passwordConfirm", e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                required
                className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <div
                onClick={() => setKvkk(k => !k)}
                className={`w-4 h-4 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors cursor-pointer ${kvkk ? "bg-charcoal border-charcoal" : "border-light-gray"}`}
              >
                {kvkk && <Check size={10} className="text-cream" />}
              </div>
              <span className="text-xs text-warm-gray font-light leading-relaxed">
                <Link href="/kullanim-kosullari" className="underline hover:text-charcoal transition-colors">Kullanım Koşulları</Link> ve{" "}
                <Link href="/gizlilik" className="underline hover:text-charcoal transition-colors">Gizlilik Politikası</Link>'nı okudum, kabul ediyorum.
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-4 text-[11px] tracking-ultra font-medium hover:bg-charcoal/85 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> KAYIT YAPILIYOR</> : "ÜYE OL"}
            </button>
          </form>

          <p className="text-sm text-warm-gray font-light text-center mt-8">
            Zaten üye misiniz?{" "}
            <Link href="/giris" className="text-charcoal font-medium underline underline-offset-2 hover:text-gold transition-colors">
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
