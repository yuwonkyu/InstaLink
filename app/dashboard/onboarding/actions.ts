"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendEmail, newSignupNotificationEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";
import type { Service, CustomLink } from "@/lib/types";

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

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      name:         payload.name.trim(),
      shop_name:    payload.shop_name.trim() || payload.name.trim(),
      tagline:      payload.tagline.trim(),
      description:  payload.description.trim(),
      instagram_id: payload.instagram_id.trim(),
      image_url:    payload.image_url.trim(),
      is_active:    true,
    })
    .eq("owner_id", user.id)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);

  // 운영자 알림 이메일
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  if (ownerEmail && profile?.slug) {
    const tmpl = newSignupNotificationEmail(
      payload.name.trim(),
      profile.slug,
      user.email ?? "",
      getSiteUrl(),
    );
    sendEmail({ to: ownerEmail, ...tmpl }).catch((e) =>
      console.error("[onboarding] 운영자 알림 실패:", e),
    );
  }

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
