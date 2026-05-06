"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";

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

  const { error } = await supabase
    .from("profiles")
    .update({
      name: payload.name.trim(),
      shop_name: payload.name.trim(),
      kakao_url: payload.kakao_url.trim(),
      is_active: true,
    })
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/[slug]", "page");
  redirect("/dashboard?onboarded=1");
}
