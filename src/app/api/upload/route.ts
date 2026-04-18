import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const IMAGE_BUCKET = "product-images";

export async function POST(req: NextRequest) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }

  // Bucket yoksa oluştur
  const { data: buckets } = await admin.storage.listBuckets();
  const exists = buckets?.some(b => b.name === IMAGE_BUCKET);
  if (!exists) {
    await admin.storage.createBucket(IMAGE_BUCKET, { public: true });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await admin.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = admin.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
