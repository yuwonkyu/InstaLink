import { redirect } from "next/navigation";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";
import type { Profile } from "@/lib/types";
import { PLAN_META } from "@/lib/types";
import dynamic from "next/dynamic";
import CopyLinkButton      from "@/components/dashboard/CopyLinkButton";
import SlugEditor           from "@/components/dashboard/SlugEditor";
import ReferralCard         from "@/components/dashboard/ReferralCard";
import DeleteAccountButton  from "@/components/dashboard/DeleteAccountButton";
import AvailabilityToggle   from "@/components/dashboard/AvailabilityToggle";
import ReviewLinkCard       from "@/components/dashboard/ReviewLinkCard";
import DashboardGuideWidget from "@/components/dashboard/DashboardGuideWidget";

// qrcode 라이브러리·모달은 초기 번들에서 분리해 첫 로드 속도 개선 (lazy chunk)
const QRCodeCard      = dynamic(() => import("@/components/dashboard/QRCodeCard"));
const InstaGuideModal = dynamic(() => import("@/components/dashboard/InstaGuideModal"));

type ClickStats = { kakao: number; instagram: number; phone: number };

function sumClicks(data: { link_type: string }[] | null): ClickStats {
  return (data ?? []).reduce(
    (acc, row) => {
      if (row.link_type === "kakao")     acc.kakao     += 1;
      if (row.link_type === "instagram") acc.instagram += 1;
      if (row.link_type === "phone")     acc.phone     += 1;
      return acc;
    },
    { kakao: 0, instagram: 0, phone: 0 },
  );
}

async function getClickStats(profileId: string): Promise<{ total: ClickStats; week: ClickStats }> {
  const supabase = await getSupabaseServerClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [totalRes, weekRes] = await Promise.all([
    supabase.from("link_clicks").select("link_type").eq("profile_id", profileId),
    supabase.from("link_clicks").select("link_type").eq("profile_id", profileId)
      .gte("created_at", weekAgo.toISOString()),
  ]);

  return { total: sumClicks(totalRes.data), week: sumClicks(weekRes.data) };
}

type DailyBar = { label: string; total: number };

async function getDailyClicksMini(profileId: string): Promise<DailyBar[]> {
  const supabase = await getSupabaseServerClient();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("link_clicks")
    .select("created_at")
    .eq("profile_id", profileId)
    .gte("created_at", sevenDaysAgo.toISOString());

  const byDate: Record<string, number> = {};
  for (const row of data ?? []) {
    const date = new Date(row.created_at).toISOString().split("T")[0];
    byDate[date] = (byDate[date] ?? 0) + 1;
  }

  const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const date = d.toISOString().split("T")[0];
    const label = i === 6 ? "오늘" : DAYS_KO[d.getDay()];
    return { label, total: byDate[date] ?? 0 };
  });
}

async function getMyProfile(ownerId: string): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) {
    console.error("대시보드 profiles 조회 실패:", error.message);
    return null;
  }
  return data as Profile | null;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarded?: string }>;
}) {
  // searchParams·supabase 클라이언트 초기화를 병렬 실행
  const [{ onboarded }, supabase] = await Promise.all([
    searchParams,
    getSupabaseServerClient(),
  ]);
  // 항상 canonical 도메인 사용 — 어떤 URL로 접속해도 링크가 일관되게 생성됨
  const SITE_URL = getSiteUrl();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // 프로필 먼저 조회 후, 파생 데이터를 병렬로 조회
  const profile = await getMyProfile(user.id);

  const [clickStats, referralCount, dailyMini] = profile
    ? await Promise.all([
        getClickStats(profile.id),
        getSupabaseServerClient().then((sb) =>
          sb
            .from("referral_events")
            .select("id", { count: "exact", head: true })
            .eq("referrer_id", profile.id)
            .then(({ count }) => count ?? 0)
        ),
        getDailyClicksMini(profile.id),
      ])
    : [null, 0, null];

  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const statsIsFree = !profile?.plan || profile?.plan === "free";
  const statsCreatedAt = profile?.created_at ? new Date(profile.created_at) : null;
  const statsDaysSince = statsCreatedAt ? Math.floor((now - statsCreatedAt.getTime()) / 86_400_000) : 999;
  const statsInTrial = statsIsFree && statsDaysSince < 14;
  const statsLocked = statsIsFree && !statsInTrial;

  return (
    <div className="flex flex-col gap-6">
      {/* 온보딩 완료 배너 */}
      {onboarded === "1" && profile && (
        <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
          <p className="text-sm font-semibold text-green-800">🎉 내 페이지가 완성됐어요!</p>
          <p className="mt-0.5 text-xs text-green-700">
            이제 인스타그램 bio에 링크를 붙여넣으면 고객이 바로 찾아올 수 있어요.
          </p>
          <div className="mt-3">
            <InstaGuideModal slug={profile.slug} siteUrl={SITE_URL} highlight />
          </div>
        </div>
      )}

      {/* 인사말 */}
      <div>
        <h1 className="text-xl font-bold text-foreground">
          안녕하세요{profile?.name ? `, ${profile.name}님` : ""}! 👋
        </h1>
        <p className="mt-1 text-sm text-(--muted)">내 InstaLink 페이지를 관리하세요.</p>
      </div>

      {/* 프로필 없는 경우 온보딩 안내 */}
      {!profile && (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-(--muted)">아직 페이지가 없습니다.</p>
          <p className="mt-1 text-xs text-(--muted)">
            Supabase 트리거가 자동으로 프로필을 생성합니다.
            <br />
            페이지가 보이지 않으면 로그아웃 후 다시 로그인해보세요.
          </p>
        </div>
      )}

      {/* 내 페이지 카드 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">내 페이지</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                profile.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-(--muted)"
              }`}
            >
              {profile.is_active ? "공개 중" : "비공개"}
            </span>
          </div>

          <p className="mb-1 text-lg font-bold text-foreground">
            {profile.shop_name || profile.name || "미설정"}
          </p>
          <p className="mb-4 text-sm text-(--muted)">{profile.tagline || "소개글 없음"}</p>

          <div className="flex flex-wrap gap-2">
            <a
              href={`${SITE_URL}/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80"
            >
              내 페이지 보기 →
            </a>
            <Link
              href="/dashboard/edit"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition-colors"
            >
              ✏️ 편집하기
            </Link>
          </div>
        </div>
      )}

      {/* URL 정보 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-sm font-semibold text-foreground">내 링크</h2>
            {profile.plan === "pro" && (
              <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-white">
                PRO
              </span>
            )}
          </div>

          {profile.plan === "pro" ? (
            <SlugEditor currentSlug={profile.slug} siteUrl={SITE_URL} />
          ) : (
            <>
              <CopyLinkButton slug={profile.slug} />
              <p className="mt-3 text-xs text-(--muted)">
                🔒 주소 커스텀은{" "}
                <Link href="/billing" className="font-semibold text-amber-500 hover:text-amber-600 underline underline-offset-2 transition-colors">
                  Pro 플랜
                </Link>
                에서 사용할 수 있습니다.
              </p>
            </>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <InstaGuideModal slug={profile.slug} siteUrl={SITE_URL} />
          </div>
        </div>
      )}

      {/* 방문자 통계 카드 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">방문자 현황</h2>
            {(!profile.plan || profile.plan === "free") ? (
              <Link href="/billing" className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors">
                업그레이드 →
              </Link>
            ) : (
              <Link href="/dashboard/stats" className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                통계 상세 →
              </Link>
            )}
          </div>

          {/* 누적 조회수 (모든 플랜 공개) */}
          <div className="flex items-end gap-2 mb-4">
            <span className="text-3xl font-bold text-foreground">
              {(profile.view_count ?? 0).toLocaleString()}
            </span>
            <span className="mb-1 text-sm text-(--muted)">누적 방문자</span>
          </div>

          {/* 주간 분석 — 2주 트라이얼 or 유료 잠금 */}
          {statsLocked ? (
              <div className="relative rounded-xl border border-dashed border-gray-200 p-4 overflow-hidden">
                <div className="flex justify-between items-end h-12 mb-2 blur-sm select-none pointer-events-none">
                  {[4, 7, 3, 12, 8, 15, 10].map((h, i) => (
                    <div key={i} className="w-6 rounded-t bg-gray-200"
                      style={{ height: `${(h / 15) * 100}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-(--muted) blur-sm select-none pointer-events-none">
                  {["월","화","수","목","금","토","일"].map((d) => <span key={d}>{d}</span>)}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-xl">
                  <span className="text-lg mb-1">🔒</span>
                  <p className="text-xs font-semibold text-foreground">주간 방문자 분석</p>
                  <p className="mt-0.5 text-[11px] text-(--muted)">Pro 플랜에서 확인하세요</p>
                  <Link href="/billing"
                    className="mt-2 rounded-lg bg-amber-400 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-500 transition-colors">
                    업그레이드
                  </Link>
                </div>
              </div>
            ) : (() => {
              const bars = dailyMini as DailyBar[] | null;
              const maxVal = Math.max(...(bars ?? []).map((b) => b.total), 1);
              const hasClicks = (bars ?? []).some((b) => b.total > 0);
              return (
                <div className="flex flex-col gap-3">
                  {statsInTrial && (
                    <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
                      <p className="text-xs font-semibold text-blue-800">
                        🎁 무료 체험 중 ({14 - statsDaysSince}일 남음)
                      </p>
                    </div>
                  )}
                  {/* 7일 바 차트 */}
                  <div>
                    <p className="mb-2 text-xs text-(--muted)">최근 7일 링크 클릭</p>
                    {hasClicks ? (
                      <>
                        <div className="flex items-end gap-1 h-16" aria-hidden="true">
                          {(bars ?? []).map((b, i) => (
                            <div
                              key={i}
                              className="group relative flex-1 flex flex-col justify-end h-full"
                            >
                              <div
                                className="w-full rounded-t bg-foreground opacity-60 group-hover:opacity-100 transition-opacity"
                                style={{ height: `${Math.max((b.total / maxVal) * 100, b.total > 0 ? 8 : 0)}%` }}
                              />
                              {b.total > 0 && (
                                <div className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-white group-hover:block z-10">
                                  {b.total}회
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex mt-1">
                          {(bars ?? []).map((b, i) => (
                            <div key={i} className="flex-1 text-center text-[10px] text-(--muted)">
                              {b.label}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="py-4 text-center text-xs text-(--muted)">
                        아직 링크 클릭 데이터가 없어요.
                      </p>
                    )}
                  </div>
                  <Link
                    href="/dashboard/stats"
                    className="text-right text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    30일 상세 통계 →
                  </Link>
                </div>
              );
            })()}
        </div>
      )}

      {/* 클릭 통계 카드 */}
      {profile && clickStats && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">링크 클릭 통계</h2>
            <span className="text-xs text-(--muted)">이번 주 / 전체</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "카카오 문의", week: clickStats.week.kakao,     total: clickStats.total.kakao },
              { label: "인스타그램",  week: clickStats.week.instagram, total: clickStats.total.instagram },
              { label: "전화 연결",   week: clickStats.week.phone,     total: clickStats.total.phone },
            ].map(({ label, week, total }) => (
              <div key={label} className="rounded-xl bg-(--secondary) p-3 text-center">
                <p className="text-xl font-bold text-foreground">{week.toLocaleString()}</p>
                <p className="text-xs text-(--muted)">{total > 0 ? `/ ${total}` : ""}</p>
                <p className="mt-1 text-[10px] text-(--muted) leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 후기 수집 카드 */}
      {profile && (
        <ReviewLinkCard
          slug={profile.slug}
          siteUrl={SITE_URL}
          reviewCount={profile.reviews?.length ?? 0}
          isPaid={profile.plan !== "free"}
        />
      )}

      {/* 예약 가능 토글 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-3 text-sm font-semibold text-foreground">예약 상태</h2>
          <AvailabilityToggle initialValue={profile.is_available ?? true} />
          <p className="mt-3 text-xs text-(--muted)">
            매일 상태를 업데이트하면 고객이 실시간으로 예약 가능 여부를 확인할 수 있어요.
          </p>
        </div>
      )}

      {/* QR 코드 카드 */}
      {profile && (
        <QRCodeCard
          url={`${SITE_URL}/${profile.slug}`}
          isPaid={profile.plan !== "free"}
        />
      )}

      {/* 플랜 카드 */}
      {profile && (
        <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">구독 플랜</h2>
            <Link href="/billing" className="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors">
              플랜 변경 →
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-white capitalize">
              {profile.plan ?? "free"}
            </span>
            <span className="text-sm text-(--muted)">
              {PLAN_META[profile.plan ?? "free"]?.price === 0
                ? "무료"
                : `${PLAN_META[profile.plan ?? "free"]?.price.toLocaleString()}원/월`}
            </span>
          </div>
          {profile.plan_expires_at && (
            <p className="mt-1.5 text-xs text-(--muted)">
              다음 결제일: {new Date(profile.plan_expires_at).toLocaleDateString("ko-KR")}
            </p>
          )}
          {(!profile.plan || profile.plan === "free") && (
            <Link
              href="/billing"
              className="mt-3 inline-block rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
            >
              업그레이드하기 →
            </Link>
          )}
        </div>
      )}

      {/* 레퍼럴 카드 */}
      {profile?.referral_code && (
        <ReferralCard
          referralCode={profile.referral_code}
          alreadyUsedCode={!!profile.referred_by}
          referralCount={referralCount}
          siteUrl={SITE_URL}
        />
      )}

      {/* 계정 탈퇴 */}
      <div className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <h2 className="mb-3 text-sm font-semibold text-foreground">계정 관리</h2>
        <DeleteAccountButton />
      </div>

      <DashboardGuideWidget />
    </div>
  );
}
