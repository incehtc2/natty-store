"use client";

import Link from "next/link";
import { ShoppingBag, Search, Menu, X, User, ChevronDown, LogOut, Package, MapPin, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import CartSlider from "./CartSlider";
import AnnouncementBar from "./AnnouncementBar";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "KADIN", href: "/kadin",
    sub: [
      { label: "Tümü", href: "/kadin" },
      { label: "Ayakkabı", href: "/kadin?tip=ayakkabi" },
      { label: "Çanta", href: "/kadin?tip=canta" },
    ],
  },
  {
    label: "ERKEK", href: "/erkek",
    sub: [
      { label: "Tümü", href: "/erkek" },
      { label: "Ayakkabı", href: "/erkek?tip=ayakkabi" },
      { label: "Çanta", href: "/erkek?tip=canta" },
    ],
  },
  { label: "KAMPANYA", href: "/kampanya", accent: true, badge: "%30", sub: [] },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [megaMenu, setMegaMenu] = useState<string | null>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { cartItems, isCartOpen, openCart, closeCart } = useCart();
  const { user, logout, isLoading } = useAuth();
  const totalItems = cartItems.reduce((t, i) => t + i.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const openMega = (label: string) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaMenu(label);
  };

  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMegaMenu(null), 120);
  };

  const closeMobile = () => {
    setIsMobileMenuOpen(false);
    setExpandedCat(null);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_20px_rgba(0,0,0,0.07)]" : ""}`}>
        {showAnnouncement && <AnnouncementBar onHide={() => setShowAnnouncement(false)} />}

        <header className={`bg-cream/98 backdrop-blur-sm border-b transition-colors duration-300 ${scrolled ? "border-transparent" : "border-light-gray"}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">

            {/* Sol nav */}
            <div className="flex-1 flex items-center gap-8">
              <button className="md:hidden p-1 -ml-1 text-charcoal" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={21} strokeWidth={1.5} />
              </button>

              <nav className="hidden md:flex items-center gap-8">
                {NAV_ITEMS.map(({ label, href, accent, badge, sub }) => (
                  <div
                    key={href}
                    className="relative"
                    onMouseEnter={() => sub.length > 0 ? openMega(label) : undefined}
                    onMouseLeave={() => sub.length > 0 ? closeMega() : undefined}
                  >
                    <Link
                      href={href}
                      className={`flex items-center gap-1 text-[11px] font-medium tracking-ultra relative group transition-colors duration-200 ${accent ? "text-gold hover:text-gold-light" : "text-charcoal/60 hover:text-charcoal"}`}
                    >
                      {label}
                      {badge && (
                        <span className="absolute -top-2.5 -right-4 bg-gold text-cream text-[8px] px-1.5 py-0.5 rounded-full tracking-normal font-medium leading-none">
                          {badge}
                        </span>
                      )}
                      {sub.length > 0 && (
                        <ChevronDown size={10} className={`transition-transform duration-200 ${megaMenu === label ? "rotate-180" : ""}`} />
                      )}
                      {!accent && <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-charcoal transition-all duration-300 group-hover:w-full" />}
                    </Link>

                    {sub.length > 0 && megaMenu === label && (
                      <div
                        className="absolute top-full left-0 mt-2 bg-cream border border-light-gray shadow-lg w-44 py-1.5 z-50"
                        onMouseEnter={() => openMega(label)}
                        onMouseLeave={closeMega}
                      >
                        {sub.map(s => (
                          <Link
                            key={s.href}
                            href={s.href}
                            className="flex items-center px-4 py-2.5 text-[11px] text-charcoal/60 hover:text-charcoal hover:bg-cream-dark transition-colors"
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 text-[28px] font-brand text-charcoal hover:text-charcoal/75 transition-colors duration-300 leading-none select-none">
              NATTY
              <svg width="26" height="26" viewBox="0 0 120 120" aria-hidden="true">
                <g fill="currentColor">
                  <circle cx="60" cy="60" r="6"/>
                  <ellipse cx="60" cy="25" rx="10" ry="20"/>
                  <ellipse cx="60" cy="95" rx="10" ry="20"/>
                  <ellipse cx="25" cy="60" rx="20" ry="10"/>
                  <ellipse cx="95" cy="60" rx="20" ry="10"/>
                  <ellipse cx="35" cy="35" rx="9" ry="18" transform="rotate(-45 35 35)"/>
                  <ellipse cx="85" cy="35" rx="9" ry="18" transform="rotate(45 85 35)"/>
                  <ellipse cx="35" cy="85" rx="9" ry="18" transform="rotate(45 35 85)"/>
                  <ellipse cx="85" cy="85" rx="9" ry="18" transform="rotate(-45 85 85)"/>
                </g>
              </svg>
            </Link>

            {/* Sağ ikonlar */}
            <div className="flex-1 flex items-center justify-end gap-4">
              <button onClick={() => setSearchOpen(true)} className="hidden sm:flex text-charcoal/50 hover:text-charcoal transition-colors duration-200">
                <Search size={18} strokeWidth={1.5} />
              </button>

              {!isLoading && (
                <div className="relative" ref={accountRef}>
                  {user ? (
                    <>
                      <button
                        onClick={() => setAccountOpen(o => !o)}
                        className="hidden sm:flex items-center gap-1.5 text-charcoal/50 hover:text-charcoal transition-colors duration-200"
                      >
                        <div className="w-7 h-7 rounded-full bg-charcoal text-cream flex items-center justify-center text-[11px] font-medium">
                          {user.isim[0]}{user.soyisim[0]}
                        </div>
                        <ChevronDown size={12} className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`} />
                      </button>

                      {accountOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-cream border border-light-gray shadow-lg z-50">
                          <div className="px-4 py-3 border-b border-light-gray">
                            <p className="text-sm font-medium text-charcoal">{user.isim} {user.soyisim}</p>
                            <p className="text-xs text-warm-gray font-light truncate">{user.email}</p>
                          </div>
                          <nav className="py-2">
                            {[
                              { href: "/hesabim", icon: <Settings size={14} />, label: "Hesabım" },
                              { href: "/hesabim/siparisler", icon: <Package size={14} />, label: "Siparişlerim" },
                              { href: "/hesabim/adresler", icon: <MapPin size={14} />, label: "Adreslerim" },
                            ].map(item => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal/70 hover:text-charcoal hover:bg-cream-dark transition-colors"
                              >
                                <span className="text-warm-gray">{item.icon}</span>
                                {item.label}
                              </Link>
                            ))}
                          </nav>
                          <div className="border-t border-light-gray py-2">
                            <button
                              onClick={() => { logout(); setAccountOpen(false); }}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-warm-gray hover:text-charcoal hover:bg-cream-dark transition-colors"
                            >
                              <LogOut size={14} />
                              Çıkış Yap
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href="/giris" className="hidden sm:flex text-charcoal/50 hover:text-charcoal transition-colors duration-200">
                      <User size={18} strokeWidth={1.5} />
                    </Link>
                  )}
                </div>
              )}

              <button onClick={openCart} className="relative text-charcoal/50 hover:text-charcoal transition-colors duration-200">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[9px] w-[17px] h-[17px] flex items-center justify-center rounded-full font-semibold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobil Menü */}
      <div className={`fixed inset-0 z-[60] transition-all duration-500 ${isMobileMenuOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-charcoal/50 transition-opacity duration-400 ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`} onClick={closeMobile} />
        <div className={`absolute top-0 left-0 h-full w-[300px] bg-cream flex flex-col transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b border-light-gray">
            <Link href="/" className="text-2xl font-brand leading-none" onClick={closeMobile}>NATTY</Link>
            <button onClick={closeMobile} className="text-charcoal/50 hover:text-charcoal transition-colors">
              <X size={21} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-col px-8 pt-8 gap-1">
            {NAV_ITEMS.map(({ label, href, accent, sub }) => (
              <div key={href}>
                <div className="flex items-center justify-between py-2">
                  <Link
                    href={href}
                    className={`text-xl font-serif tracking-wide transition-colors ${accent ? "text-gold" : "text-charcoal/75 hover:text-charcoal"}`}
                    onClick={sub.length === 0 ? closeMobile : undefined}
                  >
                    {label.charAt(0) + label.slice(1).toLowerCase()}
                  </Link>
                  {sub.length > 0 && (
                    <button
                      onClick={() => setExpandedCat(expandedCat === label ? null : label)}
                      className="p-1 text-warm-gray hover:text-charcoal transition-colors"
                    >
                      <ChevronDown size={15} className={`transition-transform duration-200 ${expandedCat === label ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {sub.length > 0 && expandedCat === label && (
                  <div className="pl-4 pb-2 flex flex-col gap-0.5 border-l border-light-gray ml-1">
                    {sub.map(s => (
                      <Link
                        key={s.href}
                        href={s.href}
                        onClick={closeMobile}
                        className="py-2 text-sm text-warm-gray hover:text-charcoal transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 mx-8 pt-8 border-t border-light-gray flex flex-col gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-charcoal text-cream flex items-center justify-center text-sm font-medium">
                    {user.isim[0]}{user.soyisim[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{user.isim} {user.soyisim}</p>
                    <p className="text-xs text-warm-gray">{user.email}</p>
                  </div>
                </div>
                {[
                  { href: "/hesabim", label: "Hesabım" },
                  { href: "/hesabim/siparisler", label: "Siparişlerim" },
                  { href: "/hesabim/adresler", label: "Adreslerim" },
                ].map(item => (
                  <Link key={item.href} href={item.href} className="text-sm text-warm-gray hover:text-charcoal transition-colors" onClick={closeMobile}>
                    {item.label}
                  </Link>
                ))}
                <button onClick={() => { logout(); closeMobile(); }} className="text-sm text-warm-gray hover:text-charcoal transition-colors text-left">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link href="/giris" className="flex-1 border border-charcoal text-charcoal text-center py-2.5 text-[10px] tracking-ultra hover:bg-charcoal hover:text-cream transition-all" onClick={closeMobile}>
                  GİRİŞ
                </Link>
                <Link href="/kayit" className="flex-1 bg-charcoal text-cream text-center py-2.5 text-[10px] tracking-ultra hover:bg-charcoal/85 transition-all" onClick={closeMobile}>
                  KAYIT OL
                </Link>
              </div>
            )}
          </div>

          <div className="mt-auto px-8 pb-8">
            <p className="text-xs text-warm-gray/40 tracking-widest">© 2026 NATTY</p>
          </div>
        </div>
      </div>

      <CartSlider isOpen={isCartOpen} onClose={closeCart} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
