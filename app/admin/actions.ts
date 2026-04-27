"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Plan } from "@/lib/types";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function changePlan(profileId: string, plan: Plan) {
  // ── 관리자 인증 검증 ──────────────────────────────
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized: 관리자만 플랜을 변경할 수 있습니다.");
  }

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await adminClient
    .from("profiles")
    .update({
      plan,
      plan_expires_at: plan === "free" ? null : nextMonth.toISOString(),
    })
    .eq("id", profileId);

  revalidatePath("/admin");
}

// ── 어드민 강제 삭제 (소프트 딜리트 — 복구 가능) ──────────────
export async function adminDeleteProfile(profileId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  // 통계 기록 (개인정보 제외)
  const { data: profile } = await adminClient
    .from("profiles")
    .select("plan, created_at, reviews, view_count")
    .eq("id", profileId)
    .maybeSingle();

  if (profile) {
    const daysActive = Math.floor(
      (Date.now() - new Date(profile.created_at).getTime()) / 86_400_000,
    );
    await adminClient.from("deleted_accounts").insert({
      plan: profile.plan ?? "free",
      days_active: daysActive,
      had_paid: profile.plan !== "free" && !!profile.plan,
      had_reviews: Array.isArray(profile.reviews) && profile.reviews.length > 0,
      view_count: profile.view_count ?? 0,
    });
  }

  // 구독 취소
  await adminClient
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("profile_id", profileId);

  // 소프트 딜리트: is_active=false + 플랜 초기화 (auth 계정 유지 → 복구 가능)
  await adminClient
    .from("profiles")
    .update({ is_active: false, plan: "free", plan_expires_at: null })
    .eq("id", profileId);

  revalidatePath("/admin");
}

// ── 어드민 강제 복구 ───────────────────────────────────────────
export async function adminRestoreProfile(profileId: string) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }

  await adminClient
    .from("profiles")
    .update({ is_active: true })
    .eq("id", profileId);

  revalidatePath("/admin");
}
