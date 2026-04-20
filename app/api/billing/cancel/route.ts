import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function POST() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 1. 본인 profile id 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const now = new Date().toISOString();

  // 2. 구독 취소 + 플랜 초기화 (순차 처리)
  await supabase
    .from("subscriptions")
    .update({ status: "cancelled", cancelled_at: now })
    .eq("profile_id", profile.id)
    .eq("status", "active");

  await supabase
    .from("profiles")
    .update({ plan: "free", billing_key: null, plan_expires_at: null })
    .eq("owner_id", user.id);

  return NextResponse.json({ ok: true });
}
