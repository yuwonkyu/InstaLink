import type { SupabaseClient } from "@supabase/supabase-js";

type BlockRuleType = "email" | "domain" | "pattern";
type BlockRule = { type: BlockRuleType; value: string };

/** signup_blocklist 테이블 기준으로 가입 차단 대상인지 확인 (service role 클라이언트 필요) */
export async function isSignupBlocked(
  admin: SupabaseClient,
  email: string,
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const atIndex = normalized.lastIndexOf("@");
  if (atIndex === -1) return false;

  const local = normalized.slice(0, atIndex);
  const domain = normalized.slice(atIndex + 1);

  const { data } = await admin.from("signup_blocklist").select("type, value");
  const rules = (data ?? []) as BlockRule[];

  return rules.some(({ type, value }) => {
    const v = value.toLowerCase();
    if (type === "email") return normalized === v;
    if (type === "domain") return domain === v;
    if (type === "pattern") return local.includes(v);
    return false;
  });
}
