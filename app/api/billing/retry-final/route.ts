// Vercel Cron: 매월 8일 02:00 UTC — 결제 실패 건 2차 재시도
// 1일 자동결제 실패 → 4일 1차 재시도도 실패한 구독을 7일 후 마지막으로 시도한다.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail, paymentFailEmail, paymentSuccessEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

const SITE_URL = getSiteUrl();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function tossAuth() {
  const key = process.env.TOSSPAYMENTS_SECRET_KEY ?? "";
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: failed, error } = await supabaseAdmin
    .from("subscriptions")
    .select("*, profiles(id, owner_id, billing_key, name)")
    .eq("status", "failed")
    .not("profiles.billing_key", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = await Promise.allSettled(
    (failed ?? []).map(async (sub) => {
      const profile = sub.profiles as {
        id: string;
        owner_id: string;
        billing_key: string;
        name: string;
      };
      if (!profile?.billing_key) return;

      const orderId = `retry2-${sub.id.slice(0, 8)}-${Date.now()}`;
      const now = new Date();
      const nextBillingAt = new Date(now);
      const isAnnual = sub.billing_period === "annual";
      if (isAnnual) {
        nextBillingAt.setFullYear(nextBillingAt.getFullYear() + 1);
      } else {
        nextBillingAt.setMonth(nextBillingAt.getMonth() + 1);
      }

      const res = await fetch(
        `https://api.tosspayments.com/v1/billing/${profile.billing_key}`,
        {
          method: "POST",
          headers: {
            Authorization: tossAuth(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerKey: profile.owner_id,
            amount: sub.amount,
            orderId,
            orderName: `InstaLink ${sub.plan === "basic" ? "Basic" : "Pro"} 구독 (2차 재시도)`,
          }),
        },
      );

      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
        profile.owner_id,
      );
      const email = authUser?.user?.email;

      if (res.ok) {
        await Promise.all([
          supabaseAdmin
            .from("subscriptions")
            .update({
              status: "active",
              next_billing_at: nextBillingAt.toISOString(),
              toss_order_id: orderId,
            })
            .eq("id", sub.id),
          supabaseAdmin
            .from("profiles")
            .update({
              plan: sub.plan,
              plan_expires_at: nextBillingAt.toISOString(),
            })
            .eq("id", profile.id),
        ]);
        if (email) {
          const tmpl = paymentSuccessEmail(profile.name ?? "", sub.plan, sub.amount);
          sendEmail({ to: email, ...tmpl }).catch(() => {});
        }
      } else {
        // 2차 재시도도 실패 — 7일 후 자동 다운그레이드 예고 이메일
        if (email) {
          const tmpl = paymentFailEmail(profile.name ?? "", sub.plan, SITE_URL);
          sendEmail({ to: email, ...tmpl }).catch(() => {});
        }
      }
    }),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return NextResponse.json({ total: results.length, succeeded });
}
