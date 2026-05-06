"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-(--secondary) px-4 text-center">
      <p className="text-4xl">😵</p>
      <h1 className="text-lg font-bold text-foreground">문제가 발생했어요</h1>
      <p className="text-sm text-(--muted)">잠시 후 다시 시도해주세요.</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-white hover:opacity-85 transition-opacity"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors"
        >
          홈으로
        </Link>
      </div>
      {error.digest && (
        <p className="text-[11px] text-gray-300">오류 코드: {error.digest}</p>
      )}
    </div>
  );
}
