import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "요금제 — InstaLink",
  description: "InstaLink 플랜별 요금 안내. 무료로 시작하고 필요할 때 업그레이드하세요.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-3xl">

        <div className="mb-8 text-center">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">요금제 안내</h1>
          <p className="mt-2 text-sm text-(--muted)">
            소상공인을 위한 인스타 링크 페이지. 무료로 시작하고 필요할 때 업그레이드하세요.
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Free 플랜 */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
            <div className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-(--muted)">무료</p>
              <p className="mt-1 text-3xl font-bold text-foreground">0원</p>
              <p className="mt-0.5 text-xs text-(--muted)">영구 무료</p>
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              <PlanItem>링크인바이오 페이지 1개</PlanItem>
              <PlanItem>갤러리 사진 3장</PlanItem>
              <PlanItem>카카오 문의 버튼</PlanItem>
              <PlanItem>서비스·메뉴 등록</PlanItem>
              <PlanItem>후기 등록</PlanItem>
              <PlanItem disabled>InstaLink 배지 표시 (숨기기 불가)</PlanItem>
              <PlanItem disabled>방문자 통계</PlanItem>
              <PlanItem disabled>갤러리 무제한</PlanItem>
              <PlanItem disabled>맞춤 도메인</PlanItem>
            </ul>
            <Link
              href="/auth/signup"
              className="mt-6 block w-full rounded-xl border border-gray-200 py-2.5 text-center text-sm font-medium text-foreground transition hover:bg-(--secondary)"
            >
              무료로 시작하기
            </Link>
          </div>

          {/* Pro 플랜 */}
          <div className="rounded-2xl bg-foreground p-6 shadow-[0_4px_20px_rgba(17,24,39,0.12)]">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Pro</p>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white">인기</span>
              </div>
              <div className="mt-1 flex items-end gap-2">
                <p className="text-3xl font-bold text-white">9,900원</p>
                <p className="mb-1 text-sm text-white/60">/월</p>
              </div>
              <p className="mt-0.5 text-xs text-white/60">
                또는{" "}
                <span className="font-semibold text-white">99,000원/년</span>
                {" "}
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-xs text-white/80">17% 할인</span>
              </p>
            </div>
            <ul className="flex flex-col gap-2 text-sm">
              <PlanItemPro>링크인바이오 페이지 1개</PlanItemPro>
              <PlanItemPro>갤러리 사진 무제한</PlanItemPro>
              <PlanItemPro>카카오 문의 버튼</PlanItemPro>
              <PlanItemPro>서비스·메뉴 등록</PlanItemPro>
              <PlanItemPro>후기 등록</PlanItemPro>
              <PlanItemPro>InstaLink 배지 숨기기 가능</PlanItemPro>
              <PlanItemPro>방문자 통계 (14일 차트)</PlanItemPro>
              <PlanItemPro>맞춤 도메인 연결</PlanItemPro>
              <PlanItemPro>우선 고객 지원</PlanItemPro>
            </ul>
            <Link
              href="/auth/signup"
              className="mt-6 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-bold text-foreground transition hover:brightness-95"
            >
              Pro 시작하기
            </Link>
          </div>

        </div>

        {/* 자주 묻는 질문 */}
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <h2 className="mb-4 text-base font-semibold text-foreground">자주 묻는 질문</h2>
          <div className="flex flex-col gap-4 text-sm">
            <FaqItem
              q="언제든지 해지할 수 있나요?"
              a="네. 대시보드에서 즉시 해지할 수 있습니다. 해지 후에도 현재 결제한 기간 만료일까지 Pro 기능을 이용할 수 있습니다."
            />
            <FaqItem
              q="환불 정책은 어떻게 되나요?"
              a="결제 후 24시간 이내 이용 기록이 없으면 전액 환불, 이후 15일 이내는 잔여 일수 기준 일할 환불이 가능합니다."
            />
            <FaqItem
              q="결제 수단은 무엇인가요?"
              a="토스페이먼츠를 통한 신용카드·체크카드 결제를 지원합니다."
            />
            <FaqItem
              q="연간 구독은 어떻게 결제되나요?"
              a="연간 요금(99,000원)이 최초 결제 시 일괄 청구됩니다. 월간 대비 약 17% 할인된 가격입니다."
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

function PlanItem({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  return (
    <li className={`flex items-start gap-2 ${disabled ? "text-(--muted)" : "text-foreground"}`}>
      <span className="mt-0.5 shrink-0">{disabled ? "–" : "✓"}</span>
      <span>{children}</span>
    </li>
  );
}

function PlanItemPro({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-white/90">
      <span className="mt-0.5 shrink-0">✓</span>
      <span>{children}</span>
    </li>
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
