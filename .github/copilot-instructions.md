# GitHub Copilot — InstaLink 프로젝트 지침

> 이 파일은 VS Code Copilot이 자동으로 읽는 커스텀 지침입니다.
> Claude Code의 CLAUDE.md와 동일한 규칙을 공유합니다.

---

## 프로젝트 개요

소상공인(PT 트레이너·필라테스·미용실·카페 등)을 위한 인스타그램 링크페이지 SaaS.
Next.js 16 App Router + Supabase + Tailwind CSS v4 + 토스페이먼츠 + Vercel.

---

## 절대 하지 말 것

- `any` 타입 사용 금지 — `lib/types.ts`의 타입만 사용
- 고객 데이터를 코드에 하드코딩 금지 — 반드시 DB에서 조회
- 기존 CSS 클래스·디자인·폰트·색상 변경 금지
- `pages/` 디렉토리 방식으로 롤백 금지
- 불필요한 패키지 추가 금지 (현재 스택으로 해결)
- `/sample`, `/sample2`, `/sample3` 파일 삭제 금지 (레퍼런스용)
- 이미지는 `next/image`의 `<Image>` 컴포넌트 사용, 외부 이미지 도메인 추가 금지
- 환경변수를 코드에 하드코딩 금지 — `.env.local` 사용
- 에러 처리 시 `console.error`만으로 마무리 금지 — 사용자 친화적 메시지 필요

---

## 코드 작성 규칙

### TypeScript
- 서버 컴포넌트는 기본값 (no directive)
- 클라이언트 컴포넌트는 파일 첫 줄에 `"use client"` 필수
- Server Actions는 파일 첫 줄에 `"use server"` 필수
- `lib/types.ts`에 정의된 `Profile`, `Service`, `Review`, `Theme`, `Plan` 타입 사용

### URL 검증
- 외부 URL은 반드시 `isSafeUrl()` 통과 후 저장
- 카카오 URL: `open.kakao.com` 또는 `pf.kakao.com` 도메인만 허용
- 인스타그램 ID: `/^[a-zA-Z0-9_.]{1,30}$/` 형식 검증
- 슬러그: `/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9]|[a-z0-9]{0,1})$/` (예약어 차단)

### Supabase
- 서버 컴포넌트: `getSupabaseServerClient()` (SSR 쿠키 기반)
- 클라이언트 컴포넌트: `createBrowserClient()` (브라우저)
- API Route / Cron: `createClient(url, serviceRoleKey)` (admin)
- RLS 정책이 존재하므로 `service_role` 클라이언트는 Cron/API에서만 사용

### 결제 (토스페이먼츠)
- 결제 스케줄: 1일 청구 → 4일 1차 재시도 → 8일 2차 재시도 → 15일 free 강등
- `subscriptions` 테이블 status: `'active' | 'cancelled' | 'failed'`
- 결제 성공 시 `plan_expires_at` + `status: active` 동시 업데이트 필수

---

## 플랜 제한 (lib/plan-limits.ts 단일 소스)

| 기능 | Free | Basic | Pro |
|------|------|-------|-----|
| 갤러리 | 3장 | 6장 | 15장 |
| 서비스 | 3개 | 무제한 | 무제한 |
| 후기 | 3개 | 무제한 | 무제한 |
| 테마 | light만 | 7종 전체 | 7종 + 커스텀 |
| 통계 | 기본 | 14일 | 무제한 |
| 바이럴 배지 | 표시됨 | 표시됨 | 숨김 가능 |

`lib/plan-limits.ts` 수정 시 Free·Basic·Pro 세 플랜 전부 테스트 필요.

---

## 주요 파일 위치

| 작업 | 파일 |
|------|------|
| 플랜 제한 | `lib/plan-limits.ts` |
| 핵심 타입 | `lib/types.ts` |
| 공개 프로필 UI | `components/ProfilePage.tsx` |
| 대시보드 편집 폼 | `app/dashboard/edit/EditForm.tsx` |
| 편집 Server Actions | `app/dashboard/edit/actions.ts` |
| 미리보기 패널 | `components/dashboard/PreviewPanel.tsx` |
| 온보딩 | `app/dashboard/onboarding/` |
| 데모 페이지 | `app/demo/page.tsx` |
| 방문자 통계 | `app/dashboard/page.tsx` |
| 결제 청구 | `app/api/billing/charge/route.ts` |
| 결제 재시도 | `app/api/billing/retry/route.ts`, `retry-final/route.ts` |
| 자동 강등 | `app/api/billing/downgrade/route.ts` |
| 에러 바운더리 | `app/error.tsx`, `app/dashboard/error.tsx`, `app/[slug]/error.tsx` |
| 크론 스케줄 | `vercel.json` |
| DB 스키마 | `supabase/week*.sql` |

---

## 데모 / 미리보기 컴포넌트 사용 규칙

- `ProfilePage`에 DB 없는 임시 프로필을 넘길 때 `id: ""` 사용
- `trackClick`은 `profileId`가 빈 문자열이면 자동으로 early return (추적 생략)
- `PreviewPanel`의 `previewUrl`은 `window.location.origin` 기준 — 하드코딩 금지
- `OnboardingForm`의 슬러그 미리보기도 `window.location.origin` 기준

---

## 에러 바운더리

- `app/error.tsx` — 전역 (홈·랜딩 등)
- `app/dashboard/error.tsx` — 대시보드 전용
- `app/[slug]/error.tsx` — 공개 프로필 페이지 전용
- 새 route segment 추가 시 `error.tsx`도 함께 생성

---

## Cron 인증

모든 Cron API Route는 `Authorization: Bearer ${CRON_SECRET}` 헤더 검증 필수.
미검증 시 401 반환. `CRON_SECRET` 환경변수는 Vercel 대시보드에서 설정.

---

## 작업 우선순위 원칙

1. 가입→활성 전환율에 영향 주는 것 최우선
2. Pro 결제 유지에 영향 주는 것 두 번째
3. 편집 경험 개선 세 번째
4. 안정성·에러 처리 마지막

**기능 추가보다 기존 기능의 전환율 개선이 항상 우선이다.**
