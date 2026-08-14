import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendEmail, cancellationEmail } from "@/lib/resend";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export async function PATCH(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId, status } = await req.json();
  if (!requestId || (status !== "pending" && status !== "completed")) {
    return NextResponse.json({ error: "requestId, status 필수" }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: refundRequest, error: fetchError } = await admin
    .from("refund_requests")
    .select("profile_id, email, plan, profiles(name)")
    .eq("id", requestId)
    .maybeSingle();

  if (fetchError || !refundRequest) {
    return NextResponse.json({ error: fetchError?.message ?? "요청을 찾을 수 없습니다" }, { status: 404 });
  }

  const { error } = await admin
    .from("refund_requests")
    .update({
      status,
      processed_at: status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", requestId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // "처리 완료" 표시 시 — 실제 카드 환불은 토스페이먼츠 콘솔에서 수동 처리했다는 전제 하에,
  // 다음 결제 주기에 재청구되지 않도록 여기서 구독을 정리한다 (자동 재시도 cron 차단).
  if (status === "completed" && refundRequest.profile_id) {
    await Promise.all([
      admin
        .from("subscriptions")
        .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
        .eq("profile_id", refundRequest.profile_id)
        .eq("status", "active"),
      admin
        .from("profiles")
        .update({ billing_key: null, plan: "free", plan_expires_at: null })
        .eq("id", refundRequest.profile_id),
    ]);

    if (refundRequest.email) {
      const profileName = (refundRequest as { profiles?: { name?: string } }).profiles?.name ?? "";
      const tmpl = cancellationEmail(profileName, refundRequest.plan ?? "");
      sendEmail({ to: refundRequest.email, ...tmpl }).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true, status });
}
