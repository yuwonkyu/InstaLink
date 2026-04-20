"use client";

import { useState } from "react";
import Script from "next/script";
import { PLAN_META, type Plan } from "@/lib/types";

// 토스페이먼츠 CDN 타입 선언
declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      billing: (opts: { customerKey: string }) => {
        requestBillingAuth: (opts: {
          method: string;
          successUrl: string;
          failUrl: string;
          customerEmail?: string;
          customerName?: string;
        }) => Promise<void>;
      };
    };
  }
}

type Props = {
  currentPlan: Plan;
  userId: string;
  userEmail: string;
  userName: string;
  clientKey: string;
  siteUrl: string;
};

export default function BillingClient({
  currentPlan,
  userId,
  userEmail,
  userName,
  clientKey,
  siteUrl,
}: Props) {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [sdkReady, setSdkReady] = useState(false);

  async function handleSelectPlan(plan: Plan) {
    if (plan === "free") {
      if (!confirm("Free 플랜으로 다운그레이드하면 구독이 취소됩니다. 계속하시겠습니까?")) return;
      setLoading("free");
      await fetch("/api/billing/cancel", { method: "POST" });
      window.location.href = "/dashboard";
      return;
    }

    if (!sdkReady || !window.TossPayments) {
      alert("결제 모듈이 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setLoading(plan);
    try {
      const tossPayments = window.TossPayments(clientKey);
      const billing = tossPayments.billing({ customerKey: userId });
      await billing.requestBillingAuth({
        method: "카드",
        successUrl: `${siteUrl}/billing/success?plan=${plan}`,
        failUrl: `${siteUrl}/billing/fail`,
        customerEmail: userEmail,
        customerName: userName || userEmail.split("@")[0],
      });
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  }

  return (
    <>
      {/* 토스페이먼츠 CDN SDK */}
      <Script
        src="https://js.tosspayments.com/v2/standard"
        onReady={() => setSdkReady(true)}
        strategy="afterInteractive"
      />

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["free", "basic", "pro"] as Plan[]).map((plan) => {
            const meta = PLAN_META[plan];
            const isCurrent = currentPlan === plan;
            const isLoading = loading === plan;

            return (
              <div
                key={plan}
                className={`relative flex flex-col rounded-2xl border-2 bg-white p-5 shadow-[0_2px_12px_rgba(17,24,39,0.06)] transition-all ${
                  isCurrent
                    ? "border-foreground"
                    : plan === "pro"
                      ? "border-amber-300"
                      : "border-gray-100"
                }`}
              >
                {plan === "basic" && !isCurrent && (
                  <span className="absolute -top-3 left-4 rounded-full bg-foreground px-3 py-0.5 text-xs font-semibold text-white">
                    추천
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 right-4 rounded-full bg-green-500 px-3 py-0.5 text-xs font-semibold text-white">
                    현재 플랜
                  </span>
                )}

                <p className="text-sm font-bold text-foreground">{meta.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {meta.price === 0 ? "무료" : `${meta.price.toLocaleString()}원`}
                  {meta.price > 0 && <span className="text-sm font-normal text-(--muted)">/월</span>}
                </p>

                <ul className="mt-4 flex flex-1 flex-col gap-1.5">
                  {meta.features.map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-xs text-(--muted)">
                      <span className="mt-0.5 text-green-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={isCurrent || isLoading}
                  onClick={() => handleSelectPlan(plan)}
                  className={`mt-5 w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${
                    plan === "free"
                      ? "border border-gray-200 text-foreground hover:bg-(--secondary)"
                      : "bg-foreground text-white hover:opacity-80"
                  }`}
                >
                  {isLoading
                    ? "처리 중…"
                    : isCurrent
                      ? "현재 플랜"
                      : plan === "free"
                        ? "다운그레이드"
                        : "이 플랜 시작하기"}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-(--muted)">
          결제는 토스페이먼츠를 통해 안전하게 처리됩니다. 언제든지 취소할 수 있습니다.
        </p>
      </div>
    </>
  );
}
