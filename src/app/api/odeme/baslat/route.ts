import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: "https://sandbox-api.iyzipay.com",
});

function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { alici, teslimatAdresi, sepet, toplam } = body;

    const conversationId = `natty-${Date.now()}`;

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId,
      price: toplam.toFixed(2),
      paidPrice: toplam.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: conversationId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/odeme/sonuc`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: `U-${Date.now()}`,
        name: alici?.isim || "Misafir",
        surname: alici?.soyisim || "Kullanici",
        gsmNumber: alici?.telefon || "+905350000000",
        email: alici?.email || "misafir@natty.com",
        identityNumber: alici?.tcKimlik || "11111111111",
        registrationAddress: teslimatAdresi?.adres || "N/A",
        city: teslimatAdresi?.sehir || "Istanbul",
        country: "Turkey",
        ip: req.headers.get("x-forwarded-for") || "85.34.78.112",
      },
      shippingAddress: {
        contactName: `${alici?.isim || "Misafir"} ${alici?.soyisim || ""}`,
        city: teslimatAdresi?.sehir || "Istanbul",
        country: "Turkey",
        address: teslimatAdresi?.adres || "N/A",
      },
      billingAddress: {
        contactName: `${alici?.isim || "Misafir"} ${alici?.soyisim || ""}`,
        city: teslimatAdresi?.sehir || "Istanbul",
        country: "Turkey",
        address: teslimatAdresi?.adres || "N/A",
      },
      basketItems: sepet.map((item: { id: string; name: string; price: number; quantity: number }) => ({
        id: item.id,
        name: item.name,
        category1: "Moda",
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
        price: (item.price * item.quantity).toFixed(2),
      })),
    };

    const result = await new Promise<Record<string, string>>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: Error, res: Record<string, string>) => {
        if (err) reject(err); else resolve(res);
      });
    });

    if (result.status !== "success") {
      return NextResponse.json({ error: result.errorMessage || "Ödeme başlatılamadı" }, { status: 400 });
    }

    const sb = supabaseAdmin();

    const { data: order } = await sb.from("orders").insert({
      id: conversationId,
      user_id: alici?.userId || "00000000-0000-0000-0000-000000000000",
      durum: "hazirlaniyor",
      toplam,
      iyzico_token: result.token,
    }).select().single();

    if (order) {
      await sb.from("order_items").insert(
        sepet.map((item: { id: string; name: string; price: number; quantity: number; size?: number | null; image?: string }) => ({
          order_id: conversationId,
          product_id: item.id || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || null,
          image: item.image || null,
        }))
      );
    }

    return NextResponse.json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
      orderId: conversationId,
    });
  } catch (err) {
    console.error("Ödeme başlatma hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
