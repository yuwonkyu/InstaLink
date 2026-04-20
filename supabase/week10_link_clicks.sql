-- InstaLink Week 10: 링크 클릭 트래킹
-- 카카오·인스타그램 등 CTA 버튼 클릭 이벤트를 기록한다.

create table if not exists public.link_clicks (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  link_type   text not null,  -- 'kakao' | 'instagram'
  clicked_at  timestamptz not null default now()
);

create index if not exists link_clicks_profile_id_idx on public.link_clicks(profile_id);
create index if not exists link_clicks_clicked_at_idx on public.link_clicks(clicked_at);

-- RLS
alter table public.link_clicks enable row level security;

-- 누구나(anon 포함) 클릭 삽입 가능
create policy "anyone can insert click" on public.link_clicks
  for insert to anon, authenticated
  with check (true);

-- 페이지 소유자만 본인 통계 조회 가능
create policy "owner can view clicks" on public.link_clicks
  for select using (
    profile_id in (
      select id from public.profiles where owner_id = auth.uid()
    )
  );
