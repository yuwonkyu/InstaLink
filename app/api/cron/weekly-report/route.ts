import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, weeklyReportEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  // Vercel Cron 인증
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // 활성 프로필 전체 조회 (이메일은 auth.users에서)
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, slug, name, owner_id, view_count, plan")
    .eq("is_active", true);

  if (error || !profiles) {
    console.error("[weekly-report] profiles 조회 실패:", error?.message);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const profile of profiles) {
    try {
      // 이메일 조회
      const { data: userData } = await admin.auth.admin.getUserById(profile.owner_id);
      const email = userData?.user?.email;
      if (!email) { skipped++; continue; }

      // 이번 주 클릭 수
      const { data: clicks } = await admin
        .from("link_clicks")
        .select("link_type")
        .eq("profile_id", profile.id)
        .gte("created_at", weekAgo.toISOString());

      const weekViews  = 0; // view_logs 테이블 없어서 현재는 0 (추후 구현)
      const kakaoClicks = (clicks ?? []).filter((c) => c.link_type === "kakao").length;

      // 아무 활동도 없으면 스킵
      if (kakaoClicks === 0 && (profile.view_count ?? 0) === 0) {
        skipped++;
        continue;
      }

      const tmpl = weeklyReportEmail(
        profile.name,
        profile.slug,
        SITE_URL,
        profile.view_count ?? 0,
        weekViews,
        kakaoClicks,
      );

      await sendEmail({ to: email, ...tmpl });
      sent++;

      // Resend rate limit 방지
      await new Promise((r) => setTimeout(r, 200));
    } catch (e) {
      console.error(`[weekly-report] 이메일 실패 (${profile.id}):`, e);
      skipped++;
    }
  }

  console.log(`[weekly-report] 완료 — 발송: ${sent}, 스킵: ${skipped}`);
  return NextResponse.json({ ok: true, sent, skipped });
}
