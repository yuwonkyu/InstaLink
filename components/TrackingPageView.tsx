"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPurchase } from "@/lib/tracking";

// SPA 라우팅 시 각 픽셀에 PageView 재전송 + 결제 완료 전환 이벤트 처리
export default function TrackingPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const purchaseFiredRef = useRef(false);

  useEffect(() => {
    // 네이버 애널리틱스
    if (window.wcs_add && window.wcs) {
      window.wcs.do();
    }
    // Meta Pixel
    window.fbq?.("track", "PageView");
    // 카카오 픽셀
    const kakaoId = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
    if (kakaoId) window.kakaoPixel?.(kakaoId).pageView();
  }, [pathname, searchParams]);

  // 결제 완료 후 /dashboard?upgraded=1&plan=X&amount=Y 에서 한 번만 발화
  useEffect(() => {
    if (purchaseFiredRef.current) return;
    const upgraded = searchParams.get("upgraded");
    const plan = searchParams.get("plan");
    const amount = Number(searchParams.get("amount"));
    if (upgraded === "1" && plan && amount > 0) {
      purchaseFiredRef.current = true;
      trackPurchase(amount, plan);
    }
  }, [searchParams]);

  return null;
}
