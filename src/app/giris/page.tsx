"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function GirisPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/hesabim";

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      router.push(returnUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-cream flex">
      {/* Sol panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#18160f] flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg,#a8865a 0,#a8865a 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 text-center max-w-sm">
          <Link href="/" className="text-4xl font-brand text-white block mb-10">NATTY</Link>
          <p className="text-[9px] tracking-mega text-gold/60 mb-5 font-medium">HOŞ GELDİNİZ</p>
          <h2 className="text-3xl font-serif font-medium text-white leading-tight mb-6">
            Stilinizi<br />keşfetmeye<br />devam edin
          </h2>
          <p className="text-sm text-white/40 font-light leading-relaxed">
            Siparişlerinizi takip edin, adres bilgilerinizi yönetin ve özel kampanyalardan ilk siz haberdar olun.
          </p>
          <div className="mt-12 pt-10 border-t border-white/10 flex justify-center gap-10">
            {[["200+", "Ürün"], ["15+", "Yıl"], ["%100", "Deri"]].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="text-xl font-serif text-gold">{v}</p>
                <p className="text-[9px] tracking-widest text-white/30">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sağ panel: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="text-3xl font-brand text-charcoal">NATTY</Link>
          </div>
          <p className="text-[9px] tracking-mega text-warm-gray mb-3 font-medium">HESABINIZA GİRİN</p>
          <h1 className="text-3xl font-serif font-medium text-charcoal mb-8">Giriş Yap</h1>

          <form onSubmit={submit} className="space-y-5">
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

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">ŞİFRE</label>
                <button type="button" className="text-[10px] text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                  Şifremi Unuttum
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-light-gray bg-cream px-4 py-3 pr-11 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warm-gray/50 hover:text-warm-gray transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal text-cream py-4 text-[11px] tracking-ultra font-medium hover:bg-charcoal/85 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <><Loader2 size={14} className="animate-spin" /> GİRİŞ YAPILIYOR</> : "GİRİŞ YAP"}
            </button>
          </form>

          <p className="text-sm text-warm-gray font-light text-center mt-8">
            Hesabınız yok mu?{" "}
            <Link href="/kayit" className="text-charcoal font-medium underline underline-offset-2 hover:text-gold transition-colors">
              Üye olun
            </Link>
          </p>

          <div className="mt-8 pt-8 border-t border-light-gray">
            <p className="text-xs text-warm-gray/50 text-center leading-relaxed">
              Giriş yaparak{" "}
              <Link href="/kullanim-kosullari" className="underline hover:text-warm-gray transition-colors">Kullanım Koşulları</Link>
              {" "}ve{" "}
              <Link href="/gizlilik" className="underline hover:text-warm-gray transition-colors">Gizlilik Politikası</Link>
              &apos;nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
