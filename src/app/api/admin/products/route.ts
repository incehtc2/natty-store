import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FIELDS = "id,name,category,type,price,original_price,image,description,is_new,badge,stock";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await admin()
    .from("products")
    .insert([body])
    .select(FIELDS)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
