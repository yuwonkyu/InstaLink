-- Pro/Basic 기능 컬럼 추가
-- Supabase SQL Editor에서 실행하세요.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS button_color      TEXT,
  ADD COLUMN IF NOT EXISTS button_text_color TEXT,
  ADD COLUMN IF NOT EXISTS section_order     JSONB,
  ADD COLUMN IF NOT EXISTS gallery_layout    TEXT DEFAULT 'grid3',
  ADD COLUMN IF NOT EXISTS parking_info      TEXT,
  ADD COLUMN IF NOT EXISTS business_hours    JSONB;
