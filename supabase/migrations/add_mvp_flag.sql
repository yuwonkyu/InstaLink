-- MVP 얼리어답터 플래그
-- 기존 가입자 전원 Pro 승격 + MVP 표시
-- 실행일: 2026-06-02

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_mvp boolean NOT NULL DEFAULT false;

UPDATE profiles
SET
  is_mvp        = true,
  plan          = 'pro',
  plan_expires_at = NULL
WHERE is_mvp = false;
