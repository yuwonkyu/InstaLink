-- Pro 풀 디자인 커스텀: 배경·카드·글자·포인트 색상 + 폰트 컬럼 추가
-- 공개 페이지는 이 값을 CSS 변수(--base/--secondary/--card/--foreground/--third/--font-*)로 주입한다.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bg_color     text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS card_color   text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS text_color   text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS accent_color text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS font_key     text DEFAULT NULL;

-- 2026-10-30 GRANT 기한 대응 — profiles 분 선반영 (CLAUDE.md 참조)
grant select on public.profiles to anon;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;
