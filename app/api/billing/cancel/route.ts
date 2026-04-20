import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 구독 취소 처리
  const now = new Date().toISOString();
  await Promise.all([
    supabase.from("subscriptions")
      .update({ status: "cancelled", cancelled_at: now })
      .eq("status", "active")
      .in("profile_id",
        supabase.from("profiles").select("id").eq("owner_id", user.id),
      ),
    supabase.from("profiles")
      .update({ plan: "free", billing_key: null, plan_expires_at: null })
      .eq("owner_id", user.id),
  ]);

  return NextResponse.json({ ok: true });
}
