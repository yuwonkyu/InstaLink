# InstaLink SaaS 실행 로드맵 v2
> 최종 업데이트: 2026-05-06  
> 분석 근거: `docs/PRODUCT_ANALYSIS.md` 참조  
> 목표: 12개월 내 월 30~80만 원 recurring revenue

---

## 현재 상태 (2026-05-06 기준)

### 완료된 것 (코드 존재)
- [x] Week 1: `/[slug]` 동적 공개 페이지 + Supabase 연동
- [x] Week 2: Supabase Auth 회원가입·로그인·온보딩
- [x] Week 3: 대시보드 편집 (5탭), 갤러리·서비스·후기 관리
- [x] Week 4: 토스페이먼츠 구독 결제 (Free/Basic/Pro)
- [x] Week 5: 관리자 대시보드, 링크 클릭 추적, 방문자 통계 기본
- [x] Week 6: AI 소개글 추천, QR코드, 레퍼럴, 주간 리포트 이메일
- [x] SEO: 업종별 카테고리 페이지 7개, JSON-LD, sitemap, GA4

### 미완성 (코드 있지만 구멍)
- [ ] 일별 방문자 차트 (`app/dashboard/page.tsx:269` 플레이스홀더)
- [ ] 에러 바운더리 (`error.tsx`) 대부분 라우트에 없음
- [ ] 서버사이드 입력 검증 (카카오 URL, 인스타 ID)
- [ ] 결제 실패 자동 재시도 스케줄

---

## Phase A — 전환율 수술 (지금 당장, 1~2주)

> 목표: 가입→활성(첫 페이지 공유) 전환율 개선. 기능 추가 금지.

### A-1. 무료 플랜 갤러리 3장 허용 🔴 최우선
```
파일: lib/plan-limits.ts
변경: Free 플랜 gallery 0 → 3
```
- 소상공인이 포트폴리오 사진 없는 페이지를 쓸 이유가 없음
- 예상 효과: 가입→활성 전환율 +20~30%

### A-2. 공개 페이지 바이럴 배지 추가 🔴 최우선
```
파일: components/ProfilePage.tsx (푸터 영역)
추가: "⚡ 인스타링크로 무료 만들기" 배지 → instalink.kr 링크
조건: plan !== 'pro' 일 때만 표시 (Pro는 배지 숨기기 가능)
```
- Linktree 성장 엔진과 동일한 바이럴 루프
- 배지 클릭 → 랜딩 → 가입 전환

### A-3. 공개 페이지 CTA 위계 개선 🟡
```
파일: components/ProfilePage.tsx CTA 버튼 섹션
변경:
  - 메인 CTA(카카오 문의): full-width 큰 버튼, 최상단
  - 보조 CTA(인스타, 전화, 네이버): 소형 아이콘 버튼 행
```
- 방문자가 "무엇을 눌러야 하는가" 즉시 인지

### A-4. 온보딩 3필드 단순화 🟡
```
파일: app/dashboard/onboarding/page.tsx
변경:
  Step 1 (유일한 스텝): 슬러그 + 이름 + 카카오 URL → 즉시 페이지 생성
  Step 2 이후는 대시보드 편집으로 이동
목표: 가입 후 3분 안에 공유 가능한 링크 완성
```

---

## Phase B — 리텐션 강화 (2~4주)

> 목표: 무료→유료 전환, 유료 이탈 방지.

### B-1. 일별 방문자 차트 구현 🔴
```
파일: app/dashboard/page.tsx (269번 줄 플레이스홀더 교체)
DB: page_views 테이블 날짜별 GROUP BY
UI: 14일 라인 차트 (lightweight-charts 또는 Recharts, 기존 스택 확인 후 선택)
조건: Free 14일, Basic/Pro 무제한
```
- Pro 결제를 유지할 핵심 이유
- "내 페이지 방문자가 오늘 몇 명" → 체감 가치 극대화

### B-2. 대시보드 탭 4개로 재구성 🟡
```
파일: components/EditForm.tsx, app/dashboard/edit/page.tsx
변경:
  현재: 기본 | 디자인 | 서비스 | 콘텐츠 | 고급
  목표: 내 페이지 | 서비스·메뉴 | 사진·후기 | 설정
  - "내 페이지" = 기존 기본+디자인 합침
  - "설정" = 기존 고급+슬러그+계정
```
- 소상공인 멘탈 모델에 맞는 구조

### B-3. 편집 미리보기 패널 추가 🟡
```
파일: app/dashboard/edit/page.tsx
데스크탑: 우측 1/2에 iframe으로 /[slug] 미리보기 (저장 시 새로고침)
모바일: 상단 "미리보기" 버튼 → 모달 팝업
```
- 편집 → 저장 → 새 탭 확인 루프 제거

### B-4. 로그인 없이 데모 체험 🟡
```
신규 파일: app/demo/page.tsx
기능: 이름·업종·카카오URL 입력 → 즉시 임시 프로필 미리보기
     하단 "저장하려면 가입하기" CTA
세션: localStorage에 임시 저장, 가입 시 DB로 이전
```
- 가입 전 가치 경험 → 전환율 2~3배

---

## Phase C — 안정성 (4~6주, B와 병행)

### C-1. 에러 바운더리 추가
```
신규 파일: app/error.tsx, app/dashboard/error.tsx, app/[slug]/error.tsx
내용: DB 오류·인증 오류 시 사용자 친화적 메시지 + 재시도 버튼
```

### C-2. 서버사이드 입력 검증
```
파일: app/api/profile/ 관련 route.ts 들
추가:
  - kakao_url: open.kakao.com 도메인만 허용
  - instagram_id: @ 없는 알파벳·숫자·_ 형식만
  - slug: 영문 소문자·숫자·하이픈만, 예약어 차단 (admin, api, dashboard 등)
```

### C-3. 결제 실패 자동 재시도
```
파일: vercel.json (cron 추가), app/api/billing/retry/route.ts
스케줄:
  - 결제 실패 후 3일: 재시도 1회
  - 실패 후 7일: 재시도 1회 + 이메일 경고
  - 실패 후 14일: plan → free 다운그레이드 + 이메일
```

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

1. **Phase A가 완전히 끝나기 전에 Phase B 시작 금지**
2. 각 작업은 PR 단위로 독립 완결 (믹스 금지)
3. 기존 CSS 클래스·디자인 변경 금지 — 기능 로직만 수정
4. 새 패키지 추가 전 기존 스택으로 해결 가능한지 확인 필수
5. `lib/plan-limits.ts` 변경 시 반드시 Free·Basic·Pro 세 플랜 전부 테스트
6. 공개 페이지(`/[slug]`) 변경 시 로그인 없이 접근해서 렌더링 확인

---

## 빠른 참조 — 파일 위치

| 작업 | 주요 파일 |
|------|----------|
| 플랜 제한 수정 | `lib/plan-limits.ts` |
| 공개 페이지 UI | `components/ProfilePage.tsx` |
| 대시보드 편집 | `components/EditForm.tsx`, `app/dashboard/edit/page.tsx` |
| 온보딩 | `app/dashboard/onboarding/page.tsx` |
| 방문자 통계 | `app/dashboard/page.tsx`, `app/dashboard/stats/page.tsx` |
| 결제 | `app/billing/`, `app/api/billing/` |
| 입력 검증 | `app/api/profile/` 하위 route.ts |
| 에러 바운더리 | 각 route 폴더의 `error.tsx` |
