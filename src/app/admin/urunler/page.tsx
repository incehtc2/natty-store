"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Pencil, Trash2, Search, X, Loader2, Upload } from "lucide-react";
import Image from "next/image";

type Product = {
  id: string; name: string; category: string; type: string;
  price: number; original_price: number | null; image: string;
  description: string; is_new: boolean; badge: string | null; stock: number;
};

const EMPTY: Omit<Product, "id"> = {
  name: "", category: "kadin", type: "ayakkabi", price: 0,
  original_price: null, image: "", description: "", is_new: false, badge: null, stock: 100,
};

type SubFilter = "tümü" | "kadin-ayakkabi" | "kadin-canta" | "erkek-ayakkabi" | "erkek-canta";

const SUB_LABELS: Record<SubFilter, string> = {
  "tümü": "Tümü",
  "kadin-ayakkabi": "Kadın · Ayakkabı",
  "kadin-canta": "Kadın · Çanta",
  "erkek-ayakkabi": "Erkek · Ayakkabı",
  "erkek-canta": "Erkek · Çanta",
};

export default function AdminUrunler() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState<SubFilter>("tümü");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("id,name,category,type,price,original_price,image,description,is_new,badge,stock")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("products")
      .select("id,name,category,type,price,original_price,image,description,is_new,badge,stock")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (mounted) {
          setProducts(data || []);
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(q) || p.category.includes(q) || p.type.includes(q);
      const matchSub = subFilter === "tümü" || `${p.category}-${p.type}` === subFilter;
      return matchSearch && matchSub;
    });
  }, [products, search, subFilter]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal("add"); };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, type: p.type, price: p.price,
      original_price: p.original_price, image: p.image, description: p.description,
      is_new: p.is_new, badge: p.badge, stock: p.stock,
    });
    setEditing(p.id);
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Yükleme başarısız");

      setForm(f => ({ ...f, image: json.url }));
    } catch (err) {
      console.error("Görsel yüklenemedi:", err);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const save = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      if (modal === "edit" && editing) {
        const res = await fetch(`/api/admin/products/${editing}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        setProducts(prev => prev.map(p => p.id === editing ? { ...p, ...form } : p));
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        const data = await res.json();
        setProducts(prev => [data, ...prev]);
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => setDeleteTarget(id);

  const del = async () => {
    if (!deleteTarget) return;
    setDeleting(deleteTarget);
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      setProducts(prev => prev.filter(p => p.id !== deleteTarget));
    } finally {
      setDeleting(null);
    }
  };

  const set = (k: keyof typeof form, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-8">
      <div className="border-b border-light-gray pb-6 flex items-end justify-between">
        <div>
          <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">MAĞAZA</p>
          <h1 className="text-3xl font-serif font-medium text-charcoal">Ürünler</h1>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-charcoal text-cream px-5 py-2.5 text-[10px] tracking-ultra font-medium hover:bg-charcoal/85 transition-colors">
          <Plus size={13} /> YENİ ÜRÜN
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray/50" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ürün adı, kategori veya tip..."
            className="w-full bg-cream border border-light-gray pl-11 pr-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(SUB_LABELS) as SubFilter[]).map(k => (
            <button
              key={k}
              onClick={() => setSubFilter(k)}
              className={`px-3.5 py-1.5 text-[10px] tracking-ultra font-medium border transition-all ${subFilter === k ? "bg-charcoal text-cream border-charcoal" : "bg-cream text-warm-gray border-light-gray hover:border-charcoal hover:text-charcoal"}`}
            >
              {SUB_LABELS[k].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-light-gray overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-light-gray bg-cream-dark">
                {["Ürün Adı", "Kategori", "Tip", "Fiyat", "Stok", ""].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[9px] tracking-ultra text-warm-gray font-medium uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-light-gray">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="bg-cream">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-light-gray rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.map(p => (
                <tr key={p.id} className="bg-cream hover:bg-cream-dark transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <div className="relative w-10 h-10 flex-shrink-0 border border-light-gray overflow-hidden">
                          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 flex-shrink-0 border border-light-gray bg-cream-dark" />
                      )}
                      <div>
                        <p className="text-sm text-charcoal font-medium">{p.name}</p>
                        {p.badge && <span className="text-[10px] text-gold font-light">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-warm-gray capitalize">{p.category}</td>
                  <td className="px-5 py-4 text-sm text-warm-gray capitalize">{p.type}</td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-charcoal tabular-nums">{p.price.toLocaleString("tr-TR")} ₺</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] px-2.5 py-1 font-medium border">{p.stock} adet</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 flex items-center justify-center hover:text-charcoal text-warm-gray transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => confirmDelete(p.id)} disabled={deleting === p.id} className="w-8 h-8 flex items-center justify-center hover:text-red-500 text-warm-gray transition-colors disabled:opacity-40">
                        {deleting === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Silme onay modalı */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="bg-cream border border-light-gray shadow-2xl w-full max-w-sm">
            <div className="px-7 py-6">
              <p className="text-[9px] tracking-mega text-warm-gray font-medium mb-3">ÜRÜN SİL</p>
              <h2 className="text-lg font-serif font-medium text-charcoal mb-2">Emin misiniz?</h2>
              <p className="text-sm text-warm-gray font-light">Bu ürün kalıcı olarak silinecek ve geri alınamaz.</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-light-gray">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 text-[10px] tracking-ultra font-medium text-warm-gray border border-light-gray hover:border-charcoal hover:text-charcoal transition-colors"
              >
                VAZGEÇ
              </button>
              <button
                onClick={del}
                className="px-5 py-2.5 bg-red-500 text-white text-[10px] tracking-ultra font-medium hover:bg-red-600 transition-colors"
              >
                SİL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ürün ekle/düzenle modalı */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="bg-cream w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-light-gray shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-light-gray sticky top-0 bg-cream z-10">
              <div>
                <p className="text-[9px] tracking-mega text-warm-gray font-medium">ÜRÜN YÖNETİMİ</p>
                <h2 className="text-lg font-serif font-medium text-charcoal mt-0.5">
                  {modal === "edit" ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                </h2>
              </div>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center text-warm-gray hover:text-charcoal transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-7 py-6 space-y-5">
              {/* Görsel yükleme */}
              <div>
                <p className="text-[9px] tracking-ultra text-warm-gray mb-3 uppercase">Ürün Görseli</p>
                <div className="flex gap-4 items-start">
                  <div className="relative w-24 h-24 flex-shrink-0 border border-light-gray bg-cream-dark overflow-hidden">
                    {form.image ? (
                      <Image src={form.image} alt="Önizleme" fill className="object-cover" sizes="96px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Upload size={20} className="text-warm-gray/30" strokeWidth={1.5} />
                      </div>
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-cream/80 flex items-center justify-center">
                        <Loader2 size={18} className="animate-spin text-charcoal" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center gap-2 w-full border border-light-gray px-4 py-2.5 text-[10px] tracking-ultra font-medium text-warm-gray hover:border-charcoal hover:text-charcoal transition-colors cursor-pointer ${uploadingImage ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      <Upload size={12} />
                      {uploadingImage ? "YÜKLENİYOR..." : "BİLGİSAYARDAN SEÇ"}
                    </label>
                    <input
                      type="text"
                      value={form.image}
                      onChange={e => set("image", e.target.value)}
                      placeholder="veya görsel URL girin..."
                      className="w-full bg-cream border border-light-gray px-4 py-2.5 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Ürün adı */}
              <div>
                <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Ürün Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="Örn: Saten Hakiki Deri Sandalet"
                  className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                />
              </div>

              {/* Kategori & Tip */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Kategori</label>
                  <select
                    value={form.category}
                    onChange={e => set("category", e.target.value)}
                    className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  >
                    <option value="kadin">Kadın</option>
                    <option value="erkek">Erkek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Tip</label>
                  <select
                    value={form.type}
                    onChange={e => set("type", e.target.value)}
                    className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  >
                    <option value="ayakkabi">Ayakkabı</option>
                    <option value="canta">Çanta</option>
                  </select>
                </div>
              </div>

              {/* Fiyat & İndirimli fiyat */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Fiyat (₺) *</label>
                  <input
                    type="number"
                    value={form.price || ""}
                    onChange={e => set("price", Number(e.target.value))}
                    placeholder="0"
                    min={0}
                    className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">İndirimli Fiyat (₺)</label>
                  <input
                    type="number"
                    value={form.original_price ?? ""}
                    onChange={e => set("original_price", e.target.value ? Number(e.target.value) : null)}
                    placeholder="Boş bırakabilirsiniz"
                    min={0}
                    className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              </div>

              {/* Stok & Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Stok</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={e => set("stock", Number(e.target.value))}
                    min={0}
                    className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Rozet</label>
                  <input
                    type="text"
                    value={form.badge ?? ""}
                    onChange={e => set("badge", e.target.value || null)}
                    placeholder="Örn: ÇOK SATILAN"
                    className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div>
                <label className="block text-[9px] tracking-ultra text-warm-gray mb-2 uppercase">Açıklama</label>
                <textarea
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                  placeholder="Ürün açıklaması..."
                  rows={3}
                  className="w-full bg-cream border border-light-gray px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/40 focus:outline-none focus:border-charcoal transition-colors resize-none"
                />
              </div>

              {/* Yeni ürün */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => set("is_new", !form.is_new)}
                  className={`w-5 h-5 flex items-center justify-center border transition-colors ${form.is_new ? "bg-charcoal border-charcoal" : "border-light-gray hover:border-charcoal"}`}
                >
                  {form.is_new && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-charcoal font-light">Yeni ürün olarak işaretle</span>
              </label>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-7 py-5 border-t border-light-gray sticky bottom-0 bg-cream">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 text-[10px] tracking-ultra font-medium text-warm-gray border border-light-gray hover:border-charcoal hover:text-charcoal transition-colors"
              >
                İPTAL
              </button>
              <button
                onClick={save}
                disabled={saving || !form.name || !form.price}
                className="flex items-center gap-2 px-6 py-2.5 bg-charcoal text-cream text-[10px] tracking-ultra font-medium hover:bg-charcoal/85 transition-colors disabled:opacity-40"
              >
                {saving && <Loader2 size={11} className="animate-spin" />}
                {modal === "edit" ? "GÜNCELLE" : "KAYDET"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
