-- 가입 차단 목록 (어뷰징/악성 계정 재가입 방지)
-- type: email(정확한 이메일) | domain(이메일 @ 뒤 도메인 전체) | pattern(이메일 아이디 부분 문자열 포함)
-- 운영자가 이 테이블에 행을 추가/삭제하는 것만으로 차단 대상을 관리 (코드 배포 불필요)

CREATE TABLE IF NOT EXISTS signup_blocklist (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  type       text        NOT NULL CHECK (type IN ('email', 'domain', 'pattern')),
  value      text        NOT NULL,
  reason     text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (type, value)
);

-- (재실행 대비) 테이블이 UNIQUE 제약 없이 이미 존재했을 수 있어 별도로 추가
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'signup_blocklist_type_value_key'
  ) THEN
    ALTER TABLE signup_blocklist ADD CONSTRAINT signup_blocklist_type_value_key UNIQUE (type, value);
  END IF;
END $$;

-- service role(서버 액션)만 접근 — 일반 유저/anon 직접 접근 차단
ALTER TABLE signup_blocklist ENABLE ROW LEVEL SECURITY;

-- (재실행 대비) 정책이 이미 있으면 건너뜀
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'signup_blocklist'
    AND policyname = 'service_role_only'
  ) THEN
    CREATE POLICY "service_role_only" ON signup_blocklist
      FOR ALL USING (false);
  END IF;
END $$;

-- 2026-10-30 GRANT 기한 대응 (CLAUDE.md 참조) — 신규 테이블은 처음부터 반영
grant select, insert, update, delete on public.signup_blocklist to service_role;

-- asikqq 어뷰징 계정 차단 (2026-11-23 요청) — (type, value) UNIQUE라 재실행해도 중복 안 됨
INSERT INTO signup_blocklist (type, value, reason) VALUES
  ('email',   'asikqq@atomicmail.io', 'asikqq 계정 차단 요청 (2026-11-23)'),
  ('pattern', 'asikqq',               'asikqq 연관 계정(다른 도메인 변형) 가입 차단 (2026-11-23)'),
  ('domain',  'atomicmail.io',        'asikqq 계정이 사용한 도메인 — 동일 도메인으로 재가입 방지 (2026-11-23)')
ON CONFLICT (type, value) DO NOTHING;
