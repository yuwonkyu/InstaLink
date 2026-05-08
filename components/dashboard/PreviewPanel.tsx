"use client";

import { useEffect, useRef, useState } from "react";
import { getSiteUrl } from "@/lib/site-url";

type Props = { slug: string };

export default function PreviewPanel({ slug }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewOrigin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : getSiteUrl()
  );
  const previewUrl = `${previewOrigin}/${slug}`;

  // 저장 완료 이벤트 → iframe 새로고침
  useEffect(() => {
    function onSaved() {
      const iframe = iframeRef.current;
      if (!iframe) return;
      // src 재할당으로 리로드 (contentWindow.reload()는 cross-origin 차단될 수 있음)
      iframe.src = previewUrl + "?t=" + Date.now();
    }
    window.addEventListener("profile-saved", onSaved);
    return () => window.removeEventListener("profile-saved", onSaved);
  }, [previewUrl]);

  return (
    <>
      {/* ── 데스크탑 패널 (lg 이상) ── */}
      <div className="hidden lg:flex lg:flex-col lg:gap-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground">실시간 미리보기</p>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
          >
            새 탭으로 열기 →
          </a>
        </div>
        {/* 미리보기 iframe — 공개 페이지가 모바일 너비로 설계돼 있어 스케일링 불필요 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(17,24,39,0.08)]">
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="페이지 미리보기"
            className="w-full"
            style={{ border: "none", height: "680px" }}
          />
        </div>
        <p className="text-center text-[10px] text-(--muted)">저장하면 자동으로 새로고침됩니다</p>
      </div>

      {/* ── 모바일 플로팅 버튼 (lg 미만) ── */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-4 z-40 flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_16px_rgba(17,24,39,0.25)] active:scale-95 transition-transform"
        aria-label="미리보기 열기"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        미리보기
      </button>

      {/* ── 모바일 풀스크린 모달 ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <p className="text-sm font-semibold text-foreground">미리보기</p>
            <div className="flex items-center gap-3">
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                새 탭 →
              </a>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-foreground hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
          {/* iframe 풀스크린 */}
          <iframe
            src={previewUrl}
            title="페이지 미리보기"
            className="flex-1 w-full"
            style={{ border: "none" }}
          />
        </div>
      )}
    </>
  );
}
