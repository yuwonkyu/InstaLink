import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options",    value: "nosniff" },
  { key: "X-Frame-Options",           value: "SAMEORIGIN" },
  { key: "X-XSS-Protection",          value: "1; mode=block" },
  { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // 응답 gzip/brotli 압축 활성화
  compress: true,

  images: {
    // 브라우저가 지원하면 AVIF → WebP 순서로 더 가벼운 포맷 자동 제공
    formats: ["image/avif", "image/webp"],
    // next/image 최적화 결과를 1년(CDN 캐시) 동안 보존
    minimumCacheTTL: 31_536_000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  async redirects() {
    return [
      // kku-ui.vercel.app 으로 들어온 모든 요청을 instalink 도메인으로 301 리다이렉트
      // SEO 중복 색인 방지 + 사용자 혼동 제거
      {
        source: "/:path*",
        has: [{ type: "host", value: "kku-ui.vercel.app" }],
        destination: "https://instalink.kkustudio.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // Next.js 빌드 해시가 붙은 정적 자산 — 내용이 바뀌면 URL도 바뀌므로 1년 캐시 안전
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // 공개 이미지·SVG·아이콘 — 짧은 재검증 주기로 내용 변경 반영
      {
        source: "/:file(.*\\.(?:png|jpg|jpeg|gif|svg|webp|avif|ico|woff2|woff))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // 보안 헤더 (모든 경로)
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
