/**
 * 신규 가입자 혜택: 첫 게시 시 Pro 1개월 무료 체험.
 * - 부여 시점: 온보딩 Step1 저장 또는 대시보드 빠른 공개 (모두 첫 게시 경로)
 * - 만료 처리: billing/remind cron(매일)이 plan_expires_at 경과 시 free로 자동 전환
 * - ⚠️ 배너·SEO 문구(app/page.tsx, app/layout.tsx, app/for/[category]/page.tsx)와 동기화 필수
 * - 2026-07-31 종료된 Pro 평생 무료(is_mvp) 이벤트와는 별개 — 기존 is_mvp 유저는 영구 무료 유지
 */
export const TRIAL_MONTHS = 1;

/** 첫 게시 시 프로필에 병합할 Pro 체험 필드. 현재 free 플랜일 때만 부여할 것. */
export function getTrialProFields(now: Date = new Date()) {
  const expires = new Date(now);
  expires.setMonth(expires.getMonth() + TRIAL_MONTHS);
  return { plan: "pro" as const, plan_expires_at: expires.toISOString() };
}
