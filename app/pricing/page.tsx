// 토스페이먼츠 심사용 플랜 페이지
// 경로: app/pricing/page.tsx
// 심사 완료 후 실제 결제 연동으로 업데이트 예정

import Link from "next/link";

export const metadata = {
  title: "요금제 | InstaLink",
  description: "InstaLink 월간·연간 구독 요금제를 확인해보세요.",
};

const PLANS = [
  {
    name: "Free",
    price: "0",
    period: "영원히 무료",
    description: "처음 시작하는 소상공인을 위한 플랜",
    features: [
      "링크인바이오 페이지 1개",
      "갤러리 이미지 3장",
      "카카오 문의 버튼",
      "InstaLink 배지 표시",
    ],
    cta: "무료로 시작하기",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9,900",
    period: "월 / 월간 구독",
    description: "본격적으로 고객을 모으고 싶은 사장님을 위한 플랜",
    features: [
      "Free 플랜의 모든 기능",
      "갤러리 이미지 무제한",
      "방문자 통계 (일별 차트)",
      "InstaLink 배지 제거",
      "맞춤 도메인 연결",
      "우선 고객지원",
    ],
    cta: "Pro 시작하기",
    highlighted: true,
    annualPrice: "99,000",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* 헤더 */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            심플한 요금제
          </h1>
          <p className="text-gray-500 text-lg">
            복잡한 거 없이, 필요한 만큼만 쓰세요.
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? "border-indigo-500 bg-indigo-50 shadow-lg"
                  : "border-gray-200 bg-white"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block mb-3 text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  추천
                </span>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {plan.name}
              </h2>
              <p className="text-sm text-gray-500 mb-5">{plan.description}</p>

              <div className="mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₩{plan.price}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {plan.period}
                </span>
              </div>

              {plan.annualPrice && (
                <p className="text-sm text-indigo-600 mb-6">
                  연간 결제 시 ₩{plan.annualPrice}/년 (17% 할인)
                </p>
              )}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`block w-full text-center py-3 rounded-xl font-medium transition ${
                  plan.highlighted
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ 간단 */}
        <div className="mt-16 pt-12 border-t border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            자주 묻는 질문
          </h2>
          <div className="space-y-5 max-w-2xl mx-auto">
            <div>
              <p className="font-medium text-gray-800">
                언제든 해지할 수 있나요?
              </p>
              <p className="text-gray-500 text-sm mt-1">
                네, 언제든 해지하실 수 있습니다. 해지 후에도 현재 결제 기간이
                끝날 때까지 서비스를 이용하실 수 있어요.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">
                환불 정책이 어떻게 되나요?
              </p>
              <p className="text-gray-500 text-sm mt-1">
                결제 후 15일 이내 환불 요청 시 잔여 일수 기준으로 일할 계산
                환불해드립니다. 자세한 내용은{" "}
                <Link href="/refund" className="text-indigo-600 underline">
                  환불정책 페이지
                </Link>
                를 확인해주세요.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-800">
                월간에서 연간으로 변경할 수 있나요?
              </p>
              <p className="text-gray-500 text-sm mt-1">
                대시보드 → 구독 관리에서 언제든 플랜을 변경하실 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-xs text-gray-400 text-center space-y-1">
          <p>
            뀨스튜디오(KKU Studio) | 대표: 유원규 | 사업자등록번호: 492-13-02963
          </p>
          <p>서울특별시 양천구 목동중앙본로26길 25, 202호 | 010-4748-2543</p>
          <p>
            <Link href="/refund" className="underline hover:text-gray-600">
              환불정책
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
