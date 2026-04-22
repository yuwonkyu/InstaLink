import Link from "next/link";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import { PLAN_META, type Plan } from "@/lib/types";
import { PLAN_FEATURE_ROWS } from "@/lib/plan-features";

// ── 정적 데이터 ────────────────────────────────────────────
const THEME_EXAMPLES = [
  {
    slug: "/sample",
    theme: "라이트",
    industry: "PT 트레이너",
    bg: "#ffffff",
    accent: "#111827",
    fg: "#111827",
    muted: "#6b7280",
    card: "#f5f5f5",
  },
  {
    slug: "/sample2",
    theme: "다크",
    industry: "필라테스 강사",
    bg: "#121212",
    accent: "#FEE500",
    fg: "#f3f4f6",
    muted: "#cbd5e1",
    card: "#1e1e1e",
  },
  {
    slug: "/sample3",
    theme: "웜리넨",
    industry: "헤어 디자이너",
    bg: "#f8f2e9",
    accent: "#b58458",
    fg: "#3a2c22",
    muted: "#725b49",
    card: "#fff9f0",
  },
];

const TARGETS = [
  { emoji: "🏋️", label: "PT 트레이너" },
  { emoji: "🧘", label: "필라테스 강사" },
  { emoji: "✂️", label: "헤어 디자이너" },
  { emoji: "💅", label: "네일 아티스트" },
  { emoji: "☕", label: "카페 사장님" },
  { emoji: "🐾", label: "펫샵 원장님" },
];

const FEATURES = [
  {
    emoji: "📋",
    title: "서비스 목록 + 가격 한눈에",
    desc: "고객이 제일 먼저 궁금해하는 것, 바로 \"얼마예요?\". 서비스별 가격을 깔끔하게 정리해 물어보기 전에 미리 답합니다.",
  },
  {
    emoji: "⭐",
    title: "실제 후기로 신뢰 쌓기",
    desc: "\"좋았어요\" 한마디가 열 번의 설명보다 낫습니다. 후기를 한 화면에 모아 처음 오는 고객도 안심하게 만드세요.",
  },
  {
    emoji: "💬",
    title: "카카오로 바로 문의",
    desc: "복잡한 DM 없이 버튼 하나로 카카오 상담까지 연결. 고객이 이탈하기 전에 잡습니다.",
  },
  {
    emoji: "📊",
    title: "방문자 통계 한눈에",
    desc: "오늘 몇 명이 내 페이지를 봤는지, 어떤 서비스를 클릭했는지 대시보드에서 바로 확인합니다.",
  },
];

const TESTIMONIALS = [
  {
    text: "링크트리는 그냥 링크 모음인데, InstaLink는 진짜 내 가게 소개 페이지예요. 고객들이 \"홈페이지 있어요?\" 하면 이거 보내줘요.",
    author: "박○○ PT 트레이너",
    location: "강남",
  },
  {
    text: "카카오 버튼 달고 나서 DM으로 가격 묻는 사람이 확 줄었어요. 다들 페이지 보고 바로 상담 신청해요.",
    author: "이○○ 헤어 디자이너",
    location: "홍대",
  },
  {
    text: "설정 5분이면 끝나요. 사진 올리고 가격 입력하면 끝. 이걸 왜 이제 알았지 싶어요.",
    author: "김○○ 필라테스 원장",
    location: "성수",
  },
];

const PLANS: Plan[] = ["free", "basic", "pro"];

// ── 서브 컴포넌트 ────────────────────────────────────────────
function CheckIcon() {
  return (
    <svg className="mx-auto h-5 w-5 text-foreground" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DashIcon() {
  return <span className="mx-auto block h-0.5 w-4 rounded bg-black/15" />;
}

function CellValue({ v }: { v: string | boolean }) {
  if (v === true)  return <CheckIcon />;
  if (v === false) return <DashIcon />;
  return <span className="text-xs font-medium">{v}</span>;
}

// ── 페이지 ────────────────────────────────────────────────────
export default function Page() {
  return (
    <main className="min-h-screen bg-(--secondary) text-foreground">
      <LandingHeader wide />

      {/* 히어로 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 pt-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-12 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-12 sm:py-16">
          <p className="inline-block rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-(--muted)">
            PT · 필라테스 · 미용 · 카페 소상공인용
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            인스타 바이오 링크 하나로
            <br />
            <span className="text-(--muted)">고객이 알아서 문의합니다</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-(--muted) sm:text-base">
            링크트리는 그냥 링크 목록이에요.
            <br />
            InstaLink는{" "}
            <strong className="font-semibold text-foreground">
              서비스 소개 + 가격 + 후기 + 카카오 상담
            </strong>
            까지 한 페이지에 담아 고객을 직접 문의로 이끕니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-white transition hover:opacity-85"
            >
              무료로 시작하기 →
            </Link>
            <Link
              href="/sample"
              className="rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-black/5"
            >
              예시 페이지 보기
            </Link>
          </div>
          <p className="mt-4 text-xs text-(--muted)">신용카드 불필요 · 5분 설정 · 즉시 공유</p>
        </div>
      </section>

      {/* 테마별 예시 미리보기 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <p className="text-center text-sm font-semibold text-(--muted)">테마별 예시 페이지</p>
        <p className="mt-1 text-center text-xs text-(--muted)">내 업종·분위기에 맞는 테마를 골라보세요</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {THEME_EXAMPLES.map((ex) => (
            <a
              key={ex.slug}
              href={ex.slug}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 shadow-[0_2px_12px_rgba(17,24,39,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(17,24,39,0.12)]"
              style={{ background: ex.bg }}
            >
              <div className="p-4">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 shrink-0 rounded-full" style={{ background: ex.muted, opacity: 0.35 }} />
                  <div className="flex flex-col gap-1">
                    <div className="h-2 w-20 rounded-full" style={{ background: ex.fg, opacity: 0.7 }} />
                    <div className="h-1.5 w-14 rounded-full" style={{ background: ex.accent, opacity: 0.6 }} />
                  </div>
                </div>
                <div className="mt-3 h-6 w-full rounded-lg" style={{ background: ex.accent, opacity: 0.85 }} />
                <div className="mt-2.5 flex flex-col gap-1.5">
                  {[{ w: "w-16" }, { w: "w-14" }].map((row, i) => (
                    <div key={i} className="flex justify-between rounded-lg px-2 py-1.5" style={{ background: ex.card }}>
                      <div className={`h-1.5 ${row.w} rounded-full self-center`} style={{ background: ex.fg, opacity: 0.5 }} />
                      <div className="h-1.5 w-10 rounded-full self-center" style={{ background: ex.fg, opacity: 0.7 }} />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="flex items-center justify-between border-t px-4 py-2.5"
                style={{ borderColor: `${ex.fg}15`, background: ex.card }}
              >
                <div>
                  <p className="text-xs font-bold" style={{ color: ex.fg }}>{ex.theme}</p>
                  <p className="text-[11px]" style={{ color: ex.muted }}>{ex.industry}</p>
                </div>
                <span
                  className="text-xs font-semibold opacity-60 transition group-hover:opacity-100"
                  style={{ color: ex.accent }}
                >
                  보기 →
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 타겟 섹션 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <p className="text-center text-sm font-semibold text-(--muted)">이런 분들이 쓰고 있어요</p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {TARGETS.map((t) => (
            <div
              key={t.label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-(--card) p-4 shadow-[0_2px_12px_rgba(17,24,39,0.05)]"
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-center text-xs font-medium leading-tight">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <div className="rounded-3xl bg-(--card) px-6 py-10 shadow-[0_4px_20px_rgba(17,24,39,0.06)] sm:px-10">
          <h2 className="text-xl font-bold sm:text-2xl">바이오 링크, 이렇게 달라요</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-(--muted)">
                Before — 링크트리
              </p>
              <ul className="space-y-2 text-sm text-(--muted)">
                <li>🔗 인스타 링크</li>
                <li>🔗 예약 링크</li>
                <li>🔗 블로그 링크</li>
                <li className="pt-2 text-xs opacity-60">→ 고객이 어디를 눌러야 할지 모름</li>
                <li className="text-xs opacity-60">→ 가격 물어보는 DM 계속 옴</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">
                After — InstaLink
              </p>
              <ul className="space-y-2 text-sm">
                <li>✅ 서비스 + 가격 한눈에</li>
                <li>✅ 실제 후기 바로 확인</li>
                <li>✅ 카카오 상담 버튼 한 번에</li>
                <li className="pt-2 text-xs text-(--muted)">→ 고객이 보고 바로 상담 신청</li>
                <li className="text-xs text-(--muted)">→ 가격 DM 대신 예약 DM이 옴</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 기능 소개 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">꼭 필요한 것만 담았어요</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl bg-(--card) p-6 shadow-[0_4px_20px_rgba(17,24,39,0.06)]"
            >
              <span className="text-2xl">{f.emoji}</span>
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-(--muted)">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 요금제 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">요금제</h2>
        <p className="mt-1 text-sm text-(--muted)">처음엔 무료로, 성장하면 그때 올리세요.</p>

        {/* 플랜 카드 */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => {
            const meta = PLAN_META[plan];
            const isHighlight = plan === "basic";
            return (
              <div
                key={plan}
                className={`rounded-2xl p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)] ${
                  isHighlight
                    ? "border-2 border-foreground bg-foreground text-white shadow-[0_8px_30px_rgba(17,24,39,0.18)]"
                    : "border border-black/5 bg-(--card)"
                }`}
              >
                <p className={`flex items-center gap-1.5 text-sm font-semibold ${isHighlight ? "opacity-70" : "text-(--muted)"}`}>
                  {meta.label}
                  {isHighlight && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">인기</span>
                  )}
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  {meta.price === 0 ? "무료" : `${meta.price.toLocaleString()}원`}
                </p>
                <p className={`mt-0.5 text-xs ${isHighlight ? "opacity-60" : "text-(--muted)"}`}>
                  {meta.price === 0 ? "영원히 무료" : "월 / 언제든 해지 가능"}
                </p>
                <Link
                  href="/auth/signup"
                  className={`mt-4 block rounded-xl py-2 text-center text-sm font-semibold transition ${
                    isHighlight
                      ? "bg-white text-foreground hover:opacity-90"
                      : "border border-black/10 hover:bg-black/5"
                  }`}
                >
                  시작하기
                </Link>
              </div>
            );
          })}
        </div>

        {/* 기능 비교 테이블 */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-black/5 bg-(--card) shadow-[0_4px_20px_rgba(17,24,39,0.06)]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-4 py-3 text-left font-semibold text-(--muted)">기능</th>
                {PLANS.map((plan) => (
                  <th key={plan} className={`px-4 py-3 text-center font-semibold ${plan === "basic" ? "text-foreground" : "text-(--muted)"}`}>
                    {PLAN_META[plan].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-black/5">
                  <td className="px-4 py-2.5 text-left text-(--muted)">{row.label}</td>
                  <td className="px-4 py-2.5 text-center"><CellValue v={row.free} /></td>
                  <td className="px-4 py-2.5 text-center"><CellValue v={row.basic} /></td>
                  <td className="px-4 py-2.5 text-center"><CellValue v={row.pro} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 후기 */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6">
        <h2 className="text-xl font-bold sm:text-2xl">실제 사용자 후기</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.author}
              className="rounded-2xl bg-(--card) p-5 shadow-[0_4px_20px_rgba(17,24,39,0.06)]"
            >
              <p className="text-sm leading-6 text-(--muted)">&#8220;{t.text}&#8221;</p>
              <footer className="mt-3 text-xs font-semibold">
                {t.author} · {t.location}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-3xl bg-foreground px-6 py-12 text-center text-white shadow-[0_8px_40px_rgba(17,24,39,0.2)] sm:px-12 sm:py-16">
          <h2 className="text-2xl font-extrabold sm:text-4xl">
            5분이면 내 가게 페이지 완성
          </h2>
          <p className="mt-4 text-sm leading-7 opacity-70 sm:text-base">
            지금 바로 만들어서 인스타 바이오에 붙여보세요.
            <br />
            무료 플랜은 카드 등록 없이 바로 시작할 수 있어요.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-foreground transition hover:opacity-90"
          >
            무료로 내 페이지 만들기 →
          </Link>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
