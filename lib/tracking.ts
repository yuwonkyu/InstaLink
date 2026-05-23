// Conversion event helpers — call at signup and purchase moments

export function trackSignup(): void {
  if (typeof window === "undefined") return;

  // Meta Pixel
  window.fbq?.("track", "CompleteRegistration");

  // 카카오 픽셀
  const kakaoId = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
  if (kakaoId) window.kakaoPixel?.(kakaoId).completeRegistration();

  // Google Ads 전환
  const signupConv = process.env.NEXT_PUBLIC_GOOGLE_ADS_SIGNUP_CONV;
  if (signupConv) window.gtag?.("event", "conversion", { send_to: signupConv });
}

export function trackPurchase(amount: number, plan: string): void {
  if (typeof window === "undefined") return;

  // Meta Pixel
  window.fbq?.("track", "Purchase", { value: amount, currency: "KRW", content_name: plan });

  // 카카오 픽셀
  const kakaoId = process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID;
  if (kakaoId) window.kakaoPixel?.(kakaoId).purchase({ total_price: amount, currency: "KRW" });

  // Google Ads 전환
  const purchaseConv = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_CONV;
  if (purchaseConv)
    window.gtag?.("event", "conversion", {
      send_to: purchaseConv,
      value: amount,
      currency: "KRW",
    });
}
