"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export default function ProfilPage() {
  const { user, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const [form, setForm] = useState({
    isim: user.isim,
    soyisim: user.soyisim,
    telefon: user.telefon || "",
    dogumTarihi: user.dogumTarihi || "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    updateProfile(form);
    await new Promise(r => setTimeout(r, 400));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] tracking-mega text-warm-gray mb-1 font-medium">HESABIM</p>
        <h2 className="text-2xl font-serif font-medium text-charcoal">Profil Bilgileri</h2>
      </div>

      <div className="max-w-lg">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-light-gray">
          <div className="w-16 h-16 rounded-full bg-charcoal text-cream flex items-center justify-center text-xl font-medium flex-shrink-0">
            {user.isim[0]}{user.soyisim[0]}
          </div>
          <div>
            <p className="text-base font-medium text-charcoal">{user.isim} {user.soyisim}</p>
            <p className="text-sm text-warm-gray font-light">{user.email}</p>
            <p className="text-xs text-warm-gray/60 font-light mt-1">
              Üyelik: {new Date(user.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">E-POSTA</label>
            <input
              value={user.email}
              disabled
              className="border border-light-gray bg-cream-dark px-4 py-3 text-sm text-warm-gray cursor-not-allowed"
            />
            <p className="text-[10px] text-warm-gray/50 font-light">E-posta adresi değiştirilemez.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">TELEFON</label>
            <input
              type="tel"
              value={form.telefon}
              onChange={e => set("telefon", e.target.value)}
              placeholder="+90 555 000 00 00"
              className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">DOĞUM TARİHİ</label>
            <input
              type="date"
              value={form.dogumTarihi}
              onChange={e => set("dogumTarihi", e.target.value)}
              className="border border-light-gray bg-cream px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || saved}
              className={`flex items-center gap-2 px-8 py-3.5 text-[11px] tracking-ultra font-medium transition-all duration-300 ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-charcoal text-cream hover:bg-charcoal/85 disabled:opacity-50"
              }`}
            >
              {loading ? (
                <><Loader2 size={13} className="animate-spin" /> KAYDEDİLİYOR</>
              ) : saved ? (
                <><Check size={13} /> KAYDEDİLDİ</>
              ) : (
                "DEĞİŞİKLİKLERİ KAYDET"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
