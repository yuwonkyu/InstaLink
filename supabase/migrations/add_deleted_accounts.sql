-- 탈퇴 통계 테이블
-- 개인정보(이름·이메일·slug·owner_id)는 저장하지 않음
-- 탈퇴 추이 및 이탈 패턴 분석용

CREATE TABLE IF NOT EXISTS deleted_accounts (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  deleted_at   timestamptz DEFAULT now() NOT NULL,
  plan         text        NOT NULL DEFAULT 'free',   -- 탈퇴 시 플랜
  days_active  integer     NOT NULL DEFAULT 0,        -- 가입 후 탈퇴까지 일수
  had_paid     boolean     NOT NULL DEFAULT false,    -- 유료 플랜 경험 여부
  had_reviews  boolean     NOT NULL DEFAULT false,    -- 후기 1개 이상 등록 여부
  view_count   integer     NOT NULL DEFAULT 0         -- 탈퇴 시점 누적 조회수
);

-- 관리자 서비스 롤만 INSERT 가능
ALTER TABLE deleted_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON deleted_accounts
  FOR ALL USING (false);  -- 일반 유저 접근 차단, service role은 RLS 우회
