import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "./LoginForm";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <AuthCard
      subtitle="내 링크 페이지 관리하기"
      heading="로그인"
      error={error ? decodeURIComponent(error) : undefined}
      footer={
        <>
          계정이 없으신가요?{" "}
          <Link href="/auth/signup" className="font-medium text-foreground hover:underline">
            회원가입
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
