"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Address = {
  id: string;
  baslik: string;
  isim: string;
  soyisim: string;
  telefon: string;
  adres: string;
  ilce: string;
  sehir: string;
  postaKodu: string;
  varsayilan: boolean;
};

export type Order = {
  id: string;
  tarih: string;
  durum: "hazirlaniyor" | "kargoda" | "teslim_edildi" | "iptal";
  toplam: number;
  urunler: { name: string; quantity: number; price: number; image: string; size?: number | null }[];
};

export type User = {
  id: string;
  isim: string;
  soyisim: string;
  email: string;
  telefon: string;
  dogumTarihi: string;
  createdAt: string;
  adresler: Address[];
  siparisler: Order[];
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { isim: string; soyisim: string; email: string; telefon: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, "isim" | "soyisim" | "telefon" | "dogumTarihi">>) => void;
  addAddress: (addr: Omit<Address, "id">) => void;
  updateAddress: (id: string, addr: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "natty_users";
const SESSION_KEY = "natty_session";

function getUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}
function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const email = getSession();
    if (email) {
      const found = getUsers().find(u => u.email === email);
      if (found) {
        const { password: _, ...rest } = found;
        setUser(rest);
      }
    }
    setIsLoading(false);
  }, []);

  const syncUser = (email: string) => {
    const found = getUsers().find(u => u.email === email);
    if (found) {
      const { password: _, ...rest } = found;
      setUser(rest);
    }
  };

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error("E-posta veya şifre hatalı.");
    localStorage.setItem(SESSION_KEY, found.email);
    const { password: _, ...rest } = found;
    setUser(rest);
  };

  const register = async (data: { isim: string; soyisim: string; email: string; telefon: string; password: string }) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      throw new Error("Bu e-posta adresi zaten kayıtlı.");
    }
    const newUser: User & { password: string } = {
      id: `U-${Date.now()}`,
      isim: data.isim,
      soyisim: data.soyisim,
      email: data.email,
      telefon: data.telefon,
      dogumTarihi: "",
      createdAt: new Date().toISOString(),
      adresler: [],
      siparisler: [],
      password: data.password,
    };
    saveUsers([...users, newUser]);
    localStorage.setItem(SESSION_KEY, newUser.email);
    const { password: _, ...rest } = newUser;
    setUser(rest);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateProfile = (data: Partial<Pick<User, "isim" | "soyisim" | "telefon" | "dogumTarihi">>) => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map(u => u.email === user.email ? { ...u, ...data } : u);
    saveUsers(updated);
    syncUser(user.email);
  };

  const addAddress = (addr: Omit<Address, "id">) => {
    if (!user) return;
    const users = getUsers();
    const newAddr: Address = { ...addr, id: `A-${Date.now()}` };
    const updated = users.map(u => {
      if (u.email !== user.email) return u;
      const adresler = addr.varsayilan
        ? [...u.adresler.map(a => ({ ...a, varsayilan: false })), newAddr]
        : [...u.adresler, newAddr];
      return { ...u, adresler };
    });
    saveUsers(updated);
    syncUser(user.email);
  };

  const updateAddress = (id: string, addr: Omit<Address, "id">) => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map(u => {
      if (u.email !== user.email) return u;
      const adresler = u.adresler.map(a => {
        if (a.id !== id) return addr.varsayilan ? { ...a, varsayilan: false } : a;
        return { ...addr, id };
      });
      return { ...u, adresler };
    });
    saveUsers(updated);
    syncUser(user.email);
  };

  const removeAddress = (id: string) => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map(u =>
      u.email === user.email ? { ...u, adresler: u.adresler.filter(a => a.id !== id) } : u
    );
    saveUsers(updated);
    syncUser(user.email);
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map(u =>
      u.email === user.email
        ? { ...u, adresler: u.adresler.map(a => ({ ...a, varsayilan: a.id === id })) }
        : u
    );
    saveUsers(updated);
    syncUser(user.email);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile, addAddress, updateAddress, removeAddress, setDefaultAddress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır");
  return ctx;
}
