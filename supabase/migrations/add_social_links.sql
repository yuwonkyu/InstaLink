-- 소셜 채널 링크 (유튜브·틱톡·네이버블로그·스레드·페이스북·X 등)
-- 공개 페이지 하단 아이콘 줄로 표시됨.
-- 형식: [{ "platform": "youtube", "url": "https://youtube.com/@..." }, ...]
--
-- ⚠️ 배포 순서: 이 마이그레이션을 먼저 실행한 뒤 애플리케이션 코드를 배포해야 한다.
--    (컬럼이 없는 상태로 코드가 배포되면 프로필 저장이 실패함)

alter table public.profiles
  add column if not exists social_links jsonb not null default '[]'::jsonb;
