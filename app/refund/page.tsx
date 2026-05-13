import Link from "next/link";
import type { Metadata } from "next";
import { COMPANY_INFO } from "@/lib/company-info";

export const metadata: Metadata = {
  title: "환불 정책 — InstaLink",
  description: "InstaLink 환불 정책",
};

const DATE = "2026년 5월 13일";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-(--secondary) px-4 py-10">
      <div className="mx-auto max-w-2xl">

        <div className="mb-8">
          <Link href="/" className="text-sm text-(--muted) hover:text-foreground">← 홈으로</Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">환불 정책</h1>
          <p className="mt-1 text-sm text-(--muted)">시행일: {DATE}</p>
        </div>

        <div className="flex flex-col gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)] text-sm leading-relaxed text-foreground">

          <Section title="제1조 (서비스 개요)">
            <p>
              InstaLink는 소상공인(카페·미용실·PT·필라테스 등)을 대상으로 인스타그램 바이오 링크 페이지를 제공하는
              SaaS(Software as a Service) 형태의 디지털 서비스입니다.
            </p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>서비스 형태: 월간·연간 구독 방식의 무형 디지털 서비스</li>
              <li>결제 즉시 서비스 이용이 가능합니다.</li>
              <li>결제 수단: 토스페이먼츠를 통한 신용카드·체크카드</li>
            </ul>
          </Section>

          <Section title="제2조 (구독 플랜)">
            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-(--secondary) p-4">
                <p className="font-medium">월간 구독</p>
                <p className="mt-1 text-xs text-(--muted)">
                  매월 자동결제 방식으로 이용 기간은 1개월입니다.
                  최초 결제일을 기준으로 매월 동일 날짜에 자동으로 청구됩니다.
                </p>
              </div>
              <div className="rounded-xl bg-(--secondary) p-4">
                <p className="font-medium">연간 구독</p>
                <p className="mt-1 text-xs text-(--muted)">
                  연 1회 결제 방식으로 이용 기간은 12개월입니다.
                </p>
              </div>
              <p className="text-xs text-(--muted)">
                결제 수단: 토스페이먼츠(주)를 통한 신용카드·체크카드 결제
              </p>
            </div>
          </Section>

          <Section title="제3조 (환불 기준)">
            <div className="flex flex-col gap-3">
              <div className="rounded-xl bg-(--secondary) p-4">
                <p className="font-medium">결제 후 7일 이내 — 전액 환불</p>
                <p className="mt-1 text-xs text-(--muted)">
                  유료 플랜 결제 후 7일 이내에 서비스를 실질적으로 이용하지 않은 경우 전액 환불이 가능합니다.
                </p>
              </div>
              <div className="rounded-xl bg-red-50 p-4">
                <p className="font-medium text-red-700">환불 불가 사유</p>
                <ul className="mt-1.5 flex list-disc flex-col gap-1 pl-5 text-xs text-red-600">
                  <li>결제 후 7일이 경과한 경우</li>
                  <li>서비스를 실질적으로 이용한 경우 (페이지 편집, AI 기능 사용 등)</li>
                  <li>이용약관 또는 콘텐츠 정책 위반으로 계정이 정지된 경우</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="제4조 (회사 귀책 사유에 의한 환불)">
            <p>다음의 경우 회사 귀책으로 인정하며 환불을 진행합니다.</p>
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-(--muted)">
              <li>결제 오류로 중복 결제된 경우: 전액 환불</li>
              <li>회사 귀책으로 서비스가 연속 72시간 이상 중단된 경우: 중단 기간 일할 환불</li>
            </ul>
            <p className="mt-3 text-xs text-(--muted)">
              환불 처리 기간: 5영업일 이내
            </p>
          </Section>

          <Section title="제5조 (구독 해지)">
            <p>
              구독은 언제든지 해지할 수 있습니다.
              해지 신청 후에도 <b className="text-foreground">현재 구독 기간 만료일까지</b> 서비스를 계속 이용할 수 있습니다.
              다음 결제일부터 자동 청구가 중단됩니다.
            </p>
            <div className="mt-3 rounded-xl bg-(--secondary) p-4">
              <p className="font-medium">셀프 해지 방법</p>
              <p className="mt-1 text-xs text-(--muted)">
                대시보드 → 구독 관리 메뉴에서 직접 해지할 수 있습니다.<br />
                별도 이메일 신청 없이 즉시 처리됩니다.
              </p>
            </div>
          </Section>

          <Section title="제6조 (환불 신청 방법)">
            <div className="rounded-xl bg-(--secondary) p-4">
              <p className="font-medium">환불 신청</p>
              <p className="mt-1 text-xs text-(--muted)">
                이메일:{" "}
                <a href={`mailto:${COMPANY_INFO.email}`} className="underline hover:text-foreground">
                  {COMPANY_INFO.email}
                </a><br />
                전화: {COMPANY_INFO.phone}<br />
                운영시간: 평일 10:00 ~ 18:00<br />
                <br />
                제목: [환불 신청] 가입 이메일 주소<br />
                내용: 결제일, 환불 사유를 포함해 보내주세요.<br />
                처리 기간: 영업일 기준 3~5일 이내
              </p>
            </div>
            <p className="mt-3 text-xs text-(--muted)">
              환불 금액은 결제 수단에 따라 카드사 처리 일정에 따라 반영됩니다 (통상 3~7 영업일 소요).
            </p>
          </Section>

        </div>

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

        <LegalNav current="refund" />
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

function LegalNav({ current }: { current: "terms" | "content-policy" | "refund" | "privacy" }) {
  const links = [
    { href: "/terms", label: "이용약관" },
    { href: "/content-policy", label: "콘텐츠 정책" },
    { href: "/refund", label: "환불 정책" },
    { href: "/privacy", label: "개인정보처리방침" },
    { href: "/pricing", label: "플랜 안내" },
  ];
  return (
    <nav className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-(--muted)">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={href === `/${current}` ? "font-semibold text-foreground" : "hover:text-foreground"}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
