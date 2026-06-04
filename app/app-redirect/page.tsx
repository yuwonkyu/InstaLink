"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function RedirectContent() {
  const params = useSearchParams();

  const openApp = () => {
    const code = params.get("code");
    if (!code) return;
    window.location.href = `instalink:///app-redirect?code=${code}`;
    setTimeout(() => {
      window.location.href = `exp+instalink-app:///app-redirect?code=${code}`;
    }, 1000);
  };

  // 안드로이드(앱)에서만 자동 실행, 웹 브라우저는 버튼만 표시
  useEffect(() => {
    if (/android/i.test(navigator.userAgent)) {
      openApp();
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <p className="text-lg font-bold text-gray-800">InstaLink 앱으로 이동 중...</p>
      <p className="text-sm text-gray-500">자동으로 이동되지 않으면 아래 버튼을 눌러주세요.</p>
      <button
        onClick={openApp}
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
