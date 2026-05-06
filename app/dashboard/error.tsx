"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-[0_2px_12px_rgba(17,24,39,0.06)]">
      <p className="text-3xl">⚠️</p>
      <h2 className="mt-3 text-base font-bold text-foreground">
        대시보드를 불러오지 못했어요
      </h2>
      <p className="mt-1 text-sm text-(--muted)">
        잠시 후 다시 시도하거나, 문제가 계속되면 고객센터에 문의해주세요.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white hover:opacity-85 transition-opacity"
        >
          다시 시도
        </button>
        <Link
          href="/dashboard"
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors"
        >
          대시보드로
        </Link>
      </div>
      {error.digest && (
        <p className="mt-4 text-[11px] text-gray-300">코드: {error.digest}</p>
      )}
    </div>
  );
}
