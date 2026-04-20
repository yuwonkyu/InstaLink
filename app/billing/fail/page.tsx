import Link from "next/link";

type Props = {
  searchParams: Promise<{ message?: string; code?: string }>;
};

export default async function BillingFailPage({ searchParams }: Props) {
  const { message, code } = await searchParams;
  const errorMessage = message ? decodeURIComponent(message) : "결제 중 오류가 발생했습니다.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--secondary) px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
          ✕
        </div>
        <h1 className="text-lg font-bold text-foreground">결제 실패</h1>
        <p className="mt-2 text-sm text-(--muted)">{errorMessage}</p>
        {code && <p className="mt-1 font-mono text-xs text-(--muted)">코드: {code}</p>}
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/billing"
            className="w-full rounded-xl bg-foreground py-2.5 text-sm font-semibold text-white hover:opacity-80 transition-opacity"
          >
            다시 시도
          </Link>
          <Link
            href="/dashboard"
            className="w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-(--muted) hover:bg-(--secondary) transition-colors"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
