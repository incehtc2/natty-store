"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, ChevronRight, Menu, X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/urunler", label: "Ürünler", icon: Package },
  { href: "/admin/siparisler", label: "Siparişler", icon: ShoppingBag },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
];

const ADMIN_EMAIL = "ince.htce@gmail.com";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.replace("/giris?returnUrl=/admin");
      } else {
        setChecking(false);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/giris");
  };

  if (checking) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-5 h-5 border border-light-gray border-t-gold rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-charcoal flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="px-8 py-7 border-b border-white/8">
          <Link href="/" className="block">
            <span className="text-2xl font-brand text-cream tracking-widest">NATTY</span>
            <span className="block text-[9px] tracking-mega text-gold/60 font-medium mt-1">YÖNETİM PANELİ</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 group ${
                  active
                    ? "bg-gold/15 text-gold border-l-2 border-gold"
                    : "text-cream/40 hover:text-cream/80 hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <Icon size={15} strokeWidth={1.5} />
                <span className="tracking-wide">{label}</span>
                {active && <ChevronRight size={11} className="ml-auto text-gold/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-5 border-t border-white/8">
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/30 hover:text-cream/60 transition-colors mb-1">
            <span className="text-[10px] tracking-widest">← SİTEYE DÖN</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-cream/30 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={14} strokeWidth={1.5} />
            <span className="text-[11px] tracking-widest">ÇIKIŞ YAP</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-charcoal/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-light-gray px-6 lg:px-10 py-4 flex items-center justify-between">
          <button onClick={() => setOpen(o => !o)} className="lg:hidden text-warm-gray hover:text-charcoal transition-colors">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="hidden lg:block">
            <span className="text-[10px] tracking-ultra text-warm-gray font-medium uppercase">
              {NAV.find(n => (n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href)))?.label || "Admin"}
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] tracking-widest text-warm-gray">CANLI</span>
          </div>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
