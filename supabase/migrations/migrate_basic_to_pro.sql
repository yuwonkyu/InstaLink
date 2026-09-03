-- Basic 요금제 폐지 → Free/Pro 2단계 전환
-- 실행 위치: Supabase SQL Editor (배포 전/후 수동 실행 필요 — 코드 배포와 별개)
-- 배경: Pro 가격을 ₩7,900 → ₩3,000로 대폭 인하하면서 Basic 티어를 없앰.
--       기존 Basic 유료 가입자는 전원 Pro로 승격.

-- 1) 활성 구독(subscriptions)의 요금제·청구액을 Pro 신가격으로 갱신
--    → 다음 자동결제(billing/charge cron)부터 새 금액(월 3,000 / 연 30,000)으로 청구됨
update public.subscriptions
set
  plan = 'pro',
  amount = case when billing_period = 'annual' then 30000 else 3000 end
where plan = 'basic'
  and status = 'active';

-- 2) 모든 profiles.plan = 'basic' → 'pro' 전환 (구독 유무 무관)
update public.profiles
set plan = 'pro'
where plan = 'basic';

-- 3) 검증 — 둘 다 0이어야 정상 종료
select count(*) as remaining_basic_profiles      from public.profiles     where plan = 'basic';
select count(*) as remaining_basic_subscriptions from public.subscriptions where plan = 'basic' and status = 'active';
