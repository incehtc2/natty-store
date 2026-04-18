"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Address = {
  id: string; baslik: string; isim: string; soyisim: string;
  telefon: string; adres: string; ilce: string; sehir: string;
  postaKodu: string; varsayilan: boolean;
};

export type Order = {
  id: string; tarih: string;
  durum: "hazirlaniyor" | "kargoda" | "teslim_edildi" | "iptal";
  toplam: number;
  urunler: { name: string; quantity: number; price: number; image: string; size?: number | null }[];
};

export type User = {
  id: string; isim: string; soyisim: string; email: string;
  telefon: string; dogumTarihi: string; createdAt: string;
  adresler: Address[]; siparisler: Order[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { isim: string; soyisim: string; email: string; telefon: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "isim" | "soyisim" | "telefon" | "dogumTarihi">>) => Promise<void>;
  addAddress: (addr: Omit<Address, "id">) => Promise<void>;
  updateAddress: (id: string, addr: Omit<Address, "id">) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  loadUserData: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfile(
  sbUser: SupabaseUser,
  profile: { isim: string; soyisim: string; telefon: string | null; dogum_tarihi: string | null } | null
): User {
  return {
    id: sbUser.id,
    isim: profile?.isim || "",
    soyisim: profile?.soyisim || "",
    email: sbUser.email || "",
    telefon: profile?.telefon || "",
    dogumTarihi: profile?.dogum_tarihi || "",
    createdAt: sbUser.created_at,
    adresler: [],
    siparisler: [],
  };
}

function mapAddresses(
  rows: { id: string; baslik: string; isim: string; soyisim: string; telefon: string; adres: string; ilce: string; sehir: string; posta_kodu: string; varsayilan: boolean }[]
): Address[] {
  return rows.map(a => ({
    id: a.id, baslik: a.baslik, isim: a.isim, soyisim: a.soyisim,
    telefon: a.telefon, adres: a.adres, ilce: a.ilce, sehir: a.sehir,
    postaKodu: a.posta_kodu, varsayilan: a.varsayilan,
  }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (sbUser: SupabaseUser) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("isim,soyisim,telefon,dogum_tarihi")
      .eq("id", sbUser.id)
      .single();
    setUser(mapProfile(sbUser, profile));
  }, []);

  const loadUserData = useCallback(async () => {
    const { data: { user: sbUser } } = await supabase.auth.getUser();
    if (!sbUser) return;
    const [addrRes, ordersRes] = await Promise.all([
      supabase.from("addresses").select("*").eq("user_id", sbUser.id).order("created_at", { ascending: false }),
      supabase.from("orders").select("id,created_at,durum,toplam,order_items(name,quantity,price,image,size)").eq("user_id", sbUser.id).order("created_at", { ascending: false }),
    ]);
    const adresler = mapAddresses(addrRes.data || []);
    const siparisler: Order[] = (ordersRes.data || []).map(o => ({
      id: o.id, tarih: o.created_at, durum: o.durum, toplam: o.toplam,
      urunler: (o.order_items || []).map((i: { name: string; quantity: number; price: number; image: string; size: number | null }) => ({
        name: i.name, quantity: i.quantity, price: i.price, image: i.image, size: i.size,
      })),
    }));
    setUser(prev => prev ? { ...prev, adresler, siparisler } : null);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) await loadProfile(session.user);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!mounted) return;
      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı." : error.message);
    if (data.user) await loadProfile(data.user);
  };

  const register = async (data: { isim: string; soyisim: string; email: string; telefon: string; password: string }) => {
    const { error, data: authData } = await supabase.auth.signUp({
      email: data.email, password: data.password,
      options: { data: { isim: data.isim, soyisim: data.soyisim, telefon: data.telefon } },
    });
    if (error) throw new Error(error.message === "User already registered" ? "Bu e-posta adresi zaten kayıtlı." : error.message);
    if (authData.user) {
      await supabase.from("profiles").upsert({ id: authData.user.id, isim: data.isim, soyisim: data.soyisim, telefon: data.telefon || null });
      await loadProfile(authData.user);
    }
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  const updateProfile = async (data: Partial<Pick<User, "isim" | "soyisim" | "telefon" | "dogumTarihi">>) => {
    if (!user) return;
    await supabase.from("profiles").update({
      ...(data.isim && { isim: data.isim }),
      ...(data.soyisim && { soyisim: data.soyisim }),
      ...(data.telefon !== undefined && { telefon: data.telefon }),
      ...(data.dogumTarihi !== undefined && { dogum_tarihi: data.dogumTarihi }),
    }).eq("id", user.id);
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const addAddress = async (addr: Omit<Address, "id">) => {
    if (!user) return;
    if (addr.varsayilan) await supabase.from("addresses").update({ varsayilan: false }).eq("user_id", user.id);
    await supabase.from("addresses").insert({
      user_id: user.id, baslik: addr.baslik, isim: addr.isim, soyisim: addr.soyisim,
      telefon: addr.telefon, adres: addr.adres, ilce: addr.ilce, sehir: addr.sehir,
      posta_kodu: addr.postaKodu, varsayilan: addr.varsayilan,
    });
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setUser(prev => prev ? { ...prev, adresler: mapAddresses(data || []) } : null);
  };

  const updateAddress = async (id: string, addr: Omit<Address, "id">) => {
    if (!user) return;
    if (addr.varsayilan) await supabase.from("addresses").update({ varsayilan: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({
      baslik: addr.baslik, isim: addr.isim, soyisim: addr.soyisim, telefon: addr.telefon,
      adres: addr.adres, ilce: addr.ilce, sehir: addr.sehir, posta_kodu: addr.postaKodu, varsayilan: addr.varsayilan,
    }).eq("id", id);
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setUser(prev => prev ? { ...prev, adresler: mapAddresses(data || []) } : null);
  };

  const removeAddress = async (id: string) => {
    if (!user) return;
    await supabase.from("addresses").delete().eq("id", id);
    setUser(prev => prev ? { ...prev, adresler: prev.adresler.filter(a => a.id !== id) } : null);
  };

  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    await supabase.from("addresses").update({ varsayilan: false }).eq("user_id", user.id);
    await supabase.from("addresses").update({ varsayilan: true }).eq("id", id);
    const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setUser(prev => prev ? { ...prev, adresler: mapAddresses(data || []) } : null);
  };

  const refreshOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("id,created_at,durum,toplam,order_items(name,quantity,price,image,size)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    const siparisler: Order[] = (data || []).map(o => ({
      id: o.id, tarih: o.created_at, durum: o.durum, toplam: o.toplam,
      urunler: (o.order_items || []).map((i: { name: string; quantity: number; price: number; image: string; size: number | null }) => ({
        name: i.name, quantity: i.quantity, price: i.price, image: i.image, size: i.size,
      })),
    }));
    setUser(prev => prev ? { ...prev, siparisler } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress, refreshOrders, loadUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır");
  return ctx;
}
