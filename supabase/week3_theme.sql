-- InstaLink Week 3: theme 컬럼 추가
-- week1_profiles.sql + week2_auth.sql 실행 후 실행하세요.

alter table public.profiles
  add column if not exists theme text not null default 'light';
