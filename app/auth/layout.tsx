import type { Metadata } from "next";

// 로그인·회원가입 등 auth 페이지는 구글 색인 불필요
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
