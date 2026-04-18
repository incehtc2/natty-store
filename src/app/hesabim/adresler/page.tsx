"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import type { Address } from "../../../context/AuthContext";

const BLANK: Omit<Address, "id"> = {
  baslik: "", isim: "", soyisim: "", telefon: "",
  adres: "", ilce: "", sehir: "", postaKodu: "", varsayilan: false,
};

function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<Address, "id">;
  onSave: (d: Omit<Address, "id">) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  const fields: { k: keyof typeof form; label: string; placeholder: string; colSpan?: string }[] = [
    { k: "baslik", label: "ADRES BAŞLIĞI", placeholder: "Ev, İş, vb.", colSpan: "col-span-2" },
    { k: "isim", label: "AD", placeholder: "Adınız" },
    { k: "soyisim", label: "SOYAD", placeholder: "Soyadınız" },
    { k: "telefon", label: "TELEFON", placeholder: "+90 555 000 00 00", colSpan: "col-span-2" },
    { k: "adres", label: "ADRES", placeholder: "Mahalle, sokak, bina no", colSpan: "col-span-2" },
    { k: "ilce", label: "İLÇE", placeholder: "İlçe" },
    { k: "sehir", label: "ŞEHİR", placeholder: "Şehir" },
    { k: "postaKodu", label: "POSTA KODU", placeholder: "34000" },
  ];

  return (
    <div className="border border-charcoal bg-cream p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {fields.map(({ k, label, placeholder, colSpan }) => (
          <div key={k} className={`flex flex-col gap-1.5 ${colSpan || ""}`}>
            <label className="text-[10px] tracking-ultra font-medium text-charcoal/60">{label}</label>
            <input
              value={form[k] as string}
              onChange={e => set(k, e.target.value)}
              placeholder={placeholder}
              className="border border-light-gray bg-cream px-3 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
            />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer mb-5">
        <div
          onClick={() => set("varsayilan", !form.varsayilan)}
          className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${form.varsayilan ? "bg-charcoal border-charcoal" : "border-light-gray"}`}
        >
          {form.varsayilan && <Check size={10} className="text-cream" />}
        </div>
        <span className="text-xs text-warm-gray font-light">Varsayılan adres olarak kaydet</span>
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => onSave(form)}
          className="bg-charcoal text-cream px-6 py-2.5 text-[10px] tracking-ultra font-medium hover:bg-charcoal/85 transition-colors"
        >
          KAYDET
        </button>
        <button
          onClick={onCancel}
          className="border border-light-gray text-warm-gray px-6 py-2.5 text-[10px] tracking-ultra font-medium hover:border-charcoal hover:text-charcoal transition-colors"
        >
          İPTAL
        </button>
      </div>
    </div>
  );
}

export default function AdreslerPage() {
  const { user, addAddress, updateAddress, removeAddress, setDefaultAddress } = useAuth();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  if (!user) return null;

  const handleAdd = (data: Omit<Address, "id">) => {
    addAddress(data);
    setAdding(false);
  };

  const handleUpdate = (id: string, data: Omit<Address, "id">) => {
    updateAddress(id, data);
    setEditing(null);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] tracking-mega text-warm-gray mb-1 font-medium">HESABIM</p>
          <h2 className="text-2xl font-serif font-medium text-charcoal">Adreslerim</h2>
        </div>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 border border-charcoal text-charcoal px-4 py-2.5 text-[10px] tracking-ultra font-medium hover:bg-charcoal hover:text-cream transition-all"
          >
            <Plus size={13} />
            YENİ ADRES
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4">
          <AddressForm initial={BLANK} onSave={handleAdd} onCancel={() => setAdding(false)} />
        </div>
      )}

      {user.adresler.length === 0 && !adding ? (
        <div className="border border-dashed border-light-gray p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-cream-dark flex items-center justify-center mx-auto mb-4">
            <MapPin size={22} strokeWidth={1} className="text-warm-gray" />
          </div>
          <p className="text-sm text-warm-gray font-light mb-2">Kayıtlı adresiniz yok.</p>
          <p className="text-xs text-warm-gray/60 font-light mb-6">Teslimat adreslerinizi buradan yönetebilirsiniz.</p>
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 bg-charcoal text-cream px-8 py-3 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-colors"
          >
            <Plus size={13} />
            ADRES EKLE
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {user.adresler.map(addr => (
            <div key={addr.id}>
              {editing === addr.id ? (
                <AddressForm
                  initial={{ baslik: addr.baslik, isim: addr.isim, soyisim: addr.soyisim, telefon: addr.telefon, adres: addr.adres, ilce: addr.ilce, sehir: addr.sehir, postaKodu: addr.postaKodu, varsayilan: addr.varsayilan }}
                  onSave={data => handleUpdate(addr.id, data)}
                  onCancel={() => setEditing(null)}
                />
              ) : (
                <div className="border border-light-gray p-5 hover:border-charcoal/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-9 h-9 bg-cream-dark flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin size={15} strokeWidth={1.5} className="text-warm-gray" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="text-sm font-medium text-charcoal">{addr.baslik}</p>
                          {addr.varsayilan && (
                            <span className="text-[9px] tracking-wider bg-charcoal text-cream px-2 py-0.5 font-medium">VARSAYILAN</span>
                          )}
                        </div>
                        <p className="text-sm text-warm-gray font-light">{addr.isim} {addr.soyisim}</p>
                        <p className="text-sm text-warm-gray font-light">{addr.adres}</p>
                        <p className="text-sm text-warm-gray font-light">{addr.ilce}, {addr.sehir} {addr.postaKodu}</p>
                        <p className="text-sm text-warm-gray font-light">{addr.telefon}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!addr.varsayilan && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="p-2 text-warm-gray/50 hover:text-charcoal transition-colors text-xs"
                          title="Varsayılan yap"
                        >
                          <Check size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => setEditing(addr.id)}
                        className="p-2 text-warm-gray/50 hover:text-charcoal transition-colors"
                        title="Düzenle"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="p-2 text-warm-gray/50 hover:text-red-500 transition-colors"
                        title="Sil"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
