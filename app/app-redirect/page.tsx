"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

function RedirectContent() {
  const params = useSearchParams();
  const attempted = useRef(false);

  const tryOpen = (code: string) => {
    // 1차: 프로덕션 빌드용 (instalink://)
    window.location.href = `instalink:///app-redirect?code=${code}`;
    // 2차: Expo Go 개발용 (exp+instalink-app://) — 1초 후 시도
    setTimeout(() => {
      window.location.href = `exp+instalink-app:///app-redirect?code=${code}`;
    }, 1000);
  };

  useEffect(() => {
    const code = params.get("code");
    if (!code || attempted.current) return;
    attempted.current = true;
    tryOpen(code);
  }, [params]);

  const handleButton = () => {
    const code = params.get("code");
    if (code) tryOpen(code);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <p className="text-lg font-bold text-gray-800">InstaLink 앱으로 이동 중...</p>
      <p className="text-sm text-gray-500">앱이 자동으로 열리지 않으면 아래 버튼을 눌러주세요.</p>
      <button
        onClick={handleButton}
        className="rounded-2xl bg-gray-900 px-8 py-3 text-sm font-bold text-white"
      >
        앱 열기
      </button>
    </div>
  );
}

export default function AppRedirectPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">이동 중...</p>
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
