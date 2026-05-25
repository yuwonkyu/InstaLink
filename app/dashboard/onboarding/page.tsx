import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, slug, shop_name, tagline, description, instagram_id, image_url, services, custom_links, is_active")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (profile?.is_active) redirect("/dashboard");

  const defaultName = profile?.name || user.email?.split("@")[0] || "";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-(--secondary) px-4 py-10">
      <div className="mb-8 text-center">
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          InstaLink
        </span>
        <p className="mt-1 text-sm text-(--muted)">3분 안에 내 링크 완성하기</p>
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.08)]">
        <OnboardingForm
          defaultName={defaultName}
          slug={profile?.slug ?? ""}
          defaultShopName={profile?.shop_name ?? ""}
          defaultTagline={profile?.tagline ?? ""}
          defaultDescription={profile?.description ?? ""}
          defaultInstagramId={profile?.instagram_id ?? ""}
          defaultImageUrl={profile?.image_url ?? ""}
          defaultServices={profile?.services ?? []}
          defaultCustomLinks={profile?.custom_links ?? []}
        />
      </div>

      <p className="mt-4 text-xs text-(--muted)">
        나중에 설정하려면{" "}
        <Link href="/dashboard" className="underline hover:text-foreground">
          대시보드로 이동
        </Link>
      </p>
    </div>
  );
}
