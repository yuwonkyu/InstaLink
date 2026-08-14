import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";
import { sendEmail, refundRequestEmail } from "@/lib/resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
const SITE_URL = getSiteUrl();

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, plan")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if (!profile.plan || profile.plan === "free") {
    return NextResponse.json({ error: "유료 플랜에서만 환불 신청이 가능합니다" }, { status: 400 });
  }

  const { reason } = (await req.json().catch(() => ({}))) as { reason?: string };

  // 가장 최근 결제 건의 주문번호·금액 — 토스페이먼츠 콘솔에서 환불 처리 시 조회용
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("toss_order_id, amount")
    .eq("profile_id", profile.id)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await admin.from("refund_requests").insert({
    profile_id: profile.id,
    owner_id: user.id,
    email: user.email ?? "",
    plan: profile.plan,
    order_id: subscription?.toss_order_id ?? null,
    amount: subscription?.amount ?? null,
    reason: reason?.trim() || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (ADMIN_EMAIL) {
    const tmpl = refundRequestEmail(
      profile.name ?? "",
      user.email ?? "",
      profile.plan,
      reason?.trim() ?? "",
      SITE_URL,
      subscription?.toss_order_id,
      subscription?.amount,
    );
    sendEmail({ to: ADMIN_EMAIL, ...tmpl }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
