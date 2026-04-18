"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Package, MapPin, User, Heart, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { href: "/hesabim", label: "Genel Bakış", icon: LayoutGrid, exact: true },
  { href: "/hesabim/siparisler", label: "Siparişlerim", icon: Package },
  { href: "/hesabim/adresler", label: "Adreslerim", icon: MapPin },
  { href: "/hesabim/profil", label: "Profil Bilgileri", icon: User },
  { href: "/hesabim/favoriler", label: "Favorilerim", icon: Heart },
];

export default function HesabimLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/giris?returnUrl=/hesabim");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[calc(100vh-100px)] bg-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-cream">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        {/* Başlık */}
        <div className="mb-8 pb-8 border-b border-light-gray">
          <p className="text-[9px] tracking-mega text-warm-gray mb-2 font-medium">HESABIM</p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-serif font-medium text-charcoal">
              Merhaba, {user.isim}
            </h1>
            <p className="text-xs text-warm-gray font-light hidden sm:block">
              Üyelik tarihi: {new Date(user.createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long" })}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobil: yatay kaydırma */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-1 px-1">
              {NAV.map(item => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-[10px] tracking-wider whitespace-nowrap border transition-colors flex-shrink-0 ${active ? "border-charcoal bg-charcoal text-cream" : "border-light-gray text-warm-gray hover:border-charcoal hover:text-charcoal"}`}
                  >
                    <item.icon size={13} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Masaüstü: dikey sidebar */}
            <nav className="hidden lg:block space-y-1 sticky top-28">
              {/* Profil özeti */}
              <div className="flex items-center gap-3 p-4 bg-[#f0ece5] mb-4">
                <div className="w-10 h-10 rounded-full bg-charcoal text-cream flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {user.isim[0]}{user.soyisim[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{user.isim} {user.soyisim}</p>
                  <p className="text-xs text-warm-gray font-light truncate">{user.email}</p>
                </div>
              </div>

              {NAV.map(item => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 group ${active ? "bg-charcoal text-cream" : "text-warm-gray hover:text-charcoal hover:bg-cream-dark"}`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={15} strokeWidth={active ? 2 : 1.5} />
                      {item.label}
                    </div>
                    <ChevronRight size={13} className={`transition-opacity ${active ? "opacity-60" : "opacity-0 group-hover:opacity-40"}`} />
                  </Link>
                );
              })}

              <div className="pt-2 mt-2 border-t border-light-gray">
                <button
                  onClick={() => { logout(); router.push("/"); }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-warm-gray hover:text-charcoal hover:bg-cream-dark transition-all duration-200"
                >
                  <LogOut size={15} strokeWidth={1.5} />
                  Çıkış Yap
                </button>
              </div>
            </nav>
          </aside>

          {/* İçerik */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
