import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { applyReferral } from "@/lib/referral";

// POST /api/referral/apply
// Body: { referralCode: string }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const referralCode: string = (body.referralCode ?? "").trim();

  if (!referralCode) {
    return NextResponse.json({ error: "코드를 입력해주세요." }, { status: 400 });
  }

  // 현재 로그인 유저 확인
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const result = await applyReferral(user.id, referralCode);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  return NextResponse.json({ ok: true });
}
