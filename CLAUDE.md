@AGENTS.md
@docs/PRODUCT_ANALYSIS.md
@docs/ROADMAP.md

# InstaLink — 프로젝트 규칙 (에이전트 필독)

## 프로젝트 개요
소상공인(카페·미용실·PT·필라테스 등)을 위한 인스타그램 프로필 링크 랜딩페이지 SaaS.
링크트리 대신 서비스 소개 + 후기 + 카카오 문의까지 한 번에 담는 1페이지 사이트를 제공한다.

## 현재 상태 (2026-05-14 기준)
Phase A~C 로드맵 완료. 다음 단계는 Phase D (첫 20명 유료 고객 확보) — 마케팅 중심.

**완료된 핵심 기능**
- `/[slug]` 동적 공개 페이지 + Supabase 연동
- Supabase Auth 회원가입·로그인·온보딩 (3필드 단순화)
- 대시보드 편집 (탭 4개: 내 페이지·서비스·메뉴·사진·후기·설정)
- 편집 미리보기 패널 (데스크탑 iframe / 모바일 버튼)
- 토스페이먼츠 구독 결제 (Free/Basic/Pro) + 자동 재시도 cron
- 방문자 통계 + 7일 링크 클릭 차트
- 바이럴 배지 (공개 페이지 푸터, Pro만 숨기기 가능)
- Free 플랜 갤러리 3장 허용
- CTA 위계 개선 (메인 full-width + 보조 소형 버튼)
- 에러 바운더리 (`app/error.tsx`, `app/dashboard/error.tsx`, `app/[slug]/error.tsx`)
- 로그인 없이 데모 체험 (`app/demo/page.tsx`)
- 관리자 대시보드, 레퍼럴, QR코드, 주간 리포트 이메일, AI 소개글 추천
- SEO: 업종별 카테고리 7개, JSON-LD, sitemap, GA4

## 기술 스택
- **Framework**: Next.js App Router (TypeScript)
- **DB + Auth**: Supabase
- **이미지**: Cloudinary (현재도 사용 중 — URL 형식 유지)
- **결제**: 토스페이먼츠 (빌링키 방식, vercel.json cron으로 자동 재시도)
- **배포**: Vercel (instalink.kkustudio.com)

## 디렉토리 규칙
```
app/
  [slug]/          ← 고객 공개 페이지 (동적 라우팅)
  dashboard/       ← 로그인한 사장님 홈 (통계)
    edit/          ← 편집 폼 (4탭) + 미리보기 패널
    onboarding/    ← 가입 후 최초 설정 (3필드)
    stats/         ← 상세 통계
  demo/            ← 로그인 없이 체험 페이지
  admin/           ← 관리자 대시보드
  billing/         ← 구독 관리
  api/
    profile/       ← Supabase CRUD
    billing/       ← 토스페이먼츠 + cron
    track/         ← 링크 클릭 추적
components/
  ProfilePage.tsx  ← 공개 페이지 UI
  edit/tabs/       ← BasicTab, DesignTab 등 편집 탭
lib/
  supabase.ts      ← Supabase 클라이언트
  types.ts         ← Profile 타입 정의
  plan-limits.ts   ← 플랜별 수량 제한 (Free·Basic·Pro)
```

## Supabase 테이블 구조 (profiles)
```sql
id           uuid primary key
slug         text unique not null   -- URL 식별자 (예: "myshop")
owner_id     uuid references auth.users
name         text                   -- 사장님/가게 이름
shop_name    text                   -- 상호명
tagline      text                   -- 한 줄 소개
description  text                   -- 본문 소개
kakao_url    text                   -- 카카오 오픈채팅 링크
instagram_id text                   -- 인스타 아이디
location     text                   -- 위치
hours        text                   -- 운영시간
image_url    text                   -- Cloudinary 이미지 URL
services     jsonb                  -- [{name, price, note}]
reviews      jsonb                  -- [{text, author}]
is_active    boolean default true   -- 결제 상태 연동
created_at   timestamptz default now()
```

## 코드 작성 규칙
- `any` 타입 절대 금지 — 반드시 `lib/types.ts`의 타입 사용
- 고객 데이터를 코드에 하드코딩 금지 — 반드시 DB에서 조회
- 기존 CSS 클래스명·디자인 변경 금지 (UI는 현재 sample 페이지와 동일하게 유지)
- 이미지는 반드시 `next/image`의 `<Image>` 컴포넌트 사용
- Cloudinary URL 이외의 외부 이미지 도메인 추가 금지
- 서버 컴포넌트 기본, 클라이언트 컴포넌트는 `'use client'` 명시
- 환경변수는 `.env.local` 사용, 코드에 키 하드코딩 금지

## 환경변수 목록
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
```

## 하면 안 되는 것
- `/sample`, `/sample2` 파일 삭제 (레퍼런스용으로 유지)
- 기존 디자인·폰트·색상 변경
- `pages/` 디렉토리 방식으로 롤백
- 불필요한 패키지 추가 (현재 스택으로 해결 가능한 것은 추가 패키지 사용 금지)

## 작업 우선순위 원칙

Phase A~C 완료. 현재는 Phase D (첫 유료 고객 확보) 단계.

작업 요청이 올 때:
1. **수익 직결** — 유료 전환·이탈 방지에 영향 주는 것 최우선
2. **안정성** — 에러 대응, 데이터 정합성
3. **기능 추가** — 위 두 가지 완료 후 검토

## Supabase GRANT 대응 필요 (2026-10-30 기한)
Supabase가 2026-10-30부터 public schema 테이블에 명시적 GRANT를 요구함.
현재 모든 SQL 파일에 GRANT 구문 없음 — 기한 전 추가 필요.
대상 테이블: `profiles`, `subscriptions`, `link_clicks`, `referral_events`, `feedback_ratings`, `deleted_accounts`
```sql
grant select on public.{table} to anon;
grant select, insert, update, delete on public.{table} to authenticated;
grant select, insert, update, delete on public.{table} to service_role;
```
