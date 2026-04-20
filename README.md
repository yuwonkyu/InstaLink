# InstaLink

1인 사업자·프리랜서를 위한 링크 페이지 SaaS입니다.  
PT 트레이너, 필라테스 강사, 미용실, 프리랜서 등 누구든 링크 하나로 자신을 소개하고 고객 상담까지 연결할 수 있습니다.

공개 프로필은 `/{slug}` 동적 라우팅으로 제공되며, 사장님이 대시보드에서 직접 편집하면 즉시 반영됩니다.

## 주요 기능

- **공개 프로필 페이지** (`/{slug}`) — Supabase DB 기반 동적 라우팅
- **서비스·가격 안내** — 서비스 목록 CRUD
- **카카오톡 상담 연결** CTA
- **인스타그램 링크** 연결
- **모바일 우선** 반응형 UI
- **활성/비활성 상태** 분기 (`is_active=false` 시 준비중 화면)
- **6가지 테마** 선택 (대시보드에서 즉시 변경)
- **회원가입·로그인** (Supabase Auth 이메일 방식)
- **프로필 편집 대시보드** (`/dashboard/edit`) — 기본정보·서비스·후기·이미지·테마
- **구독 결제** (토스페이먼츠 빌링키, Free / Basic / Pro 플랜)
- **Vercel Cron 자동결제** — 매월 1일 자동 청구
- **관리자 대시보드** (`/admin`) — 전체 고객 목록·플랜 변경·매출 요약
- **방문자 통계** — 공개 페이지 조회수 (`view_count`)
- **링크 클릭 트래킹** — 카카오·인스타 버튼 클릭 이벤트 기록
- **AI 콘텐츠 추천** — Claude API로 태그라인·소개글·서비스 목록 자동 생성
- **OG 이미지 자동 생성** — 프로필별 1200×630 썸네일 (`/[slug]/opengraph-image`)
- **만족도 이메일** — 가입 30일 후 자동 발송 (Resend + Vercel Cron)
- **레퍼럴 프로그램** — 추천 코드 공유 시 추천인 1개월 무료 혜택
- **업종별 랜딩페이지** (`/for/[category]`) — SEO 최적화 카테고리 페이지

## 기술 스택

| 영역      | 기술                            |
| --------- | ------------------------------- |
| Framework | Next.js App Router (TypeScript) |
| DB + Auth | Supabase                        |
| 이메일    | Resend                          |
| AI        | Anthropic Claude API            |
| 이미지    | Cloudinary                      |
| 결제      | 토스페이먼츠 (빌링키 방식)      |
| 스타일    | Tailwind CSS v4                 |
| 배포      | Vercel                          |

## 구현 이력

| 주차    | 내용                                                                   |
| ------- | ---------------------------------------------------------------------- |
| Week 1  | 동적 공개 페이지 (`/[slug]`), Supabase 스키마·RLS·시드 SQL             |
| Week 2  | Supabase Auth 회원가입·로그인·미들웨어 보호                            |
| Week 3  | 프로필 편집 대시보드 (`/dashboard/edit`), 테마 선택, Cloudinary 업로드 |
| Week 4  | 토스페이먼츠 구독 결제, Free/Basic/Pro 플랜, Vercel Cron 자동결제      |
| Week 5  | 관리자 대시보드 (`/admin`), 플랜 수동 변경, 매출 요약                  |
| Week 6  | 방문자 조회수 통계 (`view_count`)                                      |
| Week 7  | AI 콘텐츠 추천 (Claude), OG 이미지 자동생성, 30일 만족도 이메일        |
| Week 10 | 링크 클릭 트래킹 (`link_clicks` 테이블)                                |
| Week 12 | 연간 결제 플랜, 레퍼럴 프로그램 (추천 코드·보상)                       |
| Week 13 | 만족도 피드백 저장, 구독 갱신 알림 준비                                |

## 테마

### 지원 테마

| 테마          | 설명                                 |
| ------------- | ------------------------------------ |
| `light`       | 기본 라이트 테마                     |
| `dark`        | 다크 테마                            |
| `ucc`         | 강한 명도·대비의 트렌디 테마         |
| `softsage`    | 필라테스/웰니스용 차분한 세이지 테마 |
| `warmlinen`   | 고급 브랜딩 느낌의 따뜻한 리넨 테마  |
| `energysteel` | PT/피트니스용 고대비 스틸 테마       |

### 새 테마 추가 방법

1. `app/themes.css` 에 `.theme-테마명` 블록 추가
2. `lib/types.ts` 의 `Theme` 유니온 타입에 테마명 추가
3. `app/[slug]/page.tsx` 의 `themeClass` 분기에 클래스 매핑 추가

## 디렉토리 구조

```
app/
  [slug]/          ← 고객 공개 페이지
  dashboard/       ← 사장님 편집 대시보드
    edit/          ← 프로필 편집 폼
  admin/           ← 관리자 전용
  auth/            ← 회원가입·로그인·콜백
  billing/         ← 구독 결제 (토스페이먼츠)
  for/[category]/  ← 업종별 SEO 랜딩페이지
  feedback/        ← 만족도 피드백
  api/
    ai/suggest/    ← AI 콘텐츠 추천
    billing/       ← 자동결제·취소·갱신 알림
    referral/      ← 레퍼럴 코드 적용
    satisfaction/  ← 만족도 이메일 Cron
    track/click/   ← 링크 클릭 트래킹
components/
  ProfilePage.tsx  ← 공개 페이지 렌더링 컴포넌트
lib/
  supabase.ts      ← Supabase 클라이언트
  types.ts         ← 공통 타입 정의
  resend.ts        ← 이메일 클라이언트
supabase/          ← 주차별 DB 마이그레이션 SQL
```

## 환경변수

`.env.local`에 아래 값을 설정하세요.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY=
TOSSPAYMENTS_SECRET_KEY=

CRON_SECRET=

ANTHROPIC_API_KEY=

RESEND_API_KEY=
```

## Vercel Cron 스케줄

| 엔드포인트            | 주기                | 역할               |
| --------------------- | ------------------- | ------------------ |
| `/api/billing/charge` | 매월 1일 02:00 UTC  | 구독 자동결제      |
| `/api/billing/retry`  | 매일 03:00 UTC      | 결제 실패 재시도   |
| `/api/billing/remind` | 매월 25일 09:00 UTC | 갱신 예정 알림     |
| `/api/satisfaction`   | 매일 09:00 UTC      | 30일 만족도 이메일 |

## 저작권 및 사용 제한

본 저장소의 모든 소스코드, 디자인, 문구, 이미지 및 기타 산출물의 저작권은 프로젝트 소유자에게 있습니다.  
무단 복제·배포·수정·재사용 및 상업적 이용을 금지합니다.

All rights reserved. Unauthorized use is strictly prohibited.

## 개발 실행

```bash
npm install
npm run dev
```

공개 프로필 확인 예시:

```
http://localhost:3000/sample
```
