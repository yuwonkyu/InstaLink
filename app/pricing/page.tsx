import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "요금제 — InstaLink",
  description: "InstaLink 플랜별 요금 안내. 무료로 시작하고 필요할 때 업그레이드하세요.",
};

const PLANS = [
  {
    key: "free",
    label: "Free",
    monthly: 0,
    annual: 0,
    desc: "처음 시작하는 소상공인을 위한 플랜",
    features: [
      "링크인바이오 페이지 1개",
      "라이트 테마 1종",
      "서비스·후기 3개",
      "갤러리 사진 3장",
      "카카오 문의 버튼",
    ],
    limits: [
      "InstaLink 배지 표시 (숨기기 불가)",
      "방문자 통계 없음",
    ],
    highlight: false,
  },
  {
    key: "basic",
    label: "Basic",
    monthly: 19900,
    annual: 199000,
    desc: "본격적으로 고객을 모으고 싶은 사장님을 위한 플랜",
    features: [
      "테마 3종 (라이트·다크·UCC)",
      "서비스·후기 6개",
      "갤러리 사진 6장",
      "카카오 문의 버튼",
      "Free 모든 기능 포함",
    ],
    limits: [],
    highlight: true,
  },
  {
    key: "pro",
    label: "Pro",
    monthly: 29900,
    annual: 299000,
    desc: "데이터로 성장을 확인하고 싶은 사장님을 위한 플랜",
    features: [
      "Basic 모든 기능 + 테마 7종",
      "방문자 통계 + 주간 리포트",
      "AI 문구 추천",
      "섹션 순서·버튼 색상 커스텀",
      "InstaLink 배지 숨기기 가능",
    ],
    limits: [],
    highlight: false,
  },
] as const;

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">심플한 요금제</h1>
          <p className="mt-2 text-sm text-(--muted)">
            복잡한 거 없어, 필요한 만큼만 쓰세요.
          </p>
        </div>

        {/* 플랜 카드 3열 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.key}
              className={`relative flex flex-col rounded-2xl p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] ${
                plan.highlight
                  ? "bg-foreground text-white"
                  : "bg-white text-foreground"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-white">
                  추천
                </span>
              )}

              <div className="mb-4">
                <p className={`text-xs font-semibold uppercase tracking-widest ${plan.highlight ? "text-white/60" : "text-(--muted)"}`}>
                  {plan.label}
                </p>
                <p className={`mt-0.5 text-xs ${plan.highlight ? "text-white/70" : "text-(--muted)"}`}>
                  {plan.desc}
                </p>
                <div className="mt-3">
                  {plan.monthly === 0 ? (
                    <p className="text-3xl font-bold">₩0</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold">
                        ₩{plan.monthly.toLocaleString()}
                        <span className={`text-sm font-normal ${plan.highlight ? "text-white/60" : "text-(--muted)"}`}> / 월간 구독</span>
                      </p>
                      <p className={`mt-0.5 text-xs ${plan.highlight ? "text-amber-300" : "text-amber-600"}`}>
                        연간 결제 시 ₩{plan.annual.toLocaleString()}/년 (2개월 무료)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <ul className="flex flex-1 flex-col gap-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 ${plan.highlight ? "text-white/90" : "text-foreground"}`}>
                    <span className={`mt-0.5 shrink-0 ${plan.highlight ? "text-amber-300" : "text-green-500"}`}>✓</span>
                    <span>{f}</span>
                  </li>
                ))}
                {plan.limits.map((f) => (
                  <li key={f} className={`flex items-start gap-2 ${plan.highlight ? "text-white/40" : "text-(--muted)"}`}>
                    <span className="mt-0.5 shrink-0">–</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth/signup"
                className={`mt-6 block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-white text-foreground hover:brightness-95"
                    : "border border-gray-200 text-foreground hover:bg-(--secondary)"
                }`}
              >
                {plan.monthly === 0 ? "무료로 시작하기" : `${plan.label} 시작하기`}
              </Link>
            </div>
          ))}
        </div>

        {/* 자주 묻는 질문 */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-4 text-base font-semibold text-foreground">자주 묻는 질문</h2>
          <div className="flex flex-col gap-4 text-sm">
            <FaqItem
              q="언제든지 해지할 수 있나요?"
              a="네. 대시보드에서 즉시 해지할 수 있습니다. 해지 후에도 현재 결제한 기간 만료일까지 기능을 이용할 수 있습니다."
            />
            <FaqItem
              q="환불 정책은 어떻게 되나요?"
              a="결제일로부터 7일 이내 미사용 시 전액 환불이 가능합니다. 7일 초과 시 환불이 되지 않습니다."
            />
            <FaqItem
              q="결제 수단은 무엇인가요?"
              a="토스페이먼츠를 통한 신용카드·체크카드 결제를 지원합니다."
            />
            <FaqItem
              q="월간과 연간 구독의 차이는 무엇인가요?"
              a="월간 구독은 매월 자동결제, 연간 구독은 연 1회 일괄결제로 2개월 요금이 할인됩니다."
            />
          </div>
        </div>

        {/* 환불 정책 링크 */}
        <p className="mt-4 text-center text-xs text-(--muted)">
          자세한 환불 규정은{" "}
          <Link href="/refund" className="underline hover:text-foreground">환불 정책</Link>
          을 확인해 주세요.
        </p>

        {/* 사업자 정보 */}
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5 text-xs text-(--muted)">
          <p className="font-semibold text-foreground mb-2">사업자 정보</p>
          <div className="flex flex-col gap-1">
            <p>상호: {COMPANY_INFO.name}({COMPANY_INFO.nameEn}) · 대표자: {COMPANY_INFO.ceo}</p>
            <p>사업자등록번호: {COMPANY_INFO.bizNo}</p>
            <p>통신판매업 신고번호: {COMPANY_INFO.reportNo}</p>
            <p>주소: {COMPANY_INFO.address}</p>
            <p>전화: {COMPANY_INFO.phone}</p>
            <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-foreground transition">{COMPANY_INFO.email}</a>
          </div>
        </div>

        <nav className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-(--muted)">
          {[
            { href: "/terms", label: "이용약관" },
            { href: "/refund", label: "환불 정책" },
            { href: "/privacy", label: "개인정보처리방침" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </main>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="font-medium text-foreground">{q}</p>
      <p className="mt-1 text-(--muted)">{a}</p>
    </div>
  );
}
