// Vercel Cron: 매월 15일 02:00 UTC — 14일 이상 결제 실패 구독 자동 다운그레이드
// 1일 결제 실패 → 4일·8일 재시도 모두 실패한 구독을 free 플랜으로 내린다.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function downgradeEmail(name: string, plan: string) {
  return {
    subject: "[인스타링크] 구독이 일시 정지되었습니다",
    html: `
      <p>안녕하세요, ${name || "고객"}님.</p>
      <p>결제 수단 문제로 ${plan} 구독이 14일 이상 미납 상태가 되어 무료 플랜으로 전환되었습니다.</p>
      <p>서비스를 계속 이용하시려면 결제 수단을 업데이트한 후 다시 구독해주세요.</p>
      <p><a href="${SITE_URL}/dashboard/billing">결제 수단 업데이트하기 →</a></p>
      <p>감사합니다.<br/>인스타링크 팀</p>
    `,
  };
}

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // status='failed' 구독 전체 조회 — 월 15일 cron이므로 1일 실패 건 = 14일 경과
  const { data: failed, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, name, plan)")
    .eq("status", "failed");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (failed ?? []).map(async (sub) => {
      const profile = sub.profiles as {
        id: string;
        owner_id: string;
        name: string;
        plan: string;
      };
      if (!profile) return;

      await Promise.all([
        supabaseAdmin
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("id", sub.id),
        supabaseAdmin
          .from("profiles")
          .update({ plan: "free", plan_expires_at: null })
          .eq("id", profile.id),
      ]);

      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
        profile.owner_id,
      );
      const email = authUser?.user?.email;
      if (email) {
        const tmpl = downgradeEmail(profile.name ?? "", sub.plan);
        sendEmail({ to: email, ...tmpl }).catch(() => {});
      }
    }),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ total: results.length, succeeded });
}
