-- Phase 2 Migration
-- Supabase Dashboard > SQL Editor 에서 실행하세요

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_available  boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS phone_url     text,
  ADD COLUMN IF NOT EXISTS instagram_dm_url text,
  ADD COLUMN IF NOT EXISTS kakao_channel_url text;
