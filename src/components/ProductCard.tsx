import Image from "next/image";
import Link from "next/link";
import { type Product, indirimOrani } from "../lib/data";

export default function ProductCard({ product }: { product: Product }) {
  const oran = indirimOrani(product);

  return (
    <Link href={`/urun/${product.id}`} className="group block w-full">
      {/* Görsel */}
      <div className="relative w-full overflow-hidden bg-cream-dark" style={{ paddingBottom: "133.33%" }}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="absolute inset-0 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/4 transition-colors duration-500" />

        {/* Rozetler */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-charcoal text-cream text-[9px] tracking-widest px-2 py-1 font-medium leading-none">
              YENİ
            </span>
          )}
          {oran > 0 && (
            <span className="bg-gold text-cream text-[9px] tracking-wider px-2 py-1 font-semibold leading-none">
              -%{oran}
            </span>
          )}
        </div>

        {/* Hover CTA */}
        <div className="absolute bottom-0 left-0 right-0 bg-cream/96 py-2.5 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <span className="text-[10px] tracking-ultra font-medium text-charcoal">ÜRÜNÜ İNCELE</span>
        </div>
      </div>

      {/* Bilgi */}
      <div className="pt-3 space-y-1">
        <h3 className="text-sm font-medium text-charcoal leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-charcoal">
            {product.price.toLocaleString("tr-TR")} ₺
          </span>
          {product.originalPrice && (
            <span className="text-xs text-warm-gray/60 line-through font-light">
              {product.originalPrice.toLocaleString("tr-TR")} ₺
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
