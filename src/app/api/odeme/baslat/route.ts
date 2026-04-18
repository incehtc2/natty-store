import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: "https://sandbox-api.iyzipay.com",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { buyer, adres, items, total } = body;

    const basketItems = items.map((item: { id: string; name: string; category: string; price: number; quantity: number }) => ({
      id: item.id,
      name: item.name,
      category1: item.category === "kadin" || item.category === "erkek" ? "Ayakkabı & Çanta" : "Aksesuar",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: (item.price * item.quantity).toFixed(2),
    }));

    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: `natty-${Date.now()}`,
      price: total.toFixed(2),
      paidPrice: total.toFixed(2),
      currency: Iyzipay.CURRENCY.TRY,
      basketId: `BASKET-${Date.now()}`,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/odeme/sonuc`,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: `U-${Date.now()}`,
        name: buyer.isim,
        surname: buyer.soyisim,
        gsmNumber: buyer.telefon,
        email: buyer.email,
        identityNumber: buyer.tcNo,
        registrationAddress: adres.adresSatiri,
        city: adres.sehir,
        country: "Turkey",
        zipCode: adres.postaKodu || "34000",
        ip: req.headers.get("x-forwarded-for") || "85.34.78.112",
      },
      shippingAddress: {
        contactName: `${buyer.isim} ${buyer.soyisim}`,
        city: adres.sehir,
        country: "Turkey",
        address: adres.adresSatiri,
        zipCode: adres.postaKodu || "34000",
      },
      billingAddress: {
        contactName: `${buyer.isim} ${buyer.soyisim}`,
        city: adres.sehir,
        country: "Turkey",
        address: adres.adresSatiri,
        zipCode: adres.postaKodu || "34000",
      },
      basketItems,
    };

    const result = await new Promise<Record<string, string>>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.create(request, (err: Error, res: Record<string, string>) => {
        if (err) reject(err);
        else resolve(res);
      });
    });

    if (result.status !== "success") {
      return NextResponse.json({ error: result.errorMessage || "Ödeme başlatılamadı" }, { status: 400 });
    }

    return NextResponse.json({
      checkoutFormContent: result.checkoutFormContent,
      token: result.token,
    });
  } catch (err) {
    console.error("Ödeme başlatma hatası:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
