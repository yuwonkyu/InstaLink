-- Critical 보안 수정: profiles 테이블 컬럼 단위 권한 잠금
--
-- 문제: add_appearance_customization.sql에서 authenticated에 INSERT/UPDATE를
-- 테이블 전체(컬럼 제한 없음)로 부여했음. RLS "Owner update own profiles"는
-- "본인 소유 행인지"만 확인하고 어떤 컬럼을 바꾸는지는 보지 않기 때문에,
-- 로그인 유저가 Supabase REST API를 Next.js 서버 액션 없이 직접 호출하면
-- 자기 프로필의 plan/billing_key/plan_expires_at/is_mvp를 마음대로 바꿔
-- 결제 없이 Pro로 셀프 승급할 수 있었음. 또한 saveProfile 등 서버 액션에만
-- 있는 URL/색상/슬러그 검증도 전부 우회 가능했음.
--
-- 조치: authenticated의 INSERT/UPDATE를 "컬럼 단위"로 재부여.
-- 돈(plan, plan_expires_at, billing_key)과 정체성(id, slug, owner_id,
-- referral_code, referred_by, is_mvp, created_at, view_count)에 해당하는
-- 컬럼은 authenticated 권한에서 제외 — service_role(서버 액션의 admin
-- client)만 변경 가능.
--
-- 주의: 이 마이그레이션을 적용하면 아래 기능들이 "유저 세션 클라이언트"로는
-- 더 이상 동작하지 않음 — 함께 배포된 코드 변경(admin client 경유)이
-- 반드시 같이 나가야 함:
--   - app/dashboard/onboarding/actions.ts (saveOnboardingStep1 — 첫 게시 트라이얼 지급)
--   - app/dashboard/actions.ts (publishQuickStart — 빠른 공개 트라이얼 지급)
--   - app/dashboard/edit/actions.ts (updateSlug — Pro 커스텀 슬러그)
--   - app/api/billing/cancel/route.ts (billing_key 해제 + 구독 취소)

-- ── 1. 기존 테이블 단위 INSERT/UPDATE 회수 ──────────────────────
REVOKE INSERT, UPDATE ON public.profiles FROM authenticated;

-- ── 2. INSERT는 회원가입 트리거(handle_new_user)가 만드는 컬럼만 허용 ──
-- ("트리거 실패 대비 수동 생성" RLS 정책의 fallback 경로 — plan 등은 기본값(free)으로만 생성되게 함)
GRANT INSERT (
  id, slug, owner_id, name, shop_name, tagline, services, reviews, is_active
) ON public.profiles TO authenticated;

-- ── 3. UPDATE는 "본인이 편집하는 콘텐츠/디자인" 컬럼만 허용 ──────
-- plan / plan_expires_at / billing_key / is_mvp / referral_code / referred_by /
-- slug / owner_id / id / created_at / view_count 는 제외 (service_role 전용)
GRANT UPDATE (
  name, shop_name, tagline, description,
  kakao_url, kakao_booking_url, kakao_channel_url, naver_booking_url, instagram_dm_url,
  instagram_id, location, hours, image_url, theme, phone_url, parking_info,
  services, reviews, custom_links, social_links, gallery,
  section_order, button_color, button_text_color, gallery_layout, business_hours,
  bg_color, card_color, text_color, accent_color, font_key,
  is_active, is_available
) ON public.profiles TO authenticated;

-- ── 4. 한 계정(owner_id)당 프로필 1개만 허용 ─────────────────────
-- owner_id에 unique 제약이 없어서, authenticated가 INSERT 권한을 가진 틈에
-- 같은 계정으로 프로필을 여러 개 만들어 가입 혜택(Pro 체험)·추천 보상을
-- 중복으로 받을 수 있었음.
--
-- 주의: 이미 중복 owner_id가 있으면 아래 ALTER가 실패함. 실패 시 먼저
-- 아래 쿼리로 중복을 찾아 정리한 뒤 다시 실행할 것:
--   SELECT owner_id, count(*) FROM public.profiles GROUP BY owner_id HAVING count(*) > 1;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_owner_id_unique UNIQUE (owner_id);
