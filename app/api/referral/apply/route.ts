import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// POST /api/referral/apply
// Body: { referralCode: string }
// 로그인한 유저가 가입 후 추천인 코드를 입력하면 호출
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const referralCode: string = (body.referralCode ?? "").trim().toUpperCase();

  if (!referralCode) {
    return NextResponse.json({ error: "코드를 입력해주세요." }, { status: 400 });
  }

  // 요청 유저 확인 (서비스 롤 클라이언트로는 auth 쿠키 못 읽으므로 anon 클라이언트로 확인)
  const { createServerClient } = await import("@supabase/ssr");
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const supabaseUser = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );
  const { data: { user } } = await supabaseUser.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  // 내 프로필
  const { data: myProfile } = await supabaseAdmin
    .from("profiles")
    .select("id, referred_by")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!myProfile) return NextResponse.json({ error: "프로필을 찾을 수 없습니다." }, { status: 404 });
  if (myProfile.referred_by) {
    return NextResponse.json({ error: "이미 추천 코드를 사용했습니다." }, { status: 409 });
  }

  // 추천인 프로필 조회
  const { data: referrer } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("referral_code", referralCode)
    .maybeSingle();

  if (!referrer) return NextResponse.json({ error: "유효하지 않은 추천 코드입니다." }, { status: 404 });
  if (referrer.id === myProfile.id) {
    return NextResponse.json({ error: "자신의 코드는 사용할 수 없습니다." }, { status: 400 });
  }

  // referred_by 기록
  await supabaseAdmin
    .from("profiles")
    .update({ referred_by: referralCode })
    .eq("id", myProfile.id);

  // referral_events 기록
  await supabaseAdmin.from("referral_events").insert({
    referrer_id: referrer.id,
    referee_id: myProfile.id,
    reward_given: false,
  });

  // 추천인에게 plan_expires_at +1개월 보상 (유료 플랜인 경우에만)
  const { data: referrerFull } = await supabaseAdmin
    .from("profiles")
    .select("plan, plan_expires_at")
    .eq("id", referrer.id)
    .maybeSingle();

  if (referrerFull && referrerFull.plan !== "free" && referrerFull.plan_expires_at) {
    const current = new Date(referrerFull.plan_expires_at);
    current.setMonth(current.getMonth() + 1);
    await supabaseAdmin
      .from("profiles")
      .update({ plan_expires_at: current.toISOString() })
      .eq("id", referrer.id);

    await supabaseAdmin
      .from("referral_events")
      .update({ reward_given: true })
      .eq("referrer_id", referrer.id)
      .eq("referee_id", myProfile.id);
  }

  return NextResponse.json({ ok: true });
}
