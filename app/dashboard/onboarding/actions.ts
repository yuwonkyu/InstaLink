"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getTrialProFields } from "@/lib/trial";
import type { Service, CustomLink } from "@/lib/types";

// plan/plan_expires_at은 authenticated 권한에서 제외돼 있어 (결제 없는 셀프 승급 방지)
// 트라이얼 지급은 service role로만 가능
function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// ── Step 1: 기본 정보 ──────────────────────────────────────────
export type Step1Payload = {
  name: string;
  shop_name: string;
  tagline: string;
  description: string;
  instagram_id: string;
  image_url: string;
};

export async function saveOnboardingStep1(payload: Step1Payload) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 첫 게시 혜택 — 현재 free 플랜일 때만 Pro 1개월 무료 체험 부여 (유료·MVP 유저 보호)
  const { data: current } = await supabase
    .from("profiles")
    .select("plan")
    .eq("owner_id", user.id)
    .maybeSingle();
  const grantTrial = !current?.plan || current.plan === "free";

  const { error } = await supabase
    .from("profiles")
    .update({
      name:            payload.name.trim(),
      shop_name:       payload.shop_name.trim() || payload.name.trim(),
      tagline:         payload.tagline.trim(),
      description:     payload.description.trim(),
      instagram_id:    payload.instagram_id.trim(),
      image_url:       payload.image_url.trim(),
      is_active:       true,
    })
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);

  if (grantTrial) {
    await adminClient()
      .from("profiles")
      .update(getTrialProFields())
      .eq("owner_id", user.id);
  }

  // 운영자 알림 이메일은 signUp 시점(app/auth/actions.ts)에서 발송됨 — 여기서 중복 발송 안 함.

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
}

// ── Step 2: 서비스 ────────────────────────────────────────────
export async function saveOnboardingStep2(services: Service[]) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { error } = await supabase
    .from("profiles")
    .update({ services })
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[slug]", "page");
}

// ── Step 3: 링크 ──────────────────────────────────────────────
export async function saveOnboardingStep3(customLinks: CustomLink[]) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { error } = await supabase
    .from("profiles")
    .update({ custom_links: customLinks })
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/[slug]", "page");
}
