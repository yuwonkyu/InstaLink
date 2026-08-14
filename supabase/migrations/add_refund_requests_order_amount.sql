-- refund_requests가 order_id·amount 컬럼 추가 전에 먼저 생성된 경우를 위한 보정
-- (CREATE TABLE IF NOT EXISTS는 기존 테이블에 컬럼을 추가해주지 않음)
ALTER TABLE refund_requests
  ADD COLUMN IF NOT EXISTS order_id text,
  ADD COLUMN IF NOT EXISTS amount   integer;

NOTIFY pgrst, 'reload schema';
