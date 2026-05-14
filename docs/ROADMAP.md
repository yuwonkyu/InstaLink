# InstaLink SaaS 실행 로드맵 v2
> 최종 업데이트: 2026-05-14  
> 분석 근거: `docs/PRODUCT_ANALYSIS.md` 참조  
> 목표: 12개월 내 월 30~80만 원 recurring revenue

---

## 현재 상태 (2026-05-14 기준) — Phase A~C 완료

### 완료된 것
- [x] `/[slug]` 동적 공개 페이지 + Supabase 연동
- [x] Supabase Auth 회원가입·로그인·온보딩 (3필드 단순화)
- [x] 대시보드 편집 (탭 4개: 내 페이지·서비스·메뉴·사진·후기·설정) + 미리보기 패널
- [x] 토스페이먼츠 구독 결제 (Free/Basic/Pro) + 자동 재시도 cron
- [x] 관리자 대시보드, 링크 클릭 추적, 7일 방문자 차트
- [x] AI 소개글 추천, QR코드, 레퍼럴, 주간 리포트 이메일
- [x] SEO: 업종별 카테고리 페이지 7개, JSON-LD, sitemap, GA4
- [x] Free 플랜 갤러리 3장, 바이럴 배지, CTA 위계 개선
- [x] 에러 바운더리 (`app/error.tsx`, `app/dashboard/error.tsx`, `app/[slug]/error.tsx`)
- [x] 로그인 없이 데모 체험 (`app/demo/`)

### 남은 기술 부채
- [ ] Supabase GRANT 추가 (기한: 2026-10-30) — 6개 테이블 대상, CLAUDE.md 참조
- [ ] 서버사이드 입력 검증 강화 (현재 클라이언트단만) — Phase C-2 미완

---

## Phase A — 전환율 수술 ✅ 완료

- [x] A-1. Free 플랜 갤러리 3장 허용 (`lib/plan-limits.ts`)
- [x] A-2. 공개 페이지 바이럴 배지 (`components/ProfilePage.tsx:867`)
- [x] A-3. CTA 위계 개선 — 메인 full-width + 보조 소형 버튼 (`components/ProfilePage.tsx:340`)
- [x] A-4. 온보딩 3필드 단순화 (`app/dashboard/onboarding/`)

---

## Phase B — 리텐션 강화 ✅ 완료

- [x] B-1. 7일 링크 클릭 차트 (`app/dashboard/page.tsx`)
- [x] B-2. 대시보드 탭 4개로 재구성 — 내 페이지·서비스·메뉴·사진·후기·설정 (`app/dashboard/edit/EditForm.tsx`)
- [x] B-3. 편집 미리보기 패널 (`app/dashboard/edit/page.tsx` — 데스크탑 iframe)
- [x] B-4. 로그인 없이 데모 체험 (`app/demo/page.tsx`)

---

## Phase C — 안정성 ✅ 완료 (일부 미완)

- [x] C-1. 에러 바운더리 (`app/error.tsx`, `app/dashboard/error.tsx`, `app/[slug]/error.tsx`)
- [x] C-3. 결제 실패 자동 재시도 (`vercel.json` cron: billing/retry, billing/retry-final, billing/downgrade)
- [ ] C-2. 서버사이드 입력 검증 — 현재 클라이언트단(EditForm)만 있음, API route 검증 미완

---

## Phase D — 성장 (2~4개월)

> 목표: 첫 20명 유료 고객 확보.

### D-1. PT 트레이너 커뮤니티 공략 (마케팅, 코드 아님)
- 트레이너 오픈채팅방 5~10개에 직접 소개 (무료 세팅 제안)
- 인스타 트레이너 DM 20~30개: "무료로 링크페이지 만들어드립니다"
- 첫 5명 → 무료 Pro 제공 → 후기·스크린샷 수집

### D-2. 제휴 프로그램 코드 발급
```
파일: app/api/referral/ (기존 referral 코드 기반 확장)
추가: 파트너 전용 코드 → 첫 달 50% 할인
대상: 인스타 마케팅 강사, 소상공인 컨설턴트
```

### D-3. 연간 결제 배너
```
파일: app/billing/page.tsx
추가: 연간 결제 옵션 (월간 × 10개월 가격 = 2개월 무료)
위치: 플랜 카드 상단 토글 "월간 / 연간"
```

### D-4. 업종별 랜딩 SEO 강화
```
파일: app/for/[category]/page.tsx (기존 7개 카테고리)
추가:
  - 실제 고객 후기 섹션 (첫 5명 후기 삽입)
  - "지금 무료로 만들기" CTA 강화
  - 업종별 예시 스크린샷
```

---

## Phase E — 수확 (4~12개월)

### E-1. 커스텀 도메인 연결 (Pro)
- Vercel Domains API 활용
- 소상공인이 myshop.com → 인스타링크 페이지로 연결

### E-2. 예약 링크 네이티브 연동
- 네이버 예약, 카카오 예약 딥링크 버튼 추가

### E-3. 월별 자동 SEO 리포트 이메일
- 내 페이지 구글 검색 노출·클릭 요약 (Search Console API)

---

## 목표 수익 시뮬레이션

```
3개월: 첫 유료 고객 5명
  Basic 3 × 29,000 + Pro 2 × 49,000 = 185,000원/월

6개월: 유료 고객 15명
  Basic 10 × 29,000 + Pro 5 × 49,000 = 535,000원/월

12개월: 유료 고객 30명
  Basic 18 × 29,000 + Pro 12 × 49,000 = 1,110,000원/월
```

---

## 작업 실행 원칙 (Claude 참조용)

1. 각 작업은 PR 단위로 독립 완결 (믹스 금지)
2. 기존 CSS 클래스·디자인 변경 금지 — 기능 로직만 수정
3. 새 패키지 추가 전 기존 스택으로 해결 가능한지 확인 필수
4. `lib/plan-limits.ts` 변경 시 반드시 Free·Basic·Pro 세 플랜 전부 테스트
5. 공개 페이지(`/[slug]`) 변경 시 로그인 없이 접근해서 렌더링 확인

---

## 빠른 참조 — 파일 위치

| 작업 | 주요 파일 |
|------|----------|
| 플랜 제한 수정 | `lib/plan-limits.ts` |
| 공개 페이지 UI | `components/ProfilePage.tsx` |
| 대시보드 편집 탭 | `app/dashboard/edit/EditForm.tsx`, `components/edit/tabs/` |
| 편집 레이아웃·미리보기 | `app/dashboard/edit/page.tsx` |
| 온보딩 | `app/dashboard/onboarding/page.tsx` |
| 방문자 통계 | `app/dashboard/page.tsx`, `app/dashboard/stats/page.tsx` |
| 결제 | `app/billing/`, `app/api/billing/` |
| Vercel cron 스케줄 | `vercel.json` |
| 에러 바운더리 | `app/error.tsx`, `app/dashboard/error.tsx`, `app/[slug]/error.tsx` |
| 데모 체험 | `app/demo/page.tsx` |
