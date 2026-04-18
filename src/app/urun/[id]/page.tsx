import { notFound } from "next/navigation";
import { getProduct, getSimilarProducts } from "@/lib/queries";
import UrunDetayClient from "./UrunDetayClient";

export const revalidate = 300;

export default async function UrunDetay({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const urun = await getProduct(id);
  if (!urun) return notFound();

  const benzer = await getSimilarProducts(urun.category, urun.type, urun.id);

  return <UrunDetayClient urun={urun} benzer={benzer} />;
}
