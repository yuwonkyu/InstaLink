// Third-party tracking pixel window type declarations (auto-applied globally)
declare global {
  interface Window {
    wcs_add?: Record<string, string>;
    wcs?: { do: () => void };
    fbq?: {
      (type: "init", pixelId: string): void;
      (type: "track", event: string, params?: Record<string, unknown>): void;
    };
    kakaoPixel?: (id: string) => {
      pageView: () => void;
      completeRegistration: (params?: Record<string, unknown>) => void;
      purchase: (params: { total_price: number; currency: string }) => void;
    };
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

export {};
