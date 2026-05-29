import type { Metadata } from "next";

// 데모 체험 페이지는 구글 색인 불필요
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
