/**
 * 신규 가입자 Pro(MVP) 무료 승격 마감 기준.
 * ⚠️ 이벤트 배너·SEO 문구(app/page.tsx, app/layout.tsx, app/for/[category]/page.tsx)와 날짜 동기화 필수.
 * 이 상수가 승격 로직의 단일 출처다(온보딩·대시보드 게시 액션 공유).
 */
export const MVP_CUTOFF = new Date("2026-08-01T00:00:00+09:00");

/** 지금이 MVP 무료 승격 기간인지 */
export function isMvpPeriod(now: Date = new Date()): boolean {
  return now < MVP_CUTOFF;
}
