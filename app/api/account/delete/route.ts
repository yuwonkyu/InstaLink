import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function DELETE() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = adminClient();

  // 0. 탈퇴 통계 기록 (개인정보 제외, 삭제 전에 먼저 저장)
  const { data: profile } = await admin
    .from("profiles")
    .select("plan, created_at, reviews, view_count")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (profile) {
    const daysActive = Math.floor(
      (Date.now() - new Date(profile.created_at).getTime()) / 86_400_000,
    );
    await admin.from("deleted_accounts").insert({
      plan: profile.plan ?? "free",
      days_active: daysActive,
      had_paid: profile.plan !== "free" && !!profile.plan,
      had_reviews: Array.isArray(profile.reviews) && profile.reviews.length > 0,
      view_count: profile.view_count ?? 0,
    });
  }

  // 1. profiles 테이블 데이터 삭제 (cascade로 연관 데이터도 삭제됨)
  const { error: profileError } = await admin
    .from("profiles")
    .delete()
    .eq("owner_id", user.id);

  if (profileError) {
    console.error("[탈퇴] 프로필 삭제 실패:", profileError.message);
    return NextResponse.json({ error: "프로필 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }

  // 2. auth 유저 삭제
  const { error: authError } = await admin.auth.admin.deleteUser(user.id);

  if (authError) {
    console.error("[탈퇴] 유저 삭제 실패:", authError.message);
    return NextResponse.json({ error: "계정 삭제 중 오류가 발생했습니다." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
