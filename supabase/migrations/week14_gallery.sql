-- Week 14: 이미지 갤러리 + 주차 정보
-- profiles 테이블에 gallery, parking_info 컬럼 추가

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS gallery     jsonb    DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS parking_info text    DEFAULT NULL;

COMMENT ON COLUMN profiles.gallery      IS '갤러리 이미지 배열 [{url, caption}]';
COMMENT ON COLUMN profiles.parking_info IS '주차 안내 (예: 건물 내 무료 주차 2시간)';
