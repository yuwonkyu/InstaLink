"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Service, Review, Theme } from "@/lib/types";

export type SaveProfilePayload = {
  name: string;
  shop_name: string;
  tagline: string;
  description: string;
  kakao_url: string;
  instagram_id: string;
  location: string;
  hours: string;
  image_url: string;
  theme: Theme;
  services: Service[];
  reviews: Review[];
};

export async function saveProfile(payload: SaveProfilePayload) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: payload.name.trim(),
      shop_name: payload.shop_name.trim(),
      tagline: payload.tagline.trim(),
      description: payload.description.trim(),
      kakao_url: payload.kakao_url.trim(),
      instagram_id: payload.instagram_id.trim(),
      location: payload.location.trim(),
      hours: payload.hours.trim(),
      image_url: payload.image_url.trim(),
      theme: payload.theme,
      services: payload.services,
      reviews: payload.reviews,
      is_active: true, // 저장하면 페이지 공개
    })
    .eq("owner_id", user.id);

  if (error) {
    // 서버 액션에서 에러를 클라이언트로 전달하기 위해 throw
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");
  // 공개 페이지 캐시도 무효화 (slug는 DB에서 읽어야 하지만 전체 revalidate로 대응)
  revalidatePath("/[slug]", "page");

  redirect("/dashboard");
}
