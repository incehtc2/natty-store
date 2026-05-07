import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  await supabaseAdmin()
    .from("products")
    .select("id")
    .limit(1);

  return Response.json({
    ok: true,
    time: new Date().toISOString(),
  });
}
