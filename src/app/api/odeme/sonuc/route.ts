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
    const formData = await req.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.redirect(new URL("/odeme/hatali?neden=token-yok", req.url));
    }

    const result = await new Promise<Record<string, string>>((resolve, reject) => {
      iyzipay.checkoutFormInitialize.retrieve(
        { locale: Iyzipay.LOCALE.TR, token },
        (err: Error, res: Record<string, string>) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });

    if (result.paymentStatus === "SUCCESS") {
      const params = new URLSearchParams({
        token,
        tutar: result.paidPrice || "",
        odemeId: result.paymentId || "",
      });
      return NextResponse.redirect(new URL(`/odeme/basarili?${params}`, req.url));
    }

    return NextResponse.redirect(
      new URL(`/odeme/hatali?neden=${encodeURIComponent(result.errorMessage || "ödeme başarısız")}`, req.url)
    );
  } catch (err) {
    console.error("Ödeme sonuç hatası:", err);
    return NextResponse.redirect(new URL("/odeme/hatali?neden=sunucu-hatasi", req.url));
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/", req.url));
}
