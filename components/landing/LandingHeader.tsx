import Link from "next/link";

type Props = {
  wide?: boolean; // max-w-6xl (랜딩) vs max-w-3xl (카테고리)
};

export default function LandingHeader({ wide = true }: Props) {
  const maxW = wide ? "max-w-6xl" : "max-w-3xl";
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className={`mx-auto flex w-full ${maxW} items-center justify-between px-4 py-3 sm:px-6`}>
        <Link href="/" className="text-base font-bold tracking-tight">
          InstaLink
        </Link>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/auth/login"
            className="rounded-lg px-3 py-1.5 text-(--muted) transition hover:text-foreground"
          >
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-85"
          >
            무료 시작
          </Link>
        </nav>
      </div>
    </header>
  );
}
