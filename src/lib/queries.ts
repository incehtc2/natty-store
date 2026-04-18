import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

const FIELDS = "id,name,category,type,price,original_price,image,description,is_new,badge,stock";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const getProducts = unstable_cache(
  async (params: { category?: string; kampanya?: boolean; yeni?: boolean } = {}) => {
    let q = sb().from("products").select(FIELDS);
    if (params.category) q = q.eq("category", params.category);
    if (params.kampanya) q = q.not("original_price", "is", null);
    if (params.yeni) q = q.eq("is_new", true);
    q = q.order("created_at", { ascending: false });
    const { data } = await q;
    return data || [];
  },
  ["products"],
  { revalidate: 300, tags: ["products"] }
);

export const getProduct = unstable_cache(
  async (id: string) => {
    const { data } = await sb()
      .from("products")
      .select(FIELDS)
      .eq("id", id)
      .single();
    return data;
  },
  ["product"],
  { revalidate: 300, tags: ["products"] }
);

export const getSimilarProducts = unstable_cache(
  async (category: string, type: string, excludeId: string) => {
    const { data } = await sb()
      .from("products")
      .select(FIELDS)
      .eq("category", category)
      .eq("type", type)
      .neq("id", excludeId)
      .limit(4);
    return data || [];
  },
  ["similar-products"],
  { revalidate: 300, tags: ["products"] }
);
