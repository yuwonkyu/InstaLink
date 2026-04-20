-- InstaLink Week 11: 예약 링크 연동
-- 네이버 예약·카카오 예약 URL 컬럼 추가

alter table public.profiles
  add column if not exists naver_booking_url text,
  add column if not exists kakao_booking_url text;
