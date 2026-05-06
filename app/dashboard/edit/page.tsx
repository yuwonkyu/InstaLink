import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Profile } from "@/lib/types";
import EditForm from "./EditForm";
import PreviewPanel from "@/components/dashboard/PreviewPanel";

async function getMyProfile(ownerId: string): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    console.error("edit 페이지 profiles 조회 실패:", error.message);
    return null;
  }
  return data as Profile | null;
}

export default async function EditPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const profile = await getMyProfile(user.id);

  if (!profile) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl bg-white p-6 text-center shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
          <p className="text-sm text-(--muted)">프로필을 찾을 수 없습니다.</p>
          <Link href="/dashboard" className="mt-3 inline-block text-sm font-medium text-foreground underline">
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">프로필 편집</h1>
          <p className="mt-0.5 text-sm text-(--muted)">저장하면 내 페이지가 바로 공개됩니다.</p>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-(--muted) hover:text-foreground"
        >
          ← 대시보드
        </Link>
      </div>

      {/* lg 이상: 2컬럼 (편집 | 미리보기), 미만: 단일 컬럼 */}
      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-8">
        <EditForm profile={profile} plan={profile.plan} />
        <div className="lg:sticky lg:top-6">
          <PreviewPanel slug={profile.slug} />
        </div>
      </div>
    </div>
  );
}
