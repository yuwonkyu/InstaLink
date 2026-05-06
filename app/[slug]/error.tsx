"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[SlugError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-4xl">😓</p>
      <h1 className="text-base font-bold text-foreground">
        페이지를 불러오지 못했어요
      </h1>
      <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
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
          className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
