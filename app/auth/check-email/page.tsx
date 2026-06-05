import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ email?: string }> };

export default async function CheckEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-(--secondary) px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight text-foreground hover:opacity-80 transition">
            InstaLink
          </Link>
        </div>

        <div className="rounded-2xl bg-(--card) p-8 shadow-[0_4px_20px_rgba(17,24,39,0.06)] text-center">
          {/* 아이콘 */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
            📬
          </div>

          <h1 className="text-xl font-bold text-foreground">이메일을 확인해주세요</h1>

          <p className="mt-3 text-sm leading-6 text-(--muted)">
            {email ? (
              <>
                <span className="font-semibold text-foreground">{email}</span>
                <br />
              </>
            ) : null}
            가입 확인 링크를 보냈어요.
            <br />
            링크를 클릭하면 바로 시작할 수 있어요.
          </p>

          <div className="mt-6 rounded-xl bg-(--secondary) px-4 py-3 text-left text-xs text-(--muted) leading-5">
            <p className="font-semibold text-foreground mb-1">이메일이 안 오셨나요?</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>스팸·광고 메일함을 확인해보세요</li>
              <li>noreply@instalink 발신 이메일을 찾아보세요</li>
              <li>1~2분 기다린 후 새로고침 해보세요</li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/demo"
              className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
            >
              기다리는 동안 내 페이지 미리 만들어보기 →
            </Link>
            <Link
              href="/auth/login"
              className="w-full rounded-xl border border-black/10 bg-white py-2.5 text-sm font-medium text-(--muted) transition hover:bg-black/5"
            >
              이미 인증했어요 — 로그인하기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
