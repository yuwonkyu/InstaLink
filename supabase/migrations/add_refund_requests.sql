-- 환불 신청 접수함
-- 고객이 /billing에서 신청 → 이 테이블에 저장 + 관리자 알림 이메일
-- 실제 결제 취소(환불)는 토스페이먼츠 콘솔에서 수동 처리, 여기서는 상태(대기/완료)만 관리

CREATE TABLE IF NOT EXISTS refund_requests (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id   uuid        REFERENCES profiles(id),
  owner_id     uuid        REFERENCES auth.users(id),
  email        text        NOT NULL,
  plan         text        NOT NULL,
  order_id     text,       -- 토스페이먼츠 주문번호 (신청 시점 최근 결제) — 콘솔에서 환불 처리 시 조회용
  amount       integer,    -- 결제 금액 (신청 시점 최근 결제)
  reason       text,
  status       text        NOT NULL DEFAULT 'pending', -- pending | completed
  created_at   timestamptz DEFAULT now() NOT NULL,
  processed_at timestamptz
);

-- service role(관리자 API route)만 접근 — 일반 유저/anon 직접 접근 차단
ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON refund_requests
  FOR ALL USING (false);

-- 2026-10-30 GRANT 기한 대응 (CLAUDE.md 참조) — 신규 테이블은 처음부터 반영
grant select, insert, update, delete on public.refund_requests to service_role;
