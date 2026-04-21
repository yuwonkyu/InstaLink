import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

type ApplyResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

/**
 * 추천 코드를 특정 유저(owner_id)에게 적용합니다.
 * - 이미 사용한 코드면 skip (에러 아님)
 * - 추천인이 유료 플랜이면 plan_expires_at +1개월 지급
 */
export async function applyReferral(
  ownerUserId: string,
  referralCode: string,
): Promise<ApplyResult> {
  const code = referralCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "코드를 입력해주세요.", status: 400 };

  const sb = adminClient();

  // 내 프로필
  const { data: me } = await sb
    .from("profiles")
    .select("id, referred_by")
    .eq("owner_id", ownerUserId)
    .maybeSingle();

  if (!me) return { ok: false, error: "프로필을 찾을 수 없습니다.", status: 404 };
  if (me.referred_by) return { ok: false, error: "이미 추천 코드를 사용했습니다.", status: 409 };

  // 추천인 프로필
  const { data: referrer } = await sb
    .from("profiles")
    .select("id, plan, plan_expires_at")
    .eq("referral_code", code)
    .maybeSingle();

  if (!referrer) return { ok: false, error: "유효하지 않은 추천 코드입니다.", status: 404 };
  if (referrer.id === me.id) return { ok: false, error: "자신의 코드는 사용할 수 없습니다.", status: 400 };

  // referred_by 기록
  await sb.from("profiles").update({ referred_by: code }).eq("id", me.id);

  // referral_events 기록
  await sb.from("referral_events").insert({
    referrer_id: referrer.id,
    referee_id: me.id,
    reward_given: false,
  });

  // 추천인 보상: 유료 플랜이면 +1개월
  if (referrer.plan !== "free" && referrer.plan_expires_at) {
    const next = new Date(referrer.plan_expires_at);
    next.setMonth(next.getMonth() + 1);

    await sb
      .from("profiles")
      .update({ plan_expires_at: next.toISOString() })
      .eq("id", referrer.id);

    await sb
      .from("referral_events")
      .update({ reward_given: true })
      .eq("referrer_id", referrer.id)
      .eq("referee_id", me.id);
  }

  return { ok: true };
}
