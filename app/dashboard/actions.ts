"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import { isMvpPeriod } from "@/lib/mvp";
import { normalizeExternalHref } from "@/lib/profile-utils";
import type { CustomLink } from "@/lib/types";

export type QuickStartPayload = {
  name: string;
  shop_name: string;
  primaryLink: string;
};

/**
 * 대시보드 빠른 공개 — 온보딩을 건너뛰어 비공개 상태인 사용자가
 * 이름/상호 + 대표 링크만 넣고 즉시 페이지를 공개하도록 한다.
 */
export async function publishQuickStart(payload: QuickStartPayload) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const name = payload.name.trim();
  if (!name) throw new Error("이름을 입력해주세요.");

  const { data: current } = await supabase
    .from("profiles")
    .select("custom_links")
    .eq("owner_id", user.id)
    .maybeSingle();

  const existingLinks = (current?.custom_links as CustomLink[] | null) ?? [];
  const primary = normalizeExternalHref(payload.primaryLink);
  const isKakao = !!primary && /kakao/i.test(primary);

  // 카카오가 아닌 대표 링크는 실제 링크를 맨 앞 버튼으로 추가 (예시 링크는 시드하지 않음).
  const seededLinks =
    primary && !isKakao
      ? [{ title: "문의하기", url: primary, style: "text" as const }, ...existingLinks]
      : existingLinks;

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      shop_name: payload.shop_name.trim() || name,
      custom_links: seededLinks,
      ...(isKakao && primary ? { kakao_url: primary } : {}),
      is_active: true,
      ...(isMvpPeriod() && { plan: "pro", is_mvp: true, plan_expires_at: null }),
    })
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
}
