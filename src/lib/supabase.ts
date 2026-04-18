import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export type Database = {
  profiles: {
    id: string;
    isim: string;
    soyisim: string;
    telefon: string | null;
    dogum_tarihi: string | null;
    created_at: string;
  };
  products: {
    id: string;
    name: string;
    category: 'kadin' | 'erkek';
    type: 'ayakkabi' | 'canta';
    price: number;
    original_price: number | null;
    image: string;
    description: string;
    is_new: boolean;
    badge: string | null;
    stock: number;
  };
  addresses: {
    id: string;
    user_id: string;
    baslik: string;
    isim: string;
    soyisim: string;
    telefon: string;
    adres: string;
    ilce: string;
    sehir: string;
    posta_kodu: string;
    varsayilan: boolean;
    created_at: string;
  };
  orders: {
    id: string;
    user_id: string;
    durum: 'hazirlaniyor' | 'kargoda' | 'teslim_edildi' | 'iptal';
    toplam: number;
    iyzico_token: string | null;
    payment_id: string | null;
    created_at: string;
  };
  order_items: {
    id: string;
    order_id: string;
    product_id: string | null;
    name: string;
    price: number;
    quantity: number;
    size: number | null;
    image: string | null;
  };
  favorites: {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
  };
};
