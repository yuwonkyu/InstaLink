"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendEmail, newSignupNotificationEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

export type OnboardingPayload = {
  name: string;
  kakao_url: string;
};

export async function saveOnboarding(payload: OnboardingPayload) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      name: payload.name.trim(),
      shop_name: payload.name.trim(),
      kakao_url: payload.kakao_url.trim(),
      is_active: true,
    })
    .eq("owner_id", user.id)
    .select("slug")
    .single();

  if (error) throw new Error(error.message);

  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  if (ownerEmail && profile?.slug) {
    const tmpl = newSignupNotificationEmail(
      payload.name.trim(),
      profile.slug,
      user.email ?? "",
      getSiteUrl(),
    );
    await sendEmail({ to: ownerEmail, ...tmpl }).catch((e) =>
      console.error("[onboarding] 운영자 알림 실패:", e),
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
  redirect("/dashboard?onboarded=1");
}
