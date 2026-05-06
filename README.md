# InstaLink

> 소상공인을 위한 인스타그램 프로필 링크 페이지 SaaS  
> PT 트레이너 · 필라테스 강사 · 헤어 디자이너 · 카페 사장님이  
> **링크 하나**로 서비스 소개 + 가격 + 후기 + 카카오 상담까지 연결합니다.

🔗 **서비스 주소**: [instalink.kr](https://instalink.kr)  
📌 **예시 페이지**: `/sample` · `/sample2` · `/sample3`  
🎮 **로그인 없는 데모**: `/demo`

---

## 서비스 소개 (SaaS)

| 플랜  | 가격        | 주요 기능 |
| ----- | ----------- | --------- |
| Free  | 무료        | 기본 프로필, 서비스 3개, 후기 3개, **갤러리 3장** |
| Basic | 29,000원/월 | 테마 7종, 무제한 서비스·후기, 방문자 통계, 갤러리 6장 |
| Pro   | 49,000원/월 | Basic 전체 + AI 문구 추천, 갤러리 15장, 바이럴 배지 숨김, 우선 지원 |

**지원 업종**: PT/헬스 · 필라테스/요가 · 미용실/네일 · 카페 · 프리랜서/크리에이터  
**지원 테마**: light · dark · ucc · softsage · warmlinen · energysteel

---

## 기술 스택

| 영역      | 기술 |
| --------- | ---- |
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling   | Tailwind CSS v4 (CSS variable 기반) |
| DB / Auth | Supabase (PostgreSQL + Row-Level Security) |
| 이미지    | Cloudinary (next/image 연동) |
| 결제      | 토스페이먼츠 (빌링키 방식) |
| 배포      | Vercel + Cron Jobs |

---

## 주요 페이지 / 기능

| URL | 설명 |
|-----|------|
| `/` | 랜딩 페이지 |
| `/demo` | 로그인 없이 내 페이지 미리 만들어보기 |
| `/[slug]` | 공개 프로필 페이지 (동적 라우팅) |
| `/dashboard` | 사장님 대시보드 (방문자 통계, 링크 클릭 차트) |
| `/dashboard/edit` | 프로필 편집 (실시간 미리보기 패널 포함) |
| `/dashboard/onboarding` | 신규 가입 후 3분 완성 온보딩 |
| `/auth/login`, `/auth/signup` | 카카오·구글 소셜 로그인 |
| `/billing` | 구독 플랜 변경 |
| `/admin` | 관리자 대시보드 |
| `/for/[category]` | 업종별 SEO 랜딩 (7개 카테고리) |

---

## 결제 재시도 스케줄 (Vercel Cron)

| 실행일 | Endpoint | 역할 |
|--------|----------|------|
| 매월 1일 | `/api/billing/charge` | 정기 결제 청구 |
| 매월 4일 | `/api/billing/retry` | 1차 재시도 |
| 매월 8일 | `/api/billing/retry-final` | 2차 재시도 |
| 매월 15일 | `/api/billing/downgrade` | 14일 미납 → free 자동 강등 |

---

## 디렉토리 구조

```
app/
  page.tsx                   ← 랜딩 페이지
  demo/page.tsx              ← 로그인 없는 데모 체험
  [slug]/
    page.tsx                 ← 공개 프로필 (동적 라우팅)
    error.tsx                ← 에러 바운더리
  dashboard/
    page.tsx                 ← 통계 + 7일 클릭 차트
    error.tsx                ← 에러 바운더리
    edit/
      page.tsx               ← 편집 레이아웃 (2컬럼: 폼 | 미리보기)
      EditForm.tsx           ← 탭 4개 편집 폼
      actions.ts             ← Server Actions (saveProfile, updateSlug)
    onboarding/page.tsx      ← 3분 온보딩
  api/
    billing/                 ← charge / retry / retry-final / downgrade
    track/                   ← 클릭·방문 추적
  error.tsx                  ← 전역 에러 바운더리

components/
  ProfilePage.tsx            ← 공개 프로필 렌더링 (CTA 위계, 바이럴 배지)
  dashboard/
    PreviewPanel.tsx         ← 실시간 iframe 미리보기
    ThemeSelector.tsx
    ServiceManager.tsx
    ReviewManager.tsx

lib/
  types.ts                   ← 핵심 타입 (Profile, Service, Review, Theme …)
  plan-limits.ts             ← 플랜별 제한 단일 소스
  plan-features.ts           ← 플랜 비교표 데이터
  supabase.ts                ← Supabase 클라이언트

supabase/                    ← SQL 마이그레이션 (week1~week13)
.github/
  copilot-instructions.md    ← Copilot 커스텀 지침
docs/
  PRODUCT_ANALYSIS.md        ← UX/마케팅 분석 (Claude 참조용)
  ROADMAP.md                 ← 실행 로드맵 (Phase A~E)
```

---

## 로컬 개발 시작

### 1. 환경변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=instalink_unsigned
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=your-cron-secret
TOSSPAYMENTS_SECRET_KEY=test_sk_...
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
```

### 2. 패키지 설치 및 실행

```bash
npm install
npm run dev
```

### 3. 샘플 / 데모 확인

```
http://localhost:3000/demo      # 로그인 없는 체험 데모
http://localhost:3000/sample    # 라이트 테마 — 여성 PT 트레이너
http://localhost:3000/sample2   # 다크 테마  — 필라테스 강사
http://localhost:3000/sample3   # 웜리넨 테마 — 헤어 디자이너
```

---

## 에러 바운더리

DB 오류·인증 오류 발생 시 흰 화면 대신 사용자 친화적 에러 UI가 표시됩니다.

- `app/error.tsx` — 전역
- `app/dashboard/error.tsx` — 대시보드
- `app/[slug]/error.tsx` — 공개 프로필

새 route segment 추가 시 `error.tsx`도 함께 생성하세요.

---

## 테마 가이드

| ID            | 이름         | 어울리는 업종 |
| ------------- | ------------ | ------------- |
| `light`       | 라이트       | 범용 |
| `dark`        | 다크         | 피트니스, 크리에이터 |
| `ucc`         | UCC          | 강렬한 브랜딩 |
| `softsage`    | 소프트세이지 | 필라테스, 웰니스 |
| `warmlinen`   | 웜리넨       | 헤어, 네일, 고급 뷰티 |
| `energysteel` | 에너지스틸   | PT, 스포츠 |

### 새 테마 추가 방법

1. `app/themes.css` 에 CSS 변수 블록 추가
2. `lib/types.ts` 의 `Theme` 유니온에 추가
3. `components/dashboard/ThemeSelector.tsx` 의 `THEMES` 배열에 추가

---

## AI 협업 지침

이 프로젝트는 Claude Code와 GitHub Copilot을 함께 사용합니다.

- **Claude Code** (`CLAUDE.md`): 아키텍처 결정, 대규모 기능 구현, Phase 작업
- **Copilot** (`.github/copilot-instructions.md`): 코드 자동완성, 인라인 수정, 빠른 픽스

두 AI 모두 동일한 규칙(`any` 금지, 디자인 변경 금지, 플랜 제한 단일 소스 등)을 공유합니다.

---

## 저작권

본 저장소의 모든 소스코드, 디자인, 문구의 저작권은 프로젝트 소유자에게 있습니다.  
무단 복제·배포·상업적 이용을 금지합니다.

All rights reserved. Unauthorized use is strictly prohibited.
