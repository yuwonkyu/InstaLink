-- 기존 kakao_url, kakao_booking_url 등을 custom_links JSONB로 마이그레이션
-- Supabase SQL Editor에서 실행하세요.

UPDATE profiles
SET custom_links = (
  COALESCE(custom_links, '[]'::jsonb)
  || CASE WHEN kakao_url IS NOT NULL AND kakao_url != ''
       THEN jsonb_build_array(jsonb_build_object('title','카카오 오픈채팅','url',kakao_url,'style','text'))
       ELSE '[]'::jsonb END
  || CASE WHEN kakao_booking_url IS NOT NULL AND kakao_booking_url != ''
       THEN jsonb_build_array(jsonb_build_object('title','카카오 예약','url',kakao_booking_url,'style','text'))
       ELSE '[]'::jsonb END
  || CASE WHEN kakao_channel_url IS NOT NULL AND kakao_channel_url != ''
       THEN jsonb_build_array(jsonb_build_object('title','카카오채널 문의','url',kakao_channel_url,'style','text'))
       ELSE '[]'::jsonb END
  || CASE WHEN naver_booking_url IS NOT NULL AND naver_booking_url != ''
       THEN jsonb_build_array(jsonb_build_object('title','네이버 예약','url',naver_booking_url,'style','text'))
       ELSE '[]'::jsonb END
  || CASE WHEN instagram_dm_url IS NOT NULL AND instagram_dm_url != ''
       THEN jsonb_build_array(jsonb_build_object('title','인스타그램 DM','url',instagram_dm_url,'style','text'))
       ELSE '[]'::jsonb END
)
WHERE
  (kakao_url          IS NOT NULL AND kakao_url          != '') OR
  (kakao_booking_url  IS NOT NULL AND kakao_booking_url  != '') OR
  (kakao_channel_url  IS NOT NULL AND kakao_channel_url  != '') OR
  (naver_booking_url  IS NOT NULL AND naver_booking_url  != '') OR
  (instagram_dm_url   IS NOT NULL AND instagram_dm_url   != '');
