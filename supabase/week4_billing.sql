-- InstaLink Week 4: 결제 관련 컬럼 + 테이블
-- week1 ~ week3 SQL 실행 후 실행하세요.

-- ─────────────────────────────────────────────
-- 1. profiles 테이블에 billing 컬럼 추가
-- ─────────────────────────────────────────────
alter table public.profiles
  add column if not exists plan text not null default 'free',
  add column if not exists plan_expires_at timestamptz,
  add column if not exists billing_key text;

-- ─────────────────────────────────────────────
-- 2. subscriptions 테이블 생성 (결제 이력)
-- ─────────────────────────────────────────────
create table if not exists public.subscriptions (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references public.profiles(id) on delete cascade,
  plan            text not null,
  amount          int  not null,
  status          text not null default 'active', -- 'active' | 'cancelled' | 'failed'
  toss_order_id   text,                           -- 토스 주문 ID
  started_at      timestamptz not null default now(),
  next_billing_at timestamptz,
  cancelled_at    timestamptz
);

create index if not exists subscriptions_profile_id_idx on public.subscriptions (profile_id);
create index if not exists subscriptions_status_idx     on public.subscriptions (status);

alter table public.subscriptions enable row level security;

-- 본인 구독 조회
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'subscriptions'
    and policyname = 'Owner read own subscriptions'
  ) then
    create policy "Owner read own subscriptions"
    on public.subscriptions
    for select
    to authenticated
    using (
      profile_id in (
        select id from public.profiles where owner_id = (select auth.uid())
      )
    );
  end if;
end $$;

-- 서버(service_role)에서만 insert/update 허용 — 클라이언트 직접 접근 차단
-- (API Route는 service_role key 또는 RLS bypass로 처리)
