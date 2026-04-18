import { getProducts } from "@/lib/queries";
import ProductGrid from "@/components/ProductGrid";
import Link from "next/link";

export const revalidate = 300;

export default async function ErkekPage({ searchParams }: { searchParams: Promise<{ tip?: string }> }) {
  const { tip } = await searchParams;
  const products = await getProducts({ category: "erkek" });
  const kampanya = products.filter(p => p.original_price);

  const toCard = (p: typeof products[0]) => ({
    ...p, originalPrice: p.original_price ?? undefined, isNew: p.is_new, badge: p.badge ?? undefined,
  });

  const ayakkabi = products.filter(p => p.type === "ayakkabi").map(toCard);
  const canta = products.filter(p => p.type === "canta").map(toCard);

  const shown = tip === "ayakkabi" ? ayakkabi : tip === "canta" ? canta : null;
  const shownLabel = tip === "ayakkabi" ? "AYAKKABI" : tip === "canta" ? "ÇANTA" : null;

  return (
    <div className="min-h-screen bg-cream">
      <div className="border-b border-light-gray">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[9px] tracking-mega text-warm-gray mb-3 font-medium">2026 KOLEKSİYONU</p>
              <h1 className="text-5xl md:text-6xl font-serif font-medium tracking-wide text-charcoal leading-none">
                Erkek{tip === "ayakkabi" ? " · Ayakkabı" : tip === "canta" ? " · Çanta" : ""}
              </h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                {[
                  { label: "TÜMÜ", href: "/erkek", active: !tip },
                  { label: "AYAKKABI", href: "/erkek?tip=ayakkabi", active: tip === "ayakkabi" },
                  { label: "ÇANTA", href: "/erkek?tip=canta", active: tip === "canta" },
                ].map(({ label, href, active }) => (
                  <Link key={href} href={href} className={`text-[10px] tracking-ultra px-3 py-1.5 border transition-all duration-200 ${active ? "border-charcoal text-charcoal bg-charcoal/5" : "border-light-gray text-warm-gray hover:border-charcoal hover:text-charcoal"}`}>
                    {label}
                  </Link>
                ))}
              </div>
              {kampanya.length > 0 && (
                <Link href="/kampanya" className="text-[10px] tracking-ultra text-gold border border-gold/40 px-3 py-1.5 hover:bg-gold hover:text-cream transition-all duration-300">
                  {kampanya.length} KAMPANYALI
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6">
            <span className="block w-10 h-px bg-gold" />
            <p className="text-sm text-warm-gray font-light tracking-wide">Klasik duruş, modern dokunuşlar ve üstün kalite</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-16">
        {shown ? (
          <ProductGrid products={shown} sectionLabel={shownLabel ?? undefined} hideGender />
        ) : (
          <>
            {ayakkabi.length > 0 && <ProductGrid products={ayakkabi} sectionLabel="AYAKKABI" hideGender />}
            {canta.length > 0 && <ProductGrid products={canta} sectionLabel="ÇANTA" hideGender />}
          </>
        )}
      </div>
    </div>
  );
}
